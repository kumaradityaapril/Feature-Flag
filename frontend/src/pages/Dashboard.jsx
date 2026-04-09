import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [flags, setFlags] = useState([]);
  const [epsData, setEpsData] = useState({
    value: 0,
    status: 'Idle',
    colorClass: 'text-tertiary bg-surface-container-highest'
  });



  
  useEffect(() => {
    API.get('/flags').then(res => {
      setFlags(res.data.data || res.data || []);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchEPS = () => {
      API.get('/trends').then(res => {
        if (res.data && res.data.data) {
          const val = res.data.data.eps || 0;
          const isActive = val > 0;
          setEpsData({
            value: Math.round(val * 10) / 10,
            status: isActive ? 'ACTIVE' : 'IDLE',
            colorClass: isActive ? 'text-primary bg-primary/10 border border-primary/20' : 'text-tertiary bg-surface-container-high'
          });
        }
      }).catch(() => {});
    };
    
    fetchEPS();
    const interval = setInterval(fetchEPS, 2000);
    return () => clearInterval(interval);
  }, []);

  const total = flags.length;
  const activeProd = flags.filter(f => f.enabled && f.environment === 'production').length;
  const recentFlags = [...flags].reverse().slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold tracking-tight text-on-surface">Flags Overview</h1>
          <p className="text-tertiary text-sm mt-1">Manage and monitor feature rollout across all clusters.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant/10">
            <button className="px-4 py-1.5 rounded-md text-xs font-semibold bg-surface-container-highest text-primary">Overview</button>
            <button className="px-4 py-1.5 rounded-md text-xs font-semibold text-tertiary hover:text-on-surface">Audit Logs</button>
          </div>
        </div>
      </div>

      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/5 hover:border-primary/20 transition-all group">
          <p className="text-tertiary text-[10px] uppercase tracking-widest font-bold mb-1">Total Flags</p>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-headline font-bold text-on-surface">{total}</h2>
            <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">All Contexts</span>
          </div>
        </div>
        <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/5 hover:border-primary/20 transition-all group">
          <p className="text-tertiary text-[10px] uppercase tracking-widest font-bold mb-1">Active in Prod</p>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-headline font-bold text-on-surface">{activeProd}</h2>
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full border-2 border-surface bg-primary/20 flex items-center justify-center"><span className="text-[8px] font-bold">P</span></div>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/5 hover:border-primary/20 transition-all group">
          <p className="text-tertiary text-[10px] uppercase tracking-widest font-bold mb-1">Total Rollouts</p>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-headline font-bold text-on-surface">{flags.filter(f => f.enabled).length}</h2>
            <span className="text-xs font-mono text-on-surface-variant">Active</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-surface-container-low to-primary/5 p-5 rounded-xl border border-outline-variant/5 hover:border-primary/20 transition-all group">
          <div className="flex items-center justify-between mb-1">
            <p className="text-tertiary text-[10px] uppercase tracking-widest font-bold">Live Traffic</p>
            {epsData.value > 0 && (
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
            )}
          </div>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-headline font-bold text-primary">{epsData.value} <span className="text-xs font-medium text-tertiary ml-0.5">EPS</span></h2>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${epsData.colorClass}`}>{epsData.status}</span>
          </div>
        </div>
      </div>

      {/* Flag List */}
      <div className="bg-surface-container-lowest/50 rounded-2xl border border-outline-variant/10 overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-outline-variant/5 bg-surface-container-low/40">
          <div className="flex items-center gap-4 flex-1">
            <h3 className="font-bold text-on-surface">Recently Created Flags</h3>
          </div>
          <button onClick={() => navigate('/create')} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-[#00363d] bg-gradient-to-br from-[#00daf3] to-[#00899a] rounded transition-transform active:scale-95">
            <span className="material-symbols-outlined text-sm">add</span> New Flag
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/5 bg-surface-container-low/20">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-tertiary">Flag Name</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-tertiary">Environment</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-tertiary text-center">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-tertiary">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {recentFlags.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-sm text-tertiary font-medium">No flags dynamically deployed yet.</td>
                </tr>
              ) : recentFlags.map((f, i) => (
                <tr key={i} className="hover:bg-surface-container-high/30 transition-colors group cursor-pointer" onClick={() => navigate('/flags')}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${f.enabled ? 'bg-primary shadow-[0_0_8px_#00daf3]' : 'bg-surface-container-highest border border-outline-variant/20'}`}></div>
                      <span className="text-sm font-semibold text-on-surface">{f.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 uppercase">{f.environment || 'Global'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <div className={`w-10 h-5 rounded-full relative cursor-pointer border p-0.5 ${f.enabled ? 'bg-primary/20 border-primary/30' : 'bg-surface-container-highest border-outline-variant/20'}`}>
                        {f.enabled ? (
                          <div className="w-3.5 h-3.5 bg-primary rounded-full absolute right-1 top-0.5 shadow-[0_0_8px_#00daf3]"></div>
                        ) : (
                          <div className="w-3.5 h-3.5 bg-tertiary rounded-full absolute left-1 top-0.5"></div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-tertiary">{new Date(f.created_at || Date.now()).toLocaleDateString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>



    </div>
  );
};

export default Dashboard;
