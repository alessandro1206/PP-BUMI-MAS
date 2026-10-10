import React from 'react';
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

import { Activity, Radio, Cpu, ShieldCheck } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeScreen, role, currentUser } = useApp();

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

      // Admin 1 Screens (Weighbridge, Kasir & Delivery Order)
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

      // Admin 2 Screens (Produksi Pabrik & Logistik)
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

      // Master Data & Laporan
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

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f17] text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* Sleek Enterprise Top Application Header */}
      <Header />

      {/* Main Dynamic Workspace Area */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderScreen()}
      </main>

      {/* Professional Industrial Status Bar / Footer */}
      <footer className="border-t border-slate-800/80 bg-[#090d16] text-slate-400 text-xs py-3 px-4 sm:px-8 mt-auto">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              <span className="font-bold text-slate-200">PP BUMI MAS</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Wonosobo, Srono, Banyuwangi</span>
            </div>

            <span className="hidden md:inline text-slate-700">|</span>

            <div className="hidden md:flex items-center space-x-1.5 text-slate-400 font-mono text-[11px]">
              <Cpu className="w-3.5 h-3.5 text-slate-500" />
              <span>Weighbridge PRO v1.2</span>
              <span>•</span>
              <span className="text-emerald-400">Native RS-232 Ready</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-[11px] font-mono">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Modul: <strong className="text-white">{activeScreen}</strong>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>{currentUser ? `${currentUser.name} (${currentUser.role})` : 'Tamu'}</span>
            </span>
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
