import React, { useState, useEffect } from 'react';
import { Flag, Zap, ShieldAlert, Globe, ArrowRight, ChevronRight, Activity } from 'lucide-react';
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
    { label: 'Total Flags', value: total.toString(), sub: 'Total defined flags', meta: 'Live Data', metaColor: 'text-blue-600 bg-blue-50', icon: Flag },
    { label: 'Kill Switches', value: `${killSwitches} Active`, sub: 'Emergency toggles', meta: '', icon: ShieldAlert }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-md mb-4 uppercase tracking-wide">New Feature</span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Welcome to the Feature Flag Command Center</h2>
          <p className="text-slate-600 mb-6 text-sm md:text-base leading-relaxed">
            Manage your application's behavior in real-time without redeploying. Control rollouts, target specific user segments, and use kill-switches to ensure stability across all environments.
          </p>
          <div className="flex gap-4">
            <button onClick={() => navigate('/create')} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-200">
              Create Your First Flag
            </button>
            <button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
              View Documentation
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <ActivityIcon /> System Health & Overview
        </h3>
        <p className="text-sm text-slate-500 mb-6">Real-time status of your flags and evaluation pipeline.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                    <h4 className="text-3xl font-bold text-slate-900">{stat.value}</h4>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <Icon size={20} />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 text-xs font-medium">
                  <span className="text-slate-500">{stat.sub}</span>
                  {stat.meta && (
                    <span className={`px-1.5 py-0.5 rounded ${stat.metaColor}`}>
                      {stat.meta}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
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
