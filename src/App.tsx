import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { PortalScreen } from './components/PortalScreen';
import { OwnerPriceScheduleScreen } from './components/OwnerPriceScheduleScreen';
import { OwnerH1HutangScreen } from './components/OwnerH1HutangScreen';
import { OwnerHDayTransferScreen } from './components/OwnerHDayTransferScreen';
import { OwnerFakturJualScreen } from './components/OwnerFakturJualScreen';
import { Admin1WeighbridgeScreen } from './components/Admin1WeighbridgeScreen';
import { Admin1PettyCashScreen } from './components/Admin1PettyCashScreen';
import { Admin1DeliveryOrderScreen } from './components/Admin1DeliveryOrderScreen';
import { Admin1ReceivablesScreen } from './components/Admin1ReceivablesScreen';
import { Admin2CorPlanScreen } from './components/Admin2CorPlanScreen';
import { Admin2SakRequestScreen } from './components/Admin2SakRequestScreen';
import { Admin2SakStockScreen } from './components/Admin2SakStockScreen';
import { Admin2BerasStockScreen } from './components/Admin2BerasStockScreen';
import { Admin2ByproductOpnameScreen } from './components/Admin2ByproductOpnameScreen';
import { Admin2TruckTierScreen } from './components/Admin2TruckTierScreen';
import { Admin2PaperCorPlanScreen } from './components/Admin2PaperCorPlanScreen';


// Core Master Data & Laporan
import { MasterSupplierScreen } from './components/MasterSupplierScreen';
import { MasterCustomerScreen } from './components/MasterCustomerScreen';
import { MasterItemStapelScreen } from './components/MasterItemStapelScreen';
import { ExpenseBookScreen } from './components/ExpenseBookScreen';
import { ReportsScreen } from './components/ReportsScreen';
import { UserManagementScreen } from './components/UserManagementScreen';
import { SuperAdminAccountingScreen } from './components/SuperAdminAccountingScreen';

import { Monitor, Tablet, Smartphone, Maximize2 } from 'lucide-react';

type DeviceType = 'FULL' | 'DESKTOP' | 'TABLET' | 'MOBILE';

const MainContent: React.FC = () => {
  const { activeScreen, role } = useApp();
  const [deviceMode, setDeviceMode] = useState<DeviceType>('FULL');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'SCREEN_5':
        return <PortalScreen />;

      // Owner Screens
      case 'SCREEN_13':
        return <OwnerPriceScheduleScreen />;
      case 'SCREEN_38':
        return <OwnerH1HutangScreen />;
      case 'SCREEN_4':
        return <OwnerHDayTransferScreen />;
      case 'SCREEN_FAKTUR_JUAL':
        return <OwnerFakturJualScreen />;

      // Admin 1 Screens
      case 'SCREEN_16':
        return <Admin1WeighbridgeScreen />;
      case 'SCREEN_31':
        return <Admin1PettyCashScreen />;
      case 'SCREEN_15':
        return <Admin1DeliveryOrderScreen />;
      case 'SCREEN_RECEIVABLES':
        return <Admin1ReceivablesScreen />;
      case 'SCREEN_BERAS_STOCK':
        return <Admin2BerasStockScreen />;

      // Admin 2 Screens
      case 'SCREEN_42':
        return <Admin2CorPlanScreen />;
      case 'SCREEN_8':
        return <Admin2SakRequestScreen />;
      case 'SCREEN_SAK_STOCK':
        return <Admin2SakStockScreen />;
      case 'SCREEN_36':

        return <Admin2ByproductOpnameScreen />;
      case 'SCREEN_24':
        return <Admin2TruckTierScreen />;
      case 'SCREEN_39':
        return <Admin2PaperCorPlanScreen />;

      // Core Modules
      case 'SCREEN_MASTER_SUPPLIER':
        return <MasterSupplierScreen />;
      case 'SCREEN_MASTER_CUSTOMER':
        return <MasterCustomerScreen />;
      case 'SCREEN_MASTER_ITEM':
        return <MasterItemStapelScreen />;
      case 'SCREEN_EXPENSE_BOOK':
        return <ExpenseBookScreen />;
      case 'SCREEN_REPORTS':
        return <ReportsScreen />;
      case 'SCREEN_USER_MGMT':
        return <UserManagementScreen />;
      case 'SCREEN_SUPER_ADMIN_ACCOUNTING':
        return <SuperAdminAccountingScreen />;

      default:
        return <PortalScreen />;
    }
  };

  // Helper container size per device preview
  const getDeviceContainerClass = () => {
    switch (deviceMode) {
      case 'MOBILE':
        return 'max-w-[400px] mx-auto border-8 border-slate-800 rounded-[36px] shadow-2xl overflow-hidden my-6 bg-white min-h-[780px]';
      case 'TABLET':
        return 'max-w-[820px] mx-auto border-8 border-slate-800 rounded-[28px] shadow-2xl overflow-hidden my-6 bg-white min-h-[850px]';
      case 'DESKTOP':
        return 'max-w-[1280px] mx-auto border border-slate-300 rounded-2xl shadow-lg my-4 bg-white p-2';
      case 'FULL':
      default:
        return 'w-full';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08251b]">
      {/* Interactive Device View Mode Switcher Bar */}
      <div className="bg-[#08251b] text-white py-2 px-4 border-b border-emerald-900 sticky top-0 z-50 text-xs shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-emerald-200">
            <span className="font-bold text-white">Pratinjau Layar ERP:</span>
            <span className="hidden sm:inline">Pilih mode simulasi tampilan perangkat:</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#0f3e2e] p-1 rounded-xl border border-emerald-800">
            <button
              onClick={() => setDeviceMode('FULL')}
              className={`px-3 py-1 rounded-lg font-bold transition flex items-center space-x-1.5 ${
                deviceMode === 'FULL'
                  ? 'bg-[#10b981] text-[#0f3e2e] shadow'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
              }`}
              title="Responsif Otomatis (Full Screen)"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Screen</span>
            </button>

            <button
              onClick={() => setDeviceMode('DESKTOP')}
              className={`px-3 py-1 rounded-lg font-bold transition flex items-center space-x-1.5 ${
                deviceMode === 'DESKTOP'
                  ? 'bg-[#10b981] text-[#0f3e2e] shadow'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
              }`}
              title="Simulasi Layar Komputer / PC Monitor"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>

            <button
              onClick={() => setDeviceMode('TABLET')}
              className={`px-3 py-1 rounded-lg font-bold transition flex items-center space-x-1.5 ${
                deviceMode === 'TABLET'
                  ? 'bg-amber-400 text-[#0f3e2e] shadow'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
              }`}
              title="Simulasi Layar Tablet / iPad"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet</span>
            </button>

            <button
              onClick={() => setDeviceMode('MOBILE')}
              className={`px-3 py-1 rounded-lg font-bold transition flex items-center space-x-1.5 ${
                deviceMode === 'MOBILE'
                  ? 'bg-amber-500 text-[#0f3e2e] shadow'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
              }`}
              title="Simulasi Layar HP Smartphone Outdoor"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>HP Mobile</span>
            </button>
          </div>
        </div>
      </div>

      <Header />

      <main className={`flex-1 transition-all duration-300 ${getDeviceContainerClass()}`}>
        {renderScreen()}
      </main>

      {/* Persistent Footer */}
      <footer className="bg-[#08251b] text-slate-400 py-4 border-t border-emerald-900 text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white">PP BUMI MAS</span>
            <span>• Wonosobo, Srono, Banyuwangi</span>
            <span className="bg-[#10b981]/20 text-[#10b981] px-2 py-0.5 rounded font-mono text-[10px]">
              {activeScreen} ({role})
            </span>
          </div>
          <div className="text-emerald-300 font-medium">
            Format Tampilan: <span className="font-bold text-amber-400">{deviceMode}</span> | Multi-Device Responsive
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
