import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

const Environments = () => {
  const navigate = useNavigate();
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const res = await API.get('/flags');
        setFlags(res.data.data || res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlags();
  }, []);

  const getEnvStats = (envName) => {
    const envFlags = flags.filter(f => (f.environment || '').toLowerCase() === envName.toLowerCase());
    return {
      total: envFlags.length,
      active: envFlags.filter(f => f.enabled).length,
      killSwitches: envFlags.filter(f => f.kill_switch).length
    };
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const environments = [
    { 
      id: 'development', 
      name: 'Development', 
      description: 'Local and internal testing environment.',
      color: 'primary',
      icon: 'construction',
      sdkKey: 'ff_dev_sdk_82h1x9k0l2m'
    },
    { 
      id: 'staging', 
      name: 'Staging', 
      description: 'Pre-production environment for final QA.',
      color: 'secondary',
      icon: 'assignment_turned_in',
      sdkKey: 'ff_stg_sdk_pv84m2n1q0p'
    },
    { 
      id: 'production', 
      name: 'Production', 
      description: 'Customer-facing live infrastructure.',
      color: 'error',
      icon: 'rocket_launch',
      sdkKey: 'ff_prod_sdk_0a3b8c6d1e4'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined animate-spin text-primary text-4xl">clock_loader_40</span>
          <p className="text-tertiary font-mono text-sm tracking-widest uppercase">Initializing Environments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold tracking-tight text-on-surface">Environments</h1>
          <p className="text-tertiary text-sm mt-1">Manage infrastructure contexts and monitor deployment consistency.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-tertiary bg-surface-container hover:bg-surface-container-high border border-outline-variant/10 rounded transition-colors">
             <span className="material-symbols-outlined text-[18px]">history</span> Deployment Logs
           </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {environments.map((env) => {
          const stats = getEnvStats(env.id);
          const syncPercent = stats.total > 0 ? (stats.active / stats.total) * 100 : 0;
          
          return (
            <div key={env.id} className="bg-surface-container-low rounded-2xl border border-outline-variant/10 overflow-hidden group hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-${env.color}/10 border border-${env.color}/20 flex items-center justify-center`}>
                    <span className={`material-symbols-outlined text-${env.color} text-2xl`}>{env.icon}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border border-outline-variant/20 tracking-tighter uppercase ${env.id === 'production' ? 'bg-error/10 text-error' : 'bg-surface-container-highest text-tertiary'}`}>
                    {env.id === 'production' ? 'Critical' : 'Internal'}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-on-surface mb-1">{env.name}</h3>
                <p className="text-xs text-tertiary line-clamp-1 mb-6">{env.description}</p>

                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/5">
                    <p className="text-[9px] font-bold text-tertiary uppercase tracking-tighter mb-1">Total</p>
                    <p className="text-lg font-bold font-mono text-on-surface">{stats.total}</p>
                  </div>
                  <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/5">
                    <p className="text-[9px] font-bold text-tertiary uppercase tracking-tighter mb-1">Live</p>
                    <p className="text-lg font-bold font-mono text-primary">{stats.active}</p>
                  </div>
                  <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/5">
                    <p className="text-[9px] font-bold text-tertiary uppercase tracking-tighter mb-1">Kill</p>
                    <p className={`text-lg font-bold font-mono ${stats.killSwitches > 0 ? 'text-error animate-pulse' : 'text-on-surface'}`}>{stats.killSwitches}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-tertiary">
                    <span>Active Ratio</span>
                    <span className="text-primary">{Math.round(syncPercent)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000 ease-out" 
                      style={{ width: `${syncPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* SDK Snippet Section */}
              <div className="bg-surface-container-lowest/50 p-6 border-t border-outline-variant/10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Connect to SDK</p>
                  <button 
                    onClick={() => copyToClipboard(env.sdkKey, env.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">{copiedId === env.id ? 'check' : 'content_copy'}</span>
                    {copiedId === env.id ? 'Copied' : 'Copy Key'}
                  </button>
                </div>
                <div className="bg-[#0f172a] p-3 rounded-lg border border-outline-variant/10 font-mono text-[10px] text-[#93c5fd] overflow-hidden">
                  <span className="text-tertiary">SDK_KEY:</span> {env.sdkKey}
                </div>
                <button 
                  onClick={() => navigate('/flags', { state: { env: env.name } })}
                  className="w-full mt-4 py-2.5 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/20 rounded-lg text-xs font-bold text-on-surface transition-all flex items-center justify-center gap-2 group"
                >
                  View {env.name} Flags
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Tool / Best Practices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-surface-container-low rounded-2xl border border-outline-variant/10 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <h3 className="font-headline font-bold text-on-surface mb-2 relative z-10 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">sync_alt</span>
            Cross-Environment Sync
          </h3>
          <p className="text-sm text-tertiary mb-8 relative z-10">Compare your flag distribution to identify features waiting for promotion to production.</p>
          
          <div className="space-y-6 relative z-10">
            {[
              { from: 'Development', to: 'Staging', progress: 85 },
              { from: 'Staging', to: 'Production', progress: 42 }
            ].map((sync, i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
                     <span className="text-primary">{sync.from}</span>
                     <span className="material-symbols-outlined text-sm text-tertiary">arrow_forward</span>
                     <span className="text-secondary">{sync.to}</span>
                   </div>
                   <span className="text-[10px] font-mono font-bold text-tertiary">{sync.progress}% Synced</span>
                </div>
                <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${i === 0 ? 'from-primary to-secondary' : 'from-secondary to-error'} rounded-full`}
                    style={{ width: `${sync.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-surface-container-low rounded-2xl border border-outline-variant/10 p-8">
          <h3 className="font-headline font-bold text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">verified</span>
            Best Practices
          </h3>
          <div className="space-y-4">
            {[
              { title: 'Gradual Rollout', desc: 'Test features in Staging with 10% rollout before full Production release.', icon: 'trending_up' },
              { title: 'Kill Switch Checks', desc: 'Ensure emergency shuts are tested weekly in Dev environments.', icon: 'security' },
              { title: 'Environment Clean-up', desc: 'Remove flags that have been at 100% for more than 4 weeks.', icon: 'delete_sweep' }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-surface-container transition-colors">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex-shrink-0 flex items-center justify-center border border-outline-variant/10">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">{item.icon}</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-on-surface mb-0.5">{item.title}</h4>
                  <p className="text-[11px] text-tertiary leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Environments;
