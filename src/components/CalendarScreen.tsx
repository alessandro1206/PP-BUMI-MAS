import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Download, 
  Upload, 
  CheckCircle2, 
  Clock, 
  Truck, 
  User, 
  FileText, 
  Search, 
  Filter, 
  RotateCcw, 
  X, 
  Check, 
  Layers, 
  ArrowLeft,
  AlertCircle,
  Share2,
  Link,
  Key,
  Copy
} from 'lucide-react';
import { CalendarEvent, CalendarEventType, CalendarEventStatus } from '../types';

// Pre-seeded events from Juwita's Google Calendar (juwitasriwulandari@gmail.com)
const DEFAULT_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'gcal-win15-sep16',
    title: '9am win 15 BM',
    date: '2026-09-16',
    time: '09:00',
    type: 'DO_DELIVERY',
    status: 'COMPLETED',
    customer_name: 'UD TERUS JAYA SURABAYA',
    brand_aka: 'WIN 15',
    total_kg: 15000,
    nopol: 'P 8122 UY',
    expedition_info: 'EXP. DIPO OSOWILANGUN BLOK B3 SURABAYA',
    notes: 'Cap Putri Thailand 50KG (300 Sak = 15.000 KG)',
    account_email: 'juwitasriwulandari@gmail.com',
    google_calendar_sync: true
  },
  {
    id: 'gcal-bcamp25-sep21',
    title: '9am bcamp 25 BM',
    date: '2026-09-21',
    time: '09:00',
    type: 'DO_DELIVERY',
    status: 'COMPLETED',
    customer_name: 'BUMI SUBUR SURABAYA',
    brand_aka: 'BCAMP',
    total_kg: 25000,
    nopol: 'P 9081 AB',
    expedition_info: 'EXP. CARAVAN JL. KALIANAK 55 BLOK QQ NO. 9 SURABAYA',
    notes: 'Betet @10 (5t), Betet @20 (100sak), Betet @25 (400sak), P.Thai @5 (3t), P.Thai @10 (5t)',
    account_email: 'juwitasriwulandari@gmail.com',
    google_calendar_sync: true
  },
  {
    id: 'gcal-rbn25-sep22',
    title: '9am RBN 25 BM',
    date: '2026-09-22',
    time: '09:00',
    type: 'DO_DELIVERY',
    status: 'COMPLETED',
    customer_name: 'TOKO RBN SEMBAKO SURABAYA',
    brand_aka: 'RBN',
    total_kg: 25000,
    nopol: 'W 8762 UZ',
    expedition_info: 'EXP. DIPO OSOWILANGUN SURABAYA',
    notes: 'Cap Pandan @(5x10) KG (500 Sak = 25.000 KG)',
    account_email: 'juwitasriwulandari@gmail.com',
    google_calendar_sync: true
  },
  {
    id: 'gcal-fnb25-sep24',
    title: '9am FNB 25 BM',
    date: '2026-09-24',
    time: '09:00',
    type: 'DO_DELIVERY',
    status: 'COMPLETED',
    customer_name: 'FNB DISTRIBUTOR SEMBAKO',
    brand_aka: 'FNB',
    total_kg: 25000,
    nopol: 'L 9912 QA',
    expedition_info: 'EXP. KALIANAK BLOK BB NO. 12 SURABAYA',
    notes: 'Cap Putri Thailand 50KG (500 Sak = 25.000 KG)',
    account_email: 'juwitasriwulandari@gmail.com',
    google_calendar_sync: true
  },
  {
    id: 'gcal-gabah-sep28',
    title: '10am Kedatangan Gabah 18 Ton',
    date: '2026-09-28',
    time: '10:00',
    type: 'GABAH_ARRIVAL',
    status: 'COMPLETED',
    customer_name: 'H. AHMAD (SUPLIER SRONO)',
    brand_aka: 'GABAH BASAH',
    total_kg: 18450,
    nopol: 'P 8443 XA',
    notes: 'Kadar air 21%, hampa 7%. Langsung timbang dan masuk dryer.',
    account_email: 'juwitasriwulandari@gmail.com',
    google_calendar_sync: true
  },
  {
    id: 'gcal-betet-oct02',
    title: '8am Kirim Super Kepala 20 Ton',
    date: '2026-10-02',
    time: '08:00',
    type: 'DO_DELIVERY',
    status: 'COMPLETED',
    customer_name: 'UD REJEKI BARU SIDOARJO',
    brand_aka: 'CAP BETET',
    total_kg: 20000,
    nopol: 'W 8021 PB',
    expedition_info: 'EXP. WIRA LOGISTIK SURABAYA',
    notes: 'Cap Betet Super Kepala 25KG (800 Sak)',
    account_email: 'juwitasriwulandari@gmail.com',
    google_calendar_sync: true
  },
  {
    id: 'gcal-bcamp-oct05',
    title: '9am bcamp 25 BM (Kirim Rutin)',
    date: '2026-10-05',
    time: '09:00',
    type: 'DO_DELIVERY',
    status: 'COMPLETED',
    customer_name: 'BUMI SUBUR SURABAYA',
    brand_aka: 'BCAMP',
    total_kg: 25000,
    nopol: 'P 9102 BC',
    expedition_info: 'EXP. CARAVAN JL. KALIANAK 55',
    notes: 'P.Thai @10 (10t), Betet @25 (15t)',
    account_email: 'juwitasriwulandari@gmail.com',
    google_calendar_sync: true
  },
  {
    id: 'gcal-transfer-oct10',
    title: '11am Pelunasan & Transfer H-1 Asalan',
    date: '2026-10-10',
    time: '11:00',
    type: 'TRANSFER_PAYMENT',
    status: 'COMPLETED',
    customer_name: 'REKAP HUTANG SUPLIER GABAH',
    brand_aka: 'BCA OWNER',
    total_kg: 0,
    notes: 'Jadwal transfer H-1 asalan via internet banking BCA Owner.',
    account_email: 'juwitasriwulandari@gmail.com',
    google_calendar_sync: true
  },
  {
    id: 'gcal-eval-oct13',
    title: '2pm Evaluasi Stok Beras & Jadwal DO Baru',
    date: '2026-10-13',
    time: '14:00',
    type: 'GENERAL_NOTE',
    status: 'IN_PROGRESS',
    customer_name: 'INTERNAL PP BUMI MAS',
    brand_aka: 'ALL BRAND',
    notes: 'Meeting koordinasi jadwal kirim beras 4 varian bersama Juwita & Admin 1.',
    account_email: 'juwitasriwulandari@gmail.com',
    google_calendar_sync: true
  },
  {
    id: 'gcal-putri-oct15',
    title: '9am Putri Thailand 25 Ton',
    date: '2026-10-15',
    time: '09:00',
    type: 'DO_DELIVERY',
    status: 'PLANNED',
    customer_name: 'MITRA SEMBAKO DENPASAR',
    brand_aka: 'PUTRI THAI',
    total_kg: 25000,
    nopol: 'DK 8899 AB',
    expedition_info: 'EXP. BALI INDAH KETAPANG',
    notes: 'Cap Putri Thailand 50KG (500 Sak). Beras poles kristal baru.',
    account_email: 'juwitasriwulandari@gmail.com',
    google_calendar_sync: true
  },
  {
    id: 'gcal-gabah-oct18',
    title: '8am Kedatangan Gabah Basah 22 Ton',
    date: '2026-10-18',
    time: '08:00',
    type: 'GABAH_ARRIVAL',
    status: 'PLANNED',
    customer_name: 'H. JOKO (SUPLIER ROGOJAMPI)',
    brand_aka: 'GABAH BASAH',
    total_kg: 22000,
    notes: 'Kedatangan 1 Fuso dari area persawahan Rogojampi.',
    account_email: 'juwitasriwulandari@gmail.com',
    google_calendar_sync: true
  },
  {
    id: 'gcal-win15-oct22',
    title: '9am win 15 BM (Repeat Order)',
    date: '2026-10-22',
    time: '09:00',
    type: 'DO_DELIVERY',
    status: 'PLANNED',
    customer_name: 'UD TERUS JAYA SURABAYA',
    brand_aka: 'WIN 15',
    total_kg: 15000,
    expedition_info: 'EXP. DIPO OSOWILANGUN SURABAYA',
    notes: 'Pesanan lanjutan 15 Ton Cap Putri Thailand 50KG.',
    account_email: 'juwitasriwulandari@gmail.com',
    google_calendar_sync: true
  }
];

export const CalendarScreen: React.FC = () => {
  const { setActiveScreen, customers, deliveryOrders } = useApp();

  // Current viewed month and year
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date(2026, 9, 13)); // Default Oct 2026
  const [viewMode, setViewMode] = useState<'MONTH' | 'AGENDA' | 'GCAL_WEB'>('MONTH');

  // Calendar events persisted in localStorage
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem('bumimas_erp_calendar_events');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.error('Failed to load calendar events', err);
    }
    return DEFAULT_CALENDAR_EVENTS;
  });

  const saveEvents = (updated: CalendarEvent[]) => {
    setEvents(updated);
    try {
      localStorage.setItem('bumimas_erp_calendar_events', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save calendar events', err);
    }
  };

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal states for creating / editing events
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isNewEvent, setIsNewEvent] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('2026-10-13');
  const [formTime, setFormTime] = useState('09:00');
  const [formType, setFormType] = useState<CalendarEventType>('DO_DELIVERY');
  const [formStatus, setFormStatus] = useState<CalendarEventStatus>('PLANNED');
  const [formCustomer, setFormCustomer] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formTotalKg, setFormTotalKg] = useState<number>(25000);
  const [formNopol, setFormNopol] = useState('');
  const [formExpedition, setFormExpedition] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Quick import modal state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');

  // Google Calendar Secret iCal URL settings state
  const [showIcalSettingsModal, setShowIcalSettingsModal] = useState(false);
  const [secretIcalUrl, setSecretIcalUrl] = useState<string>(() => {
    return localStorage.getItem('bumimas_gcal_secret_ical_url') || '';
  });

  const handleSaveIcalUrl = (urlToSave: string) => {
    setSecretIcalUrl(urlToSave);
    try {
      localStorage.setItem('bumimas_gcal_secret_ical_url', urlToSave);
      alert('Alamat Secret iCal URL Google Calendar berhasil disimpan!');
    } catch (err) {
      console.error('Failed to save iCal URL', err);
    }
  };

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 9, 13)); // Match current project date Oct 13, 2026
  };

  // Generate calendar days for month grid
  const calendarGrid = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const grid: { dateStr: string; dayNum: number; isCurrentMonth: boolean; isToday: boolean }[] = [];

    // Leading days from previous month
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, dayNum);
      const mStr = String(prevDate.getMonth() + 1).padStart(2, '0');
      const dStr = String(dayNum).padStart(2, '0');
      const dateStr = `${prevDate.getFullYear()}-${mStr}-${dStr}`;
      grid.push({ dateStr, dayNum, isCurrentMonth: false, isToday: false });
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const mStr = String(month + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      const dateStr = `${year}-${mStr}-${dStr}`;
      const isToday = (year === 2026 && month === 9 && d === 13);
      grid.push({ dateStr, dayNum: d, isCurrentMonth: true, isToday });
    }

    // Trailing days for next month to complete rows (up to 35 or 42)
    const remaining = (7 - (grid.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(year, month + 1, d);
      const mStr = String(nextDate.getMonth() + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      const dateStr = `${nextDate.getFullYear()}-${mStr}-${dStr}`;
      grid.push({ dateStr, dayNum: d, isCurrentMonth: false, isToday: false });
    }

    return grid;
  }, [year, month]);

  // Open modal to add event on a specific date
  const handleOpenAdd = (dateStr?: string) => {
    setIsNewEvent(true);
    setSelectedEvent(null);
    setFormTitle('9am Order Baru BM');
    setFormDate(dateStr || `${year}-${String(month + 1).padStart(2, '0')}-13`);
    setFormTime('09:00');
    setFormType('DO_DELIVERY');
    setFormStatus('PLANNED');
    setFormCustomer('');
    setFormBrand('CAP PUTRI');
    setFormTotalKg(25000);
    setFormNopol('');
    setFormExpedition('');
    setFormNotes('Sync dengan Google Calendar Juwita (juwitasriwulandari@gmail.com)');
    setIsEditModalOpen(true);
  };

  // Open modal to edit existing event
  const handleOpenEdit = (evt: CalendarEvent) => {
    setIsNewEvent(false);
    setSelectedEvent(evt);
    setFormTitle(evt.title);
    setFormDate(evt.date);
    setFormTime(evt.time || '09:00');
    setFormType(evt.type);
    setFormStatus(evt.status);
    setFormCustomer(evt.customer_name || '');
    setFormBrand(evt.brand_aka || '');
    setFormTotalKg(evt.total_kg || 0);
    setFormNopol(evt.nopol || '');
    setFormExpedition(evt.expedition_info || '');
    setFormNotes(evt.notes || '');
    setIsEditModalOpen(true);
  };

  // Save event changes
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Judul jadwal / event tidak boleh kosong!');
      return;
    }

    if (isNewEvent) {
      const newEvt: CalendarEvent = {
        id: `evt-${Date.now()}`,
        title: formTitle.trim(),
        date: formDate,
        time: formTime,
        type: formType,
        status: formStatus,
        customer_name: formCustomer.trim(),
        brand_aka: formBrand.trim(),
        total_kg: Number(formTotalKg) || 0,
        nopol: formNopol.trim().toUpperCase(),
        expedition_info: formExpedition.trim(),
        notes: formNotes.trim(),
        account_email: 'juwitasriwulandari@gmail.com',
        google_calendar_sync: true,
        created_at: new Date().toISOString()
      };
      saveEvents([newEvt, ...events]);
    } else if (selectedEvent) {
      const updated = events.map(evt => {
        if (evt.id === selectedEvent.id) {
          return {
            ...evt,
            title: formTitle.trim(),
            date: formDate,
            time: formTime,
            type: formType,
            status: formStatus,
            customer_name: formCustomer.trim(),
            brand_aka: formBrand.trim(),
            total_kg: Number(formTotalKg) || 0,
            nopol: formNopol.trim().toUpperCase(),
            expedition_info: formExpedition.trim(),
            notes: formNotes.trim(),
            updated_at: new Date().toISOString()
          };
        }
        return evt;
      });
      saveEvents(updated);
    }

    setIsEditModalOpen(false);
  };

  // Delete event
  const handleDeleteEvent = () => {
    if (!selectedEvent) return;
    if (window.confirm(`Yakin ingin menghapus jadwal "${selectedEvent.title}"?`)) {
      saveEvents(events.filter(e => e.id !== selectedEvent.id));
      setIsEditModalOpen(false);
    }
  };

  // Reset to default sample events
  const handleResetDefault = () => {
    if (window.confirm('Kembalikan jadwal kalender ke data asli Google Calendar Juwita?')) {
      saveEvents(DEFAULT_CALENDAR_EVENTS);
      localStorage.removeItem('bumimas_erp_calendar_events');
    }
  };

  // Google Calendar URL generator for an event
  const getGoogleCalendarUrl = (evt: CalendarEvent) => {
    const titleEncoded = encodeURIComponent(evt.title);
    const dateFormatted = evt.date.replace(/-/g, '');
    const startTime = (evt.time || '09:00').replace(':', '') + '00';
    const datesStr = `${dateFormatted}T${startTime}/${dateFormatted}T${startTime}`;
    const detailsEncoded = encodeURIComponent(
      `Jadwal PP BUMI MAS / Beras Busur\n` +
      `Customer: ${evt.customer_name || '-'}\n` +
      `Merek AKA: ${evt.brand_aka || '-'}\n` +
      `Total Muatan: ${(evt.total_kg || 0).toLocaleString('id-ID')} KG\n` +
      `Ekspedisi: ${evt.expedition_info || '-'}\n` +
      `Catatan: ${evt.notes || '-'}\n\n` +
      `Sinkronisasi otomatis ERP Pabrik.`
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titleEncoded}&dates=${datesStr}&details=${detailsEncoded}`;
  };

  // Export all events to .ICS file for Google Calendar import
  const handleExportICS = () => {
    let icsContent = 
      'BEGIN:VCALENDAR\r\n' +
      'VERSION:2.0\r\n' +
      'PRODID:-//PP BUMI MAS//Beras Busur ERP Calendar//ID\r\n' +
      'CALSCALE:GREGORIAN\r\n' +
      'METHOD:PUBLISH\r\n' +
      'X-WR-CALNAME:Jadwal Kirim Beras Juwita BM\r\n' +
      'X-WR-TIMEZONE:Asia/Jakarta\r\n';

    events.forEach(evt => {
      const dtDate = evt.date.replace(/-/g, '');
      const dtTime = (evt.time || '09:00').replace(':', '') + '00';
      const uid = `${evt.id}@bumimas.erp`;
      const summary = evt.title.replace(/\n/g, ' ');
      const desc = `Customer: ${evt.customer_name || '-'}, Merek: ${evt.brand_aka || '-'}, Muatan: ${evt.total_kg || 0} KG, Notes: ${evt.notes || '-'}`.replace(/\n/g, '\\n');

      icsContent += 
        'BEGIN:VEVENT\r\n' +
        `UID:${uid}\r\n` +
        `DTSTAMP:${dtDate}T000000Z\r\n` +
        `DTSTART:${dtDate}T${dtTime}\r\n` +
        `SUMMARY:${summary}\r\n` +
        `DESCRIPTION:${desc}\r\n` +
        `STATUS:${evt.status === 'COMPLETED' ? 'CONFIRMED' : 'TENTATIVE'}\r\n` +
        'END:VEVENT\r\n';
    });

    icsContent += 'END:VCALENDAR\r\n';

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `jadwal_juwita_bumi_mas_${year}_${month + 1}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Auto-parse text input to add events
  const handleParseImportText = () => {
    if (!importText.trim()) return;
    const lines = importText.split('\n').filter(l => l.trim().length > 0);
    const newEventsToAdd: CalendarEvent[] = [];

    lines.forEach((line, idx) => {
      const lower = line.toLowerCase();
      let type: CalendarEventType = 'DO_DELIVERY';
      if (lower.includes('gabah')) type = 'GABAH_ARRIVAL';
      if (lower.includes('transfer') || lower.includes('hutang') || lower.includes('bayar')) type = 'TRANSFER_PAYMENT';
      if (lower.includes('cor') || lower.includes('milling')) type = 'PRODUCTION_COR';

      let totalKg = 25000;
      if (lower.includes('15') || lower.includes('15 ton')) totalKg = 15000;
      if (lower.includes('20') || lower.includes('20 ton')) totalKg = 20000;
      if (lower.includes('25') || lower.includes('25 ton')) totalKg = 25000;

      newEventsToAdd.push({
        id: `import-${Date.now()}-${idx}`,
        title: line.substring(0, 50).trim(),
        date: `${year}-${String(month + 1).padStart(2, '0')}-13`,
        time: '09:00',
        type,
        status: 'PLANNED',
        customer_name: 'Impor Teks Juwita',
        brand_aka: 'BERAS BM',
        total_kg: totalKg,
        notes: line,
        account_email: 'juwitasriwulandari@gmail.com',
        google_calendar_sync: true,
        created_at: new Date().toISOString()
      });
    });

    saveEvents([...newEventsToAdd, ...events]);
    setImportText('');
    setShowImportModal(false);
    alert(`Berhasil menambahkan ${newEventsToAdd.length} jadwal dari teks kalender!`);
  };

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      if (typeFilter !== 'ALL' && evt.type !== typeFilter) return false;
      if (statusFilter !== 'ALL' && evt.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = evt.title.toLowerCase().includes(q);
        const matchCust = (evt.customer_name || '').toLowerCase().includes(q);
        const matchBrand = (evt.brand_aka || '').toLowerCase().includes(q);
        const matchNopol = (evt.nopol || '').toLowerCase().includes(q);
        const matchNotes = (evt.notes || '').toLowerCase().includes(q);
        if (!matchTitle && !matchCust && !matchBrand && !matchNopol && !matchNotes) return false;
      }
      return true;
    });
  }, [events, typeFilter, statusFilter, searchQuery]);

  // Events map by date string for easy month grid rendering
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    filteredEvents.forEach(evt => {
      if (!map[evt.date]) map[evt.date] = [];
      map[evt.date].push(evt);
    });
    return map;
  }, [filteredEvents]);

  // Monthly summary stats
  const currentMonthEvents = useMemo(() => {
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    return events.filter(e => e.date.startsWith(prefix));
  }, [events, year, month]);

  const totalMonthlyTonnage = currentMonthEvents.reduce((acc, e) => acc + (e.total_kg || 0), 0);
  const plannedCount = currentMonthEvents.filter(e => e.status === 'PLANNED').length;
  const completedCount = currentMonthEvents.filter(e => e.status === 'COMPLETED').length;

  const getTypeBadgeColor = (type: CalendarEventType) => {
    switch (type) {
      case 'DO_DELIVERY':
        return 'bg-emerald-950 text-emerald-300 border-emerald-700/50 hover:border-emerald-500';
      case 'GABAH_ARRIVAL':
        return 'bg-amber-950 text-amber-300 border-amber-700/50 hover:border-amber-500';
      case 'TRANSFER_PAYMENT':
        return 'bg-blue-950 text-blue-300 border-blue-700/50 hover:border-blue-500';
      case 'PRODUCTION_COR':
        return 'bg-purple-950 text-purple-300 border-purple-700/50 hover:border-purple-500';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500';
    }
  };

  const getStatusBadge = (status: CalendarEventStatus) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Selesai / Terkirim</span>;
      case 'IN_PROGRESS':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">Sedang Muat</span>;
      case 'CANCELLED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">Batal</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">Rencana Jadwal</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="bg-[#1e1e2a] border border-[#70707d]/20 rounded-[12px] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-mono uppercase tracking-wider text-[#c3c3cc]">
                Sistem Jadwal Terpadu • PP BUMI MAS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#ededf3] flex items-center space-x-3">
              <CalendarIcon className="w-7 h-7 text-emerald-400" />
              <span>Kalender Jadwal Kirim &amp; Logistik</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#c3c3cc]">
              Sinkronisasi kalender operasional dengan Google Calendar Juwita (<strong>juwitasriwulandari@gmail.com</strong>). Anda dapat melihat, menambah, mengubah, dan menghapus jadwal kapan saja.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleOpenAdd()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Jadwal</span>
            </button>

            <a
              href="https://calendar.google.com/calendar/u/0/r"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-[#272735] hover:bg-[#323244] text-[#ededf3] rounded-full text-xs font-semibold border border-[#70707d]/30 transition flex items-center space-x-1.5"
              title="Buka Google Calendar di Tab Baru"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Buka Google Calendar</span>
            </a>

            <button
              onClick={handleExportICS}
              className="px-3.5 py-2 bg-[#272735] hover:bg-[#323244] text-[#ededf3] rounded-full text-xs font-semibold border border-[#70707d]/30 transition flex items-center space-x-1.5"
              title="Download file .ics untuk import ke Google Calendar Juwita"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ekspor .ICS</span>
            </button>

            <button
              onClick={() => setShowIcalSettingsModal(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-600 hover:to-emerald-600 text-white rounded-full text-xs font-bold transition flex items-center space-x-1.5 shadow"
              title="Hubungkan Secret iCal URL Google Calendar Juwita"
            >
              <Link className="w-3.5 h-3.5 text-teal-200" />
              <span>{secretIcalUrl ? 'Tersambung iCal' : 'Hubungkan iCal URL'}</span>
            </button>

            <button
              onClick={() => setShowImportModal(true)}
              className="px-3.5 py-2 bg-[#272735] hover:bg-[#323244] text-[#ededf3] rounded-full text-xs font-semibold border border-[#70707d]/30 transition flex items-center space-x-1.5"
              title="Paste teks deskripsi event kalender"
            >
              <Upload className="w-3.5 h-3.5 text-blue-400" />
              <span>Impor Teks</span>
            </button>

            <button
              onClick={handleResetDefault}
              className="p-2 bg-[#272735] hover:bg-[#323244] text-[#c3c3cc] hover:text-white rounded-full border border-[#70707d]/30 transition"
              title="Reset ke data awal Google Calendar Juwita"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Month Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#70707d]/20">
          <div className="bg-[#272735] p-3 rounded-xl border border-[#70707d]/20">
            <span className="text-[10px] font-mono uppercase text-[#c3c3cc] block">Bulan Aktif</span>
            <span className="text-sm sm:text-base font-bold text-white">
              {monthNames[month]} {year}
            </span>
          </div>

          <div className="bg-[#272735] p-3 rounded-xl border border-[#70707d]/20">
            <span className="text-[10px] font-mono uppercase text-[#c3c3cc] block">Total Muatan Kirim</span>
            <span className="text-sm sm:text-base font-bold text-emerald-400">
              {totalMonthlyTonnage.toLocaleString('id-ID')} KG
            </span>
          </div>

          <div className="bg-[#272735] p-3 rounded-xl border border-[#70707d]/20">
            <span className="text-[10px] font-mono uppercase text-[#c3c3cc] block">Jadwal Rencana</span>
            <span className="text-sm sm:text-base font-bold text-blue-400">
              {plannedCount} Jadwal
            </span>
          </div>

          <div className="bg-[#272735] p-3 rounded-xl border border-[#70707d]/20">
            <span className="text-[10px] font-mono uppercase text-[#c3c3cc] block">Selesai Terkirim</span>
            <span className="text-sm sm:text-base font-bold text-amber-400">
              {completedCount} Selesai
            </span>
          </div>
        </div>
      </div>

      {/* Navigation & Controls Bar */}
      <div className="bg-[#1e1e2a] border border-[#70707d]/20 rounded-[12px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Month Selector Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-lg bg-[#272735] hover:bg-[#323244] text-[#ededf3] border border-[#70707d]/30 transition"
            title="Bulan Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleToday}
            className="px-3.5 py-1.5 rounded-lg bg-[#272735] hover:bg-[#323244] text-xs font-bold text-emerald-400 border border-[#70707d]/30 transition"
          >
            Hari Ini (13 Okt)
          </button>

          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg bg-[#272735] hover:bg-[#323244] text-[#ededf3] border border-[#70707d]/30 transition"
            title="Bulan Berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="text-base sm:text-lg font-bold text-white px-2">
            {monthNames[month]} {year}
          </span>
        </div>

        {/* View Mode & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#c3c3cc] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari toko, merek, nopol..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-[#272735] border border-[#70707d]/30 text-xs font-normal text-white placeholder-[#70707d] outline-none focus:border-emerald-500 w-44 sm:w-56"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#272735] border border-[#70707d]/30 text-xs font-semibold text-white outline-none"
          >
            <option value="ALL">Semua Jenis</option>
            <option value="DO_DELIVERY">Kirim Beras (DO)</option>
            <option value="GABAH_ARRIVAL">Kedatangan Gabah</option>
            <option value="TRANSFER_PAYMENT">Transfer / Pelunasan</option>
            <option value="PRODUCTION_COR">Produksi Cor</option>
            <option value="GENERAL_NOTE">Catatan Umum</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex rounded-lg bg-[#272735] p-0.5 border border-[#70707d]/30">
            <button
              onClick={() => setViewMode('MONTH')}
              className={`px-3 py-1 rounded text-xs font-bold transition ${
                viewMode === 'MONTH' ? 'bg-emerald-600 text-white shadow-sm' : 'text-[#c3c3cc] hover:text-white'
              }`}
            >
              Bulan
            </button>
            <button
              onClick={() => setViewMode('AGENDA')}
              className={`px-3 py-1 rounded text-xs font-bold transition ${
                viewMode === 'AGENDA' ? 'bg-emerald-600 text-white shadow-sm' : 'text-[#c3c3cc] hover:text-white'
              }`}
            >
              Agenda
            </button>
            <button
              onClick={() => setViewMode('GCAL_WEB')}
              className={`px-3 py-1 rounded text-xs font-bold transition ${
                viewMode === 'GCAL_WEB' ? 'bg-amber-600 text-white shadow-sm' : 'text-[#c3c3cc] hover:text-white'
              }`}
            >
              Google Web
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: MONTHLY GRID VIEW (Full Interactive Calendar)
          ========================================================================= */}
      {viewMode === 'MONTH' && (
        <div className="bg-[#1e1e2a] border border-[#70707d]/20 rounded-[12px] overflow-hidden shadow-sm">
          {/* Day Names Header */}
          <div className="grid grid-cols-7 bg-[#272735] border-b border-[#70707d]/30 text-center py-2.5 text-xs font-bold font-mono tracking-wider text-[#c3c3cc]">
            <span className="text-rose-400">MINGGU</span>
            <span>SENIN</span>
            <span>SELASA</span>
            <span>RABU</span>
            <span>KAMIS</span>
            <span>JUMAT</span>
            <span className="text-emerald-400">SABTU</span>
          </div>

          {/* Calendar Grid Cells */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-[#70707d]/20 bg-[#171721]">
            {calendarGrid.map((day, idx) => {
              const dayEvents = eventsByDate[day.dateStr] || [];
              const dayTotalKg = dayEvents.reduce((acc, it) => acc + (it.total_kg || 0), 0);

              return (
                <div
                  key={idx}
                  className={`min-h-[110px] sm:min-h-[135px] p-1.5 sm:p-2 transition flex flex-col justify-between ${
                    day.isCurrentMonth ? 'bg-[#1e1e2a]/90 hover:bg-[#252535]' : 'bg-[#14141c]/60 text-[#70707d]'
                  } ${day.isToday ? 'ring-2 ring-emerald-400/80 bg-emerald-950/20' : ''}`}
                  onClick={() => {
                    // Clicking on an empty space adds an event on this date
                    if (dayEvents.length === 0) {
                      handleOpenAdd(day.dateStr);
                    }
                  }}
                >
                  {/* Date Header inside cell */}
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-bold font-mono rounded-full w-6 h-6 flex items-center justify-center ${
                        day.isToday
                          ? 'bg-emerald-500 text-white font-extrabold shadow'
                          : day.isCurrentMonth
                          ? 'text-[#ededf3]'
                          : 'text-[#70707d]'
                      }`}
                    >
                      {day.dayNum}
                    </span>

                    <div className="flex items-center space-x-1">
                      {dayTotalKg > 0 && (
                        <span className="text-[10px] font-mono font-bold text-emerald-400 hidden sm:inline">
                          {(dayTotalKg / 1000).toFixed(0)}T
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenAdd(day.dateStr);
                        }}
                        className="opacity-0 group-hover:opacity-100 hover:opacity-100 p-0.5 rounded bg-[#272735] text-[#c3c3cc] hover:text-white transition"
                        title="Tambah jadwal di tanggal ini"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Events Badges in this Cell */}
                  <div className="space-y-1 overflow-y-auto max-h-[85px] sm:max-h-[100px] pr-0.5">
                    {dayEvents.map(evt => (
                      <div
                        key={evt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(evt);
                        }}
                        className={`px-1.5 py-1 rounded text-[10px] sm:text-[11px] font-semibold border cursor-pointer transition truncate flex items-center justify-between space-x-1 ${getTypeBadgeColor(
                          evt.type
                        )}`}
                        title={`${evt.title} - ${evt.customer_name || ''} (${(evt.total_kg || 0).toLocaleString('id-ID')} KG)`}
                      >
                        <div className="truncate flex-1">
                          <span className="font-bold mr-1">{evt.time || '09:00'}</span>
                          <span>{evt.title}</span>
                        </div>
                        {evt.status === 'COMPLETED' && (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Cell Bottom Tonnage Footer */}
                  {dayEvents.length > 2 && (
                    <div className="text-[9px] font-mono text-[#70707d] text-right pt-0.5">
                      +{dayEvents.length - 2} lagi
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: AGENDA LIST VIEW
          ========================================================================= */}
      {viewMode === 'AGENDA' && (
        <div className="bg-[#1e1e2a] border border-[#70707d]/20 rounded-[12px] p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-[#70707d]/20 pb-3">
            <h3 className="font-bold text-white text-base flex items-center space-x-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Daftar Agenda Jadwal Logistik &amp; DO ({filteredEvents.length} Entri)</span>
            </h3>
            <span className="text-xs font-mono text-[#c3c3cc]">
              Urut Berdasarkan Tanggal
            </span>
          </div>

          <div className="space-y-3">
            {filteredEvents.map(evt => (
              <div
                key={evt.id}
                className="bg-[#272735] border border-[#70707d]/30 hover:border-emerald-500/60 p-4 rounded-xl transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1e1e2a] text-emerald-400 border border-emerald-500/30">
                      📅 {evt.date} • {evt.time || '09:00'} WIB
                    </span>
                    {getStatusBadge(evt.status)}
                    {evt.brand_aka && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        Merek: {evt.brand_aka}
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-white flex items-center space-x-2">
                    <span>{evt.title}</span>
                    {evt.total_kg ? (
                      <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        {evt.total_kg.toLocaleString('id-ID')} KG
                      </span>
                    ) : null}
                  </h4>

                  <div className="text-xs text-[#c3c3cc] space-y-0.5">
                    {evt.customer_name && (
                      <div><strong>Toko / Customer:</strong> {evt.customer_name}</div>
                    )}
                    {evt.expedition_info && (
                      <div><strong>Ekspedisi:</strong> {evt.expedition_info}</div>
                    )}
                    {evt.notes && (
                      <div className="text-[#c3c3cc]/80 italic">Catatan: {evt.notes}</div>
                    )}
                  </div>
                </div>

                {/* Actions on this row */}
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(evt)}
                    className="px-3 py-1.5 rounded-lg bg-[#1e1e2a] hover:bg-emerald-600 text-white text-xs font-bold border border-[#70707d]/30 transition flex items-center space-x-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Ubah Jadwal</span>
                  </button>

                  <a
                    href={getGoogleCalendarUrl(evt)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-[#1e1e2a] hover:bg-[#323244] text-[#c3c3cc] hover:text-amber-400 border border-[#70707d]/30 transition"
                    title="Buka / Tambah ke Google Calendar Juwita"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus jadwal "${evt.title}"?`)) {
                        saveEvents(events.filter(e => e.id !== evt.id));
                      }
                    }}
                    className="p-2 rounded-lg bg-[#1e1e2a] hover:bg-rose-900 text-[#c3c3cc] hover:text-rose-300 border border-[#70707d]/30 transition"
                    title="Hapus Event"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {filteredEvents.length === 0 && (
              <div className="text-center py-12 text-[#70707d]">
                <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Tidak ada jadwal yang sesuai dengan filter.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: GOOGLE CALENDAR WEB VIEW & SYNC HUB
          ========================================================================= */}
      {viewMode === 'GCAL_WEB' && (
        <div className="bg-[#1e1e2a] border border-[#70707d]/20 rounded-[12px] p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#70707d]/20 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <ExternalLink className="w-5 h-5 text-amber-400" />
                <span>Integrasi Google Calendar (juwitasriwulandari@gmail.com)</span>
              </h3>
              <p className="text-xs text-[#c3c3cc] mt-1">
                Akses web langsung ke kalender Juwita untuk sinkronisasi dua arah dengan smartphone dan perangkat lapangan.
              </p>
            </div>

            <a
              href="https://calendar.google.com/calendar/u/0/r"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-full transition flex items-center space-x-2 shadow"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Buka Google Calendar di Tab Terpisah</span>
            </a>
          </div>

          <div className="bg-[#272735] border border-amber-500/30 rounded-xl p-5 space-y-3">
            <h4 className="font-bold text-amber-300 text-sm flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Petunjuk Sinkronisasi Otomatis Google Calendar Juwita</span>
            </h4>
            <ul className="text-xs text-[#ededf3] space-y-2 list-disc pl-5">
              <li>
                <strong>Format Event Kalender Juwita:</strong> <code>[Jam] [Merek/AKA] [Tonnage] BM</code> (Contoh: <code>9am bcamp 25 BM</code> atau <code>9am win 15 BM</code>).
              </li>
              <li>
                <strong>Sinkronisasi ke HP Juwita:</strong> Tekan tombol <strong>"Ekspor .ICS"</strong> di atas untuk mengunduh berkas kalender lalu buka langsung di Google Calendar Android / iPhone.
              </li>
              <li>
                <strong>Pencatatan Surat Jalan (DO):</strong> Setiap event kalender yang disimpan dapat langsung dikonversi menjadi Surat Jalan resmi multi-item di modul Admin 1 (Surat Jalan DO).
              </li>
            </ul>
          </div>

          <div className="border border-[#70707d]/30 rounded-xl overflow-hidden bg-white h-[600px] flex flex-col items-center justify-center p-6 text-center text-slate-800 space-y-4">
            <CalendarIcon className="w-16 h-16 text-emerald-600" />
            <div className="max-w-md space-y-2">
              <h4 className="text-lg font-bold text-slate-900">
                Akses Google Calendar Resmi
              </h4>
              <p className="text-xs text-slate-600">
                Google Calendar memerlukan login akun <strong>juwitasriwulandari@gmail.com</strong> di peramban Anda. Klik tombol di bawah untuk membuka antarmuka kalender langsung:
              </p>
            </div>
            <a
              href="https://calendar.google.com/calendar/u/0/r"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full shadow-lg transition flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Buka kalender Juwita sekarang</span>
            </a>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD / EDIT / CHANGE EVENT
          ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e1e2a] border border-[#70707d]/30 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#70707d]/20 pb-3">
              <div className="space-y-0.5">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5 text-emerald-400" />
                  <span>{isNewEvent ? 'Tambah Jadwal Baru' : 'Ubah & Edit Jadwal'}</span>
                </h3>
                <span className="text-[10px] font-mono text-emerald-400">
                  Akun: juwitasriwulandari@gmail.com
                </span>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-[#c3c3cc] hover:text-white hover:bg-[#272735] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEvent} className="space-y-4">
              {/* Judul Event / Jadwal */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#ededf3] block">
                  Judul Event (Format Kalender Juwita):
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Contoh: 9am bcamp 25 BM"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#272735] border border-[#70707d]/30 text-white font-bold text-sm focus:border-emerald-500 outline-none"
                />
              </div>

              {/* Tanggal & Waktu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#ededf3] block">
                    Tanggal Pengiriman / Kedatangan:
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#272735] border border-[#70707d]/30 text-white font-bold text-xs focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#ededf3] block">
                    Waktu / Jam (WIB):
                  </label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#272735] border border-[#70707d]/30 text-white font-bold text-xs focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Tipe & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#ededf3] block">
                    Kategori Event:
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as CalendarEventType)}
                    className="w-full px-3 py-2 rounded-xl bg-[#272735] border border-[#70707d]/30 text-white font-semibold text-xs focus:border-emerald-500 outline-none"
                  >
                    <option value="DO_DELIVERY">Pengiriman Beras DO</option>
                    <option value="GABAH_ARRIVAL">Kedatangan Gabah</option>
                    <option value="TRANSFER_PAYMENT">Transfer / Pelunasan Hutang</option>
                    <option value="PRODUCTION_COR">Produksi Cor Milling</option>
                    <option value="GENERAL_NOTE">Catatan Operasional</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#ededf3] block">
                    Status Pengerjaan:
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as CalendarEventStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-[#272735] border border-[#70707d]/30 text-white font-semibold text-xs focus:border-emerald-500 outline-none"
                  >
                    <option value="PLANNED">Rencana Jadwal</option>
                    <option value="IN_PROGRESS">Sedang Muat Truk</option>
                    <option value="COMPLETED">Selesai / Terkirim</option>
                    <option value="CANCELLED">Dibatalkan</option>
                  </select>
                </div>
              </div>

              {/* Customer & Merek AKA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#ededf3] block">
                    Nama Customer / Toko:
                  </label>
                  <input
                    type="text"
                    value={formCustomer}
                    onChange={(e) => setFormCustomer(e.target.value)}
                    placeholder="Contoh: BUMI SUBUR SURABAYA"
                    className="w-full px-3 py-2 rounded-xl bg-[#272735] border border-[#70707d]/30 text-white font-semibold text-xs focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#ededf3] block">
                    Merek Beras / Kode AKA:
                  </label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="Contoh: BCAMP, RBN, WIN 15"
                    className="w-full px-3 py-2 rounded-xl bg-[#272735] border border-[#70707d]/30 text-white font-semibold text-xs focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Berat & Nopol */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#ededf3] block">
                    Total Muatan (KG):
                  </label>
                  <input
                    type="number"
                    value={formTotalKg}
                    onChange={(e) => setFormTotalKg(Number(e.target.value))}
                    placeholder="Contoh: 25000"
                    className="w-full px-3 py-2 rounded-xl bg-[#272735] border border-[#70707d]/30 text-emerald-400 font-mono font-bold text-xs focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#ededf3] block">
                    Nopol Truk:
                  </label>
                  <input
                    type="text"
                    value={formNopol}
                    onChange={(e) => setFormNopol(e.target.value)}
                    placeholder="Contoh: P 9081 AB"
                    className="w-full px-3 py-2 rounded-xl bg-[#272735] border border-[#70707d]/30 text-white font-bold text-xs focus:border-emerald-500 outline-none uppercase"
                  />
                </div>
              </div>

              {/* Ekspedisi */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#ededf3] block">
                  Informasi Ekspedisi / Alamat Tujuan:
                </label>
                <input
                  type="text"
                  value={formExpedition}
                  onChange={(e) => setFormExpedition(e.target.value)}
                  placeholder="Contoh: EXP. CARAVAN JL. KALIANAK 55 BLOK QQ NO. 9 SURABAYA"
                  className="w-full px-3 py-2 rounded-xl bg-[#272735] border border-[#70707d]/30 text-white font-normal text-xs focus:border-emerald-500 outline-none"
                />
              </div>

              {/* Catatan / Rincian Real */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#ededf3] block">
                  Catatan / Rincian Barang Jadi:
                </label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Contoh: Betet @10 (5t), Betet @20 (100sak), Betet @25 (400sak)..."
                  className="w-full px-3 py-2 rounded-xl bg-[#272735] border border-[#70707d]/30 text-white font-normal text-xs focus:border-emerald-500 outline-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#70707d]/20">
                {!isNewEvent && selectedEvent && (
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleDeleteEvent}
                      className="px-3.5 py-2 bg-rose-950/70 hover:bg-rose-900 text-rose-300 font-bold text-xs rounded-xl border border-rose-800/40 transition flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>

                    <a
                      href={getGoogleCalendarUrl(selectedEvent)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-[#272735] hover:bg-[#323244] text-amber-300 font-bold text-xs rounded-xl border border-[#70707d]/30 transition flex items-center space-x-1"
                      title="Buka / Simpan ke Google Calendar"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Google Cal</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setIsEditModalOpen(false);
                        setActiveScreen('SCREEN_15');
                      }}
                      className="px-3.5 py-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-bold text-xs rounded-xl border border-emerald-800/50 transition flex items-center space-x-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Buat DO di Admin 1</span>
                    </button>
                  </div>
                )}

                <div className="flex items-center space-x-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 bg-[#272735] hover:bg-[#323244] text-[#c3c3cc] font-semibold text-xs rounded-xl transition"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center space-x-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isNewEvent ? 'Simpan Jadwal' : 'Simpan Perubahan'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: IMPORT FROM TEXT
          ========================================================================= */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e1e2a] border border-[#70707d]/30 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#70707d]/20 pb-3">
              <h3 className="font-bold text-white text-base flex items-center space-x-2">
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Impor Teks Event Kalender Juwita</span>
              </h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-1 rounded text-[#c3c3cc] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#c3c3cc]">
              Paste satu atau beberapa baris deskripsi event kalender (misal: <code>9am bcamp 25 BM</code> atau <code>9am win 15 BM</code>). Sistem akan otomatis membuat jadwal kalender.
            </p>

            <textarea
              rows={5}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="9am bcamp 25 BM&#10;9am win 15 BM&#10;Kedatangan Gabah 18 Ton"
              className="w-full px-3 py-2.5 rounded-xl bg-[#272735] border border-[#70707d]/30 text-white font-mono text-xs focus:border-emerald-500 outline-none"
            />

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 bg-[#272735] text-[#c3c3cc] rounded-xl text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleParseImportText}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Impor Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
      {/* =========================================================================
          MODAL: GOOGLE CALENDAR SECRET ICAL URL SETTINGS
          ========================================================================= */}
      {showIcalSettingsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e1e2a] border border-[#70707d]/30 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#70707d]/20 pb-3">
              <div className="space-y-0.5">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Link className="w-5 h-5 text-teal-400" />
                  <span>Pengaturan Secret iCal Google Calendar</span>
                </h3>
                <span className="text-[10px] font-mono text-emerald-400">
                  Akun: juwitasriwulandari@gmail.com
                </span>
              </div>
              <button
                onClick={() => setShowIcalSettingsModal(false)}
                className="p-1 rounded text-[#c3c3cc] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step by step guide */}
            <div className="bg-[#272735] border border-teal-500/30 rounded-xl p-4 space-y-2.5">
              <h4 className="text-xs font-bold text-teal-300 flex items-center space-x-1.5">
                <Key className="w-4 h-4 text-teal-400" />
                <span>Cara Mendapatkan Secret iCal URL dari Google Calendar:</span>
              </h4>
              <ol className="text-xs text-[#ededf3] space-y-2 list-decimal pl-5">
                <li>
                  Buka <strong>calendar.google.com</strong> di komputer/laptop (pastikan login dengan akun <code>juwitasriwulandari@gmail.com</code>).
                </li>
                <li>
                  Di sisi kiri pada bagian <strong>"Kalender saya" (My calendars)</strong>, arahkan mouse ke kalender Juwita dan klik tanda <strong>tiga titik (⋮)</strong>.
                </li>
                <li>
                  Pilih <strong>"Setelan dan berbagi" (Settings and sharing)</strong>.
                </li>
                <li>
                  Gulir ke bawah ke bagian <strong>"Integrasikan kalender" (Integrate calendar)</strong>.
                </li>
                <li>
                  Cari baris <strong>"Alamat rahasia dalam format iCal" (Secret address in iCal format)</strong>, lalu salin URL tersebut.
                </li>
              </ol>
            </div>

            {/* Input URL */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white block">
                Paste Secret iCal URL di sini:
              </label>
              <input
                type="url"
                value={secretIcalUrl}
                onChange={(e) => setSecretIcalUrl(e.target.value)}
                placeholder="https://calendar.google.com/calendar/ical/.../basic.ics"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#272735] border border-[#70707d]/30 text-white font-mono text-xs focus:border-teal-400 outline-none"
              />
              <p className="text-[11px] text-[#c3c3cc]">
                URL rahasia ini memungkinkan sistem membaca jadwal tanpa harus mengubah kalender Juwita menjadi publik.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#70707d]/20">
              <a
                href="https://calendar.google.com/calendar/u/0/r/settings"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-teal-400 hover:text-teal-300 flex items-center space-x-1 font-semibold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka Setelan Google Calendar</span>
              </a>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowIcalSettingsModal(false)}
                  className="px-4 py-2 bg-[#272735] hover:bg-[#323244] text-[#c3c3cc] rounded-xl text-xs font-semibold"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleSaveIcalUrl(secretIcalUrl.trim());
                    setShowIcalSettingsModal(false);
                  }}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan URL</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
