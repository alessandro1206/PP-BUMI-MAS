import { CalendarEvent, CalendarEventType, CalendarEventStatus } from '../types';

/**
 * Unfold RFC 5545 lines (lines starting with space or tab are continuations)
 */
function unfoldIcal(raw: string): string {
  return raw.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '');
}

/**
 * Unescape iCal text characters
 */
function unescapeIcalText(str: string): string {
  return str
    .replace(/\\n/gi, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
}

/**
 * Parse an iCal date or datetime string into date (YYYY-MM-DD) and time (HH:mm)
 */
function parseIcalDateTime(rawDtStr: string): { date: string; time: string } {
  const clean = rawDtStr.split(':').pop()?.trim() || '';

  // All-day date: YYYYMMDD
  if (clean.length === 8 && !clean.includes('T')) {
    const y = clean.substring(0, 4);
    const m = clean.substring(4, 6);
    const d = clean.substring(6, 8);
    return { date: `${y}-${m}-${d}`, time: '09:00' };
  }

  // DateTime format: YYYYMMDDTHHmmss(Z)
  if (clean.includes('T')) {
    if (clean.endsWith('Z')) {
      // UTC timestamp: convert to Asia/Jakarta (WIB = UTC+7)
      const y = parseInt(clean.substring(0, 4), 10);
      const m = parseInt(clean.substring(4, 6), 10) - 1;
      const d = parseInt(clean.substring(6, 8), 10);
      const hh = parseInt(clean.substring(9, 11), 10);
      const mm = parseInt(clean.substring(11, 13), 10);
      const ss = parseInt(clean.substring(13, 15) || '0', 10);

      const utcDate = new Date(Date.UTC(y, m, d, hh, mm, ss));
      const wibDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);

      const wy = wibDate.getUTCFullYear();
      const wm = String(wibDate.getUTCMonth() + 1).padStart(2, '0');
      const wd = String(wibDate.getUTCDate()).padStart(2, '0');
      const wh = String(wibDate.getUTCHours()).padStart(2, '0');
      const wmin = String(wibDate.getUTCMinutes()).padStart(2, '0');

      return { date: `${wy}-${wm}-${wd}`, time: `${wh}:${wmin}` };
    } else {
      // Local floating time
      const y = clean.substring(0, 4);
      const m = clean.substring(4, 6);
      const d = clean.substring(6, 8);
      const hh = clean.substring(9, 11) || '09';
      const mm = clean.substring(11, 13) || '00';
      return { date: `${y}-${m}-${d}`, time: `${hh}:${mm}` };
    }
  }

  // Fallback
  return { date: new Date().toISOString().split('T')[0], time: '09:00' };
}

/**
 * Extract tonnage in KG from summary and description
 */
function extractTonnage(text: string): number {
  const lower = text.toLowerCase();
  
  // Check for ton mentions like "25 ton", "15t", "20 t"
  const tonMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:ton\b|t\b)/i);
  if (tonMatch && tonMatch[1]) {
    const val = parseFloat(tonMatch[1].replace(',', '.'));
    if (!isNaN(val) && val > 0 && val < 500) {
      return Math.round(val * 1000);
    }
  }

  // Check for sak mentions like "500 sak", "300 sak"
  const sakMatch = lower.match(/(\d+)\s*(?:sak|zak)\b/i);
  if (sakMatch && sakMatch[1]) {
    const saks = parseInt(sakMatch[1], 10);
    if (!isNaN(saks) && saks > 0) {
      return saks * 50; // default 50kg per sak
    }
  }

  return 25000; // default 25 Ton for standard bulk delivery
}

/**
 * Extract brand AKA from text
 */
function extractBrandAka(text: string): string {
  const upper = text.toUpperCase();
  if (upper.includes('BCAMP') || upper.includes('DM')) return 'BCAMP';
  if (upper.includes('WIN 15') || upper.includes('WIN15') || upper.includes('WIN')) return 'WIN 15';
  if (upper.includes('RBN')) return 'RBN';
  if (upper.includes('FNB')) return 'FNB';
  if (upper.includes('PUTRI') || upper.includes('P.THAI') || upper.includes('THAILAND')) return 'CAP PUTRI';
  if (upper.includes('BETET')) return 'CAP BETET';
  if (upper.includes('PANDAN')) return 'PULAU PANDAN';
  if (upper.includes('SRI ARUM') || upper.includes('ARUM')) return 'SRI ARUM';
  if (upper.includes('GABAH')) return 'GABAH BASAH';
  return 'BERAS BM';
}

/**
 * Parse standard iCal (.ics) text into array of CalendarEvent
 */
export function parseIcalFeed(rawIcs: string): CalendarEvent[] {
  if (!rawIcs || !rawIcs.includes('BEGIN:VCALENDAR')) {
    throw new Error('Format data bukan merupakan berkas iCalendar (.ics) yang valid.');
  }

  const unfolded = unfoldIcal(rawIcs);
  const events: CalendarEvent[] = [];
  const eventBlocks = unfolded.split('BEGIN:VEVENT');

  // Skip the first chunk (header before the first VEVENT)
  for (let i = 1; i < eventBlocks.length; i++) {
    const block = eventBlocks[i].split('END:VEVENT')[0];
    const lines = block.split(/\r?\n/);

    let uid = `gcal-${Date.now()}-${i}`;
    let summary = '';
    let description = '';
    let location = '';
    let dtStart = '';
    let statusRaw = '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed.startsWith('UID:')) {
        uid = trimmed.substring(4).trim();
      } else if (trimmed.startsWith('SUMMARY:') || trimmed.startsWith('SUMMARY;')) {
        summary = unescapeIcalText(trimmed.split(':').slice(1).join(':').trim());
      } else if (trimmed.startsWith('DESCRIPTION:') || trimmed.startsWith('DESCRIPTION;')) {
        description = unescapeIcalText(trimmed.split(':').slice(1).join(':').trim());
      } else if (trimmed.startsWith('LOCATION:') || trimmed.startsWith('LOCATION;')) {
        location = unescapeIcalText(trimmed.split(':').slice(1).join(':').trim());
      } else if (trimmed.startsWith('DTSTART:') || trimmed.startsWith('DTSTART;')) {
        dtStart = trimmed;
      } else if (trimmed.startsWith('STATUS:')) {
        statusRaw = trimmed.substring(7).trim().toUpperCase();
      }
    }

    if (!summary && !description) continue;

    const { date, time } = parseIcalDateTime(dtStart);
    const combinedText = `${summary} ${description}`;
    const lowerCombined = combinedText.toLowerCase();

    // Determine event type
    let type: CalendarEventType = 'DO_DELIVERY';
    if (lowerCombined.includes('gabah')) {
      type = 'GABAH_ARRIVAL';
    } else if (lowerCombined.includes('transfer') || lowerCombined.includes('hutang') || lowerCombined.includes('bayar') || lowerCombined.includes('pelunasan')) {
      type = 'TRANSFER_PAYMENT';
    } else if (lowerCombined.includes('cor') || lowerCombined.includes('milling') || lowerCombined.includes('kiby')) {
      type = 'PRODUCTION_COR';
    } else if (lowerCombined.includes('evaluasi') || lowerCombined.includes('meeting') || lowerCombined.includes('stok') || lowerCombined.includes('catatan')) {
      type = 'GENERAL_NOTE';
    }

    // Determine status: compare with project date 2026-10-13
    let status: CalendarEventStatus = 'PLANNED';
    if (statusRaw === 'CANCELLED') {
      status = 'CANCELLED';
    } else if (date < '2026-10-13') {
      status = 'COMPLETED';
    } else if (date === '2026-10-13') {
      status = 'IN_PROGRESS';
    } else {
      status = 'PLANNED';
    }

    // Customer detection from description or summary
    let customerName = '';
    const custMatch = description.match(/Customer:\s*([^\n\r,]+)/i) || description.match(/Toko:\s*([^\n\r,]+)/i);
    if (custMatch && custMatch[1]) {
      customerName = custMatch[1].trim();
    } else if (lowerCombined.includes('bumi subur')) {
      customerName = 'BUMI SUBUR SURABAYA';
    } else if (lowerCombined.includes('terus jaya')) {
      customerName = 'UD TERUS JAYA SURABAYA';
    } else if (lowerCombined.includes('rbn')) {
      customerName = 'TOKO RBN SEMBAKO SURABAYA';
    } else if (lowerCombined.includes('fnb')) {
      customerName = 'FNB DISTRIBUTOR SEMBAKO';
    } else if (lowerCombined.includes('rejeki baru')) {
      customerName = 'UD REJEKI BARU SIDOARJO';
    } else if (lowerCombined.includes('mitra sembako')) {
      customerName = 'MITRA SEMBAKO DENPASAR';
    }

    const brandAka = extractBrandAka(combinedText);
    const totalKg = (type === 'TRANSFER_PAYMENT' || type === 'GENERAL_NOTE') ? 0 : extractTonnage(combinedText);

    events.push({
      id: uid,
      title: summary || 'Jadwal Kirim BM',
      date,
      time,
      type,
      status,
      customer_name: customerName,
      brand_aka: brandAka,
      total_kg: totalKg,
      expedition_info: location || (description.match(/Expedisi:\s*([^\n\r]+)/i)?.[1]?.trim() || ''),
      notes: description || summary,
      account_email: 'juwitasriwulandari@gmail.com',
      google_calendar_sync: true,
      created_at: new Date().toISOString()
    });
  }

  // Sort chronologically (earliest to latest)
  events.sort((a, b) => a.date.localeCompare(b.date));

  return events;
}

/**
 * Fetch iCal URL with automatic CORS proxy fallbacks
 */
export async function fetchIcalWithProxies(originalUrl: string): Promise<string> {
  let cleanUrl = originalUrl.trim();
  if (cleanUrl.startsWith('webcal://')) {
    cleanUrl = 'https://' + cleanUrl.substring(9);
  }

  const errors: string[] = [];

  // Attempt 1: Direct fetch
  try {
    const res = await fetch(cleanUrl);
    if (res.ok) {
      const text = await res.text();
      if (text.includes('BEGIN:VCALENDAR')) return text;
    }
  } catch (e: any) {
    errors.push(`Direct: ${e?.message || 'Blocked by CORS'}`);
  }

  // Attempt 2: AllOrigins proxy (raw)
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(cleanUrl)}`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const text = await res.text();
      if (text.includes('BEGIN:VCALENDAR')) return text;
    }
  } catch (e: any) {
    errors.push(`AllOrigins: ${e?.message || 'Failed'}`);
  }

  // Attempt 3: CorsProxy.io
  try {
    const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(cleanUrl)}`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const text = await res.text();
      if (text.includes('BEGIN:VCALENDAR')) return text;
    }
  } catch (e: any) {
    errors.push(`CorsProxy: ${e?.message || 'Failed'}`);
  }

  // Attempt 4: CodeTabs proxy
  try {
    const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(cleanUrl)}`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const text = await res.text();
      if (text.includes('BEGIN:VCALENDAR')) return text;
    }
  } catch (e: any) {
    errors.push(`CodeTabs: ${e?.message || 'Failed'}`);
  }

  throw new Error(
    `Tidak dapat mengakses URL kalender secara otomatis karena pembatasan browser (CORS). Anda dapat mengunduh berkas .ics langsung dari link tersebut di tab baru lalu mengunggahnya dengan tombol "Upload File .ICS" di bawah.`
  );
}
