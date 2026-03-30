import React, { useState, useEffect } from 'react';
import { Flag, ShieldAlert, Globe, Zap, ArrowRight, ChevronRight, Activity, Plus, HelpCircle, Terminal } from 'lucide-react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [flags, setFlags] = useState([]);
  
  useEffect(() => {
    API.get('/flags').then(res => {
      setFlags(res.data.data || res.data || []);
    }).catch(console.error);
  }, []);

  const total = flags.length;
  const killSwitches = flags.filter(f => f.kill_switch).length;

  const stats = [
    { label: 'Total Flags', value: total.toString(), sub: 'Total defined flags', trend: '↑ 12%', trendColor: 'text-green-600', trendText: 'vs last 24h', icon: Flag },
    { label: 'Avg Latency', value: '12ms', sub: 'Evaluation response', trend: '↓ 2ms', trendColor: 'text-red-500', trendText: 'vs last 24h', icon: Zap },
    { label: 'Kill Switches', value: `${killSwitches} Active`, sub: 'Emergency toggles', trend: '', trendColor: '', trendText: '', icon: ShieldAlert },
    { label: 'Global Reach', value: '18', sub: 'Edge locations', trend: '', trendColor: '', trendText: '', icon: Globe }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      
      
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-1">System Dashboard</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
            <HelpCircle size={16} className="text-slate-400" /> Help
          </button>
          <button onClick={() => navigate('/create')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2">
            <Plus size={16} /> New Feature Flag
          </button>
        </div>
      </div>

      
      <div className="bg-[#f0f6fa] rounded-2xl p-8">
        <div className="max-w-3xl">
          <span className="inline-block px-3 py-1 bg-blue-100/50 text-blue-600 text-[10px] font-bold rounded-full mb-4 uppercase tracking-wider">New Feature</span>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Welcome to the Feature Flag Command Center</h2>
          <p className="text-slate-500 mb-6 text-sm leading-relaxed max-w-2xl">
            Manage your application's behavior in real-time without redeploying. Control rollouts, target specific user segments, and use kill-switches to ensure stability across all environments.
          </p>
          <div className="flex gap-3">
            <button onClick={() => navigate('/create')} className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-blue-200 flex items-center gap-2">
              <Plus size={16} /> Create Your First Flag
            </button>
            <button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-slate-100">
              View Documentation
            </button>
          </div>
        </div>
      </div>

      
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
          <ActivityIcon /> System Health & Overview
        </h3>
        <p className="text-sm text-slate-500 mb-5">Real-time status of your flags and evaluation pipeline.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[130px]">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[11px] font-bold text-slate-600 mb-1">{stat.label}</p>
                    <h4 className="text-3xl font-bold text-slate-900 leading-none">{stat.value}</h4>
                  </div>
                  <div className="text-slate-400">
                    <Icon size={18} />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-[11px] text-slate-500 mb-1">
                    <span>{stat.sub}</span>
                  </div>
                  {stat.trend && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[11px] font-bold ${stat.trendColor}`}>{stat.trend}</span>
                      <span className="text-[10px] text-slate-400 font-medium tracking-wide">{stat.trendText}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">Recently Created Flags</h3>
        <p className="text-sm text-slate-500 mb-5">Your latest feature toggles retrieved directly from the database.</p>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 flex flex-col gap-3">
            {flags.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No flags found. Create your first flag to see it here.</p>
            ) : [...flags].reverse().slice(0, 5).map((f, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors bg-white shadow-sm hover:shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded bg-blue-50/50 border border-blue-100 text-blue-500 flex items-center justify-center font-mono font-bold text-xs">
                    {'>_'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">{f.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Recorded: {new Date(f.created_at || Date.now()).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                   <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{f.environment || 'Global'}</span>
                   <span className={`text-[10px] font-bold px-3 py-1.5 rounded tracking-widest uppercase ${f.enabled ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                     {f.enabled ? 'Live' : 'Off'}
                   </span>
                   <ChevronRight size={16} className="text-slate-300" />
                </div>
              </div>
            ))}
          </div>
          
           
        </div>
      </div>

    </div>
  );
};

function ActivityIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}

export default Dashboard;
