import React, { useState } from 'react';
import { X, Check, RotateCcw, Image, Tag, DollarSign, Package, ShoppingBag, ExternalLink } from 'lucide-react';

export interface RiceVariant {
  id: string;
  name: string;
  categoryBadge: string;
  subBadge: string;
  image: string;
  description: string;
  sizes: string;
  millingGrade: string;
  price: string;
  unit: string;
  tokopediaUrl?: string;
  shopeeUrl?: string;
  availableOnMarketplace: boolean;
}

export const DEFAULT_RICE_VARIANTS: RiceVariant[] = [
  {
    id: 'putri-thailand',
    name: 'Cap Putri Thailand',
    categoryBadge: 'Bestseller',
    subBadge: 'Super Premium',
    image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80',
    description: 'Beras kristal putih bening, sosoh 95%, broken maks 5%. Nasi lembut pulen istimewa favorit keluarga.',
    sizes: '5kg, 10kg, 25kg, 50kg',
    millingGrade: '95% Bening Kristal',
    price: 'Rp 14.800',
    unit: '/ kg',
    tokopediaUrl: 'https://www.tokopedia.com/search?st=product&q=beras%20cap%20putri%20thailand',
    shopeeUrl: 'https://shopee.co.id/search?keyword=beras%20cap%20putri%20thailand',
    availableOnMarketplace: true,
  },
  {
    id: 'pulau-pandan',
    name: 'Pulau Pandan',
    categoryBadge: 'Mutu Pilihan',
    subBadge: 'Beras Punel',
    image: '/images/pulau-pandan.jpg',
    description: 'Beras punel mutu pilihan dengan kemurnian bulir padi. Wangi pandan alami untuk sajian istimewa.',
    sizes: '5kg, 10kg, 25kg',
    millingGrade: 'Punel & Pandan Alami',
    price: 'Rp 14.900',
    unit: '/ kg',
    tokopediaUrl: 'https://www.tokopedia.com/search?st=product&q=beras%20pulau%20pandan',
    shopeeUrl: 'https://shopee.co.id/search?keyword=beras%20pulau%20pandan',
    availableOnMarketplace: true,
  },
  {
    id: 'sri-arum',
    name: 'Sri Arum',
    categoryBadge: 'Wangi Alami',
    subBadge: 'Premium Punel',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    description: 'Beras wangi alami dari kesuburan tanah Banyuwangi. Tekstur pulen, putih bersih, dan nikmat disajikan hangat.',
    sizes: '5kg, 10kg, 25kg, 50kg',
    millingGrade: '95% Harum & Bersih',
    price: 'Rp 14.500',
    unit: '/ kg',
    tokopediaUrl: 'https://www.tokopedia.com/search?st=product&q=beras%20sri%20arum',
    shopeeUrl: 'https://shopee.co.id/search?keyword=beras%20sri%20arum',
    availableOnMarketplace: true,
  },
  {
    id: 'cap-betet',
    name: 'Cap Betet Super Kepala',
    categoryBadge: 'Pilihan Resto',
    subBadge: 'Super Kepala',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    description: 'Beras kepala pilihan rumah makan dan katering. Tekstur butir utuh padat pulen dan tidak mudah basi.',
    sizes: '10kg, 20kg, 25kg, 50kg',
    millingGrade: '90% Standar Kepala',
    price: 'Rp 13.900',
    unit: '/ kg',
    tokopediaUrl: 'https://www.tokopedia.com/search?st=product&q=beras%20cap%20betet',
    shopeeUrl: 'https://shopee.co.id/search?keyword=beras%20cap%20betet',
    availableOnMarketplace: true,
  },
];

interface RiceVariantSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  variants: RiceVariant[];
  onSave: (updated: RiceVariant[]) => void;
  onReset: () => void;
}

export const RiceVariantSettingsModal: React.FC<RiceVariantSettingsModalProps> = ({
  isOpen,
  onClose,
  variants,
  onSave,
  onReset,
}) => {
  const [draftVariants, setDraftVariants] = useState<RiceVariant[]>(variants);
  const [activeTab, setActiveTab] = useState<number>(0);

  // Sync draft when opened
  React.useEffect(() => {
    if (isOpen) {
      setDraftVariants(variants);
    }
  }, [isOpen, variants]);

  if (!isOpen) return null;

  const current = draftVariants[activeTab] || draftVariants[0];

  const updateCurrent = (field: keyof RiceVariant, value: any) => {
    setDraftVariants((prev) => {
      const copy = [...prev];
      copy[activeTab] = {
        ...copy[activeTab],
        [field]: value,
      };
      return copy;
    });
  };

  const handleSave = () => {
    onSave(draftVariants);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Kembalikan semua teks, foto, ukuran, dan harga ke pengaturan awal?')) {
      setDraftVariants(DEFAULT_RICE_VARIANTS);
      onReset();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0d1f14]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#ffffff] rounded-[16px] border border-[#1b4332]/20 shadow-2xl max-w-2xl w-full my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="bg-[#1b4332] text-white px-5 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight-bella flex items-center space-x-2">
              <Package className="w-5 h-5 text-[#95d5b2]" />
              <span>Pengaturan Varian Beras</span>
            </h3>
            <p className="text-xs text-[#e8f1eb]/80 font-normal">
              Atur teks, foto produk, ukuran kemasan (size), dan harga jual per kg
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="bg-[#f4f0e6] px-4 sm:px-6 pt-3 border-b border-[#1b4332]/10 flex space-x-2 overflow-x-auto">
          {draftVariants.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(idx)}
              className={`px-3 py-2 text-xs font-bold rounded-t-lg transition whitespace-nowrap border-b-2 ${
                activeTab === idx
                  ? 'bg-white text-[#1b4332] border-[#1b4332] shadow-sm'
                  : 'text-[#142217]/70 border-transparent hover:text-[#142217]'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          
          {/* Preview Header Card */}
          <div className="bg-[#e8f1eb]/60 rounded-[12px] p-3 sm:p-4 border border-[#1b4332]/15 flex items-center space-x-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[8px] overflow-hidden bg-white border border-[#1b4332]/20 shrink-0 flex items-center justify-center p-1">
              <img
                src={current.image}
                alt={current.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80';
                }}
              />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1b4332] text-white">
                  {current.categoryBadge || 'Katalog'}
                </span>
                <span className="text-xs font-bold text-[#1b4332]">
                  {current.subBadge}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-[#142217] truncate">
                {current.name}
              </h4>
              <div className="text-xs font-bold text-[#1b4332]">
                {current.price} <span className="text-[11px] font-normal text-[#142217]/60">{current.unit}</span>
                <span className="text-[#142217]/40 mx-1.5">•</span>
                <span className="text-[#142217]/80 text-[11px] font-normal">Ukuran: {current.sizes}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nama Varian */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#142217] flex items-center space-x-1">
                <Tag className="w-3.5 h-3.5 text-[#2d6a4f]" />
                <span>Nama Varian Beras:</span>
              </label>
              <input
                type="text"
                value={current.name}
                onChange={(e) => updateCurrent('name', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#1b4332]/20 bg-white text-xs font-bold text-[#142217] focus:border-[#1b4332] outline-none"
                placeholder="Contoh: Cap Putri Thailand"
              />
            </div>

            {/* Harga */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#142217] flex items-center space-x-1">
                <DollarSign className="w-3.5 h-3.5 text-[#2d6a4f]" />
                <span>Harga per KG (Price):</span>
              </label>
              <input
                type="text"
                value={current.price}
                onChange={(e) => updateCurrent('price', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#1b4332]/20 bg-white text-xs font-bold text-[#1b4332] focus:border-[#1b4332] outline-none"
                placeholder="Contoh: Rp 14.800"
              />
            </div>

            {/* Ukuran Kemasan (Size) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#142217] flex items-center space-x-1">
                <Package className="w-3.5 h-3.5 text-[#2d6a4f]" />
                <span>Ukuran Kemasan (Size):</span>
              </label>
              <input
                type="text"
                value={current.sizes}
                onChange={(e) => updateCurrent('sizes', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#1b4332]/20 bg-white text-xs font-bold text-[#142217] focus:border-[#1b4332] outline-none"
                placeholder="Contoh: 5kg, 10kg, 25kg, 50kg"
              />
            </div>

            {/* Derajat Sosoh / Spesifikasi */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#142217]">Spesifikasi / Derajat Sosoh:</label>
              <input
                type="text"
                value={current.millingGrade}
                onChange={(e) => updateCurrent('millingGrade', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#1b4332]/20 bg-white text-xs font-normal text-[#142217] focus:border-[#1b4332] outline-none"
                placeholder="Contoh: 95% Bening Kristal"
              />
            </div>

            {/* Badge Kategori */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#142217]">Label Badge:</label>
              <input
                type="text"
                value={current.categoryBadge}
                onChange={(e) => updateCurrent('categoryBadge', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#1b4332]/20 bg-white text-xs font-normal text-[#142217] focus:border-[#1b4332] outline-none"
                placeholder="Contoh: Bestseller / Mutu Pilihan"
              />
            </div>

            {/* Sub-Badge */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#142217]">Sub-Kategori:</label>
              <input
                type="text"
                value={current.subBadge}
                onChange={(e) => updateCurrent('subBadge', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#1b4332]/20 bg-white text-xs font-normal text-[#142217] focus:border-[#1b4332] outline-none"
                placeholder="Contoh: Super Premium / Beras Punel"
              />
            </div>
          </div>

          {/* URL Gambar Produk (Picture) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#142217] flex items-center space-x-1">
              <Image className="w-3.5 h-3.5 text-[#2d6a4f]" />
              <span>Foto / Gambar Produk (Picture):</span>
            </label>
            <input
              type="text"
              value={current.image}
              onChange={(e) => updateCurrent('image', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#1b4332]/20 bg-white text-xs font-normal text-[#142217] focus:border-[#1b4332] outline-none"
              placeholder="Contoh: /images/pulau-pandan.jpg atau https://..."
            />
            <p className="text-[11px] text-[#142217]/60">
              Gunakan path gambar lokal di folder public/images (misal: <code>/images/pulau-pandan.jpg</code>) atau direct URL gambar web.
            </p>
          </div>

          {/* Deskripsi Teks */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#142217]">Deskripsi Teks Varian:</label>
            <textarea
              rows={2}
              value={current.description}
              onChange={(e) => updateCurrent('description', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#1b4332]/20 bg-white text-xs font-normal text-[#142217] focus:border-[#1b4332] outline-none"
              placeholder="Jelaskan keunggulan rasa, pulen, dan aroma beras..."
            />
          </div>

          {/* Keterangan Tersedia di Shopee dan Tokopedia */}
          <div className="bg-[#f4f0e6] p-3 sm:p-4 rounded-[12px] border border-[#1b4332]/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-[#2d6a4f]" />
              <div>
                <div className="text-xs font-bold text-[#142217]">
                  Tersedia di Shopee dan Tokopedia
                </div>
                <div className="text-[11px] text-[#142217]/70 font-normal">
                  Tampilkan tulisan "Tersedia di Shopee dan Tokopedia" pada kartu varian beras
                </div>
              </div>
            </div>
            <label className="flex items-center space-x-2 text-xs font-bold text-[#1b4332] cursor-pointer shrink-0 ml-3">
              <input
                type="checkbox"
                checked={current.availableOnMarketplace}
                onChange={(e) => updateCurrent('availableOnMarketplace', e.target.checked)}
                className="rounded border-[#1b4332]/30 text-[#1b4332] focus:ring-[#1b4332]"
              />
              <span>{current.availableOnMarketplace ? 'Aktif' : 'Nonaktif'}</span>
            </label>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="bg-[#f4f0e6] px-5 sm:px-6 py-3.5 border-t border-[#1b4332]/10 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-xs font-bold text-[#142217]/70 hover:text-rose-700 flex items-center space-x-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Pengaturan Awal</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-[#1b4332]/30 text-xs font-bold text-[#142217] hover:bg-white transition"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="bella-btn-green px-5 py-2 text-xs font-bold flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4 text-white" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
