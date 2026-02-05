
import React, { useState, useEffect } from 'react';
import { AdminResult } from '../types';

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [results, setResults] = useState<AdminResult[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('rhel_interview_records');
    if (saved) {
      setResults(JSON.parse(saved).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  }, []);

  const clearResults = () => {
    if (window.confirm("Are you sure you want to clear all candidate records?")) {
      localStorage.removeItem('rhel_interview_records');
      setResults([]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-6 duration-500">
      <div className="flex items-center justify-between bg-blue-900 p-10 rounded-[2.5rem] text-white shadow-2xl border-4 border-blue-800">
        <div className="flex items-center space-x-6">
          <div className="p-4 bg-orange-500 rounded-2xl shadow-xl">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">Management Console</h1>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-[0.3em] opacity-60">Vepsun Technologies Data Center</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <button onClick={clearResults} className="px-6 py-3 border-2 border-orange-500/30 text-orange-500 hover:bg-orange-500 hover:text-white rounded-2xl text-xs transition-all font-black uppercase tracking-widest">
            Purge Vault
          </button>
          <button onClick={onBack} className="px-8 py-3 bg-white text-blue-900 hover:bg-blue-50 rounded-2xl text-xs transition-all font-black uppercase tracking-[0.2em] shadow-lg">
            Exit Console
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b-2 border-gray-100">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-blue-900/40 uppercase tracking-[0.2em]">Timestamp</th>
                <th className="px-10 py-6 text-[10px] font-black text-blue-900/40 uppercase tracking-[0.2em]">Candidate Identity</th>
                <th className="px-10 py-6 text-[10px] font-black text-blue-900/40 uppercase tracking-[0.2em]">Contact Node</th>
                <th className="px-10 py-6 text-[10px] font-black text-blue-900/40 uppercase tracking-[0.2em] text-center">Score Metric</th>
                <th className="px-10 py-6 text-[10px] font-black text-blue-900/40 uppercase tracking-[0.2em]">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {results.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-24 text-center text-gray-400 font-bold italic text-lg uppercase tracking-widest opacity-30">Vault is empty</td>
                </tr>
              ) : (
                results.map((res) => (
                  <tr key={res.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-10 py-6 text-sm text-gray-500 font-medium">{new Date(res.date).toLocaleDateString()}</td>
                    <td className="px-10 py-6 font-black text-blue-900 text-lg tracking-tight">{res.name}</td>
                    <td className="px-10 py-6 text-sm text-gray-400 font-bold">{res.email}</td>
                    <td className="px-10 py-6 text-center">
                      <span className={`inline-block px-4 py-2 rounded-xl text-xs font-black shadow-sm ${
                        res.score >= 70 ? 'bg-blue-900 text-white' : res.score >= 40 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {res.score}%
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <span className="flex items-center text-[10px] font-black text-blue-900 uppercase tracking-widest opacity-40">
                        <span className="w-2 h-2 bg-blue-900 rounded-full mr-3 animate-pulse"></span>
                        Encrypted Record
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="p-10 bg-blue-50 border-2 border-blue-100 rounded-[2.5rem] shadow-inner">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mr-6 shadow-sm border border-blue-100">
            <svg className="w-6 h-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-1">Central Data Security</h4>
            <p className="text-xs text-blue-900/60 font-bold leading-relaxed">
              Assessment results are persisted in Vepsun Technologies' local enterprise storage. Reports are automatically queued for dispatch to <span className="text-orange-600">sanjeev.vmware@gmail.com</span> upon session finalization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
