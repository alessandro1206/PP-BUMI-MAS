import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, FileText, Filter, X, UserCheck, Clock, Search } from 'lucide-react';

export const AuditLogModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { auditLogs } = useApp();
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredLogs = auditLogs.filter(log => {
    const matchRole = filterRole === 'ALL' || log.role === filterRole;
    const matchSearch = searchTerm === '' || 
      log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchRole && matchSearch;
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 space-y-6 shadow-2xl border-4 border-[#0f3e2e] relative overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0f3e2e] text-white flex items-center justify-center font-bold">
              <FileText className="w-6 h-6 text-[#f59e0b]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#10b981]">SYSTEM AUDIT & ACTIVITY LOGS</span>
              <h3 className="text-xl font-extrabold text-slate-900">Buku Log Aktivitas Pengguna (Username & Aksi)</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari username atau deskripsi aksi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl text-xs font-bold text-slate-900 outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 bg-slate-50 border rounded-xl text-xs font-bold text-slate-700 outline-none"
            >
              <option value="ALL">Semua Peran / Role</option>
              <option value="OWNER">Role: OWNER</option>
              <option value="ADMIN1">Role: ADMIN 1</option>
              <option value="ADMIN2">Role: ADMIN 2</option>
            </select>
          </div>
        </div>

        {/* Logs Table */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">Tidak ada log aktivitas ditemukan</div>
          ) : (
            filteredLogs.map(log => (
              <div key={log.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-[#0f3e2e] bg-emerald-100 px-2 py-0.5 rounded">
                      User: {log.username}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      log.role === 'OWNER' ? 'bg-amber-100 text-amber-900' :
                      log.role === 'ADMIN1' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-50 text-amber-800'
                    }`}>
                      {log.role}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{log.timestamp}</span>
                    </span>
                  </div>
                  <div className="font-extrabold text-slate-900 text-sm">{log.action_description}</div>
                  {log.details && (
                    <p className="text-slate-500 text-xs font-mono">{log.details}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
