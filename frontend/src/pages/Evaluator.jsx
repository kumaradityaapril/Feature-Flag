import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

const Evaluator = () => {
  const navigate = useNavigate();
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);

  const [evalForm, setEvalForm] = useState({
    flag_name: '', user_id: '', country: '', app_version: '', environment: 'Production'
  });
  const [evalResult, setEvalResult] = useState(null);
  const [evalStatus, setEvalStatus] = useState('idle');

  useEffect(() => {
    API.get('/flags').then(res => {
      const fetched = res.data.data || res.data || [];
      setFlags(fetched);
      if (fetched.length > 0) {
        setEvalForm(prev => ({ ...prev, flag_name: fetched[0].name }));
      }
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleEvalChange = (e) => {
    setEvalForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEvaluate = async () => {
    if (!evalForm.flag_name) return;
    setEvalStatus('loading');
    try {
      const res = await API.post('/evaluate', evalForm);
      setEvalResult(res.data.data.enabled);
      setEvalStatus('success');
    } catch (err) {
      console.error(err);
      setEvalStatus('error');
    }
  };

  const exportReport = () => {
    // Redundant, now using navigate('/export')
  };

  const total = flags.length;
  const activeCount = flags.filter(f => f.enabled).length;
  const killSwitches = flags.filter(f => f.kill_switch).length;
  const envs = new Set(flags.map(f => f.environment).filter(Boolean)).size;

  const stats = [
    { title: 'Total Flags', value: total.toString(), subtitle: 'Registered flags in system', icon: 'flag', iconColor: 'text-primary' },
    { title: 'Active Flags', value: activeCount.toString(), subtitle: 'Currently serving traffic', icon: 'check_circle', iconColor: 'text-secondary' },
    { title: 'Kill Switches', value: killSwitches.toString(), subtitle: 'Safety triggers engaged', icon: 'shield', iconColor: 'text-error' },
    { title: 'Environments', value: envs.toString(), subtitle: 'Active environments', icon: 'public', iconColor: 'text-tertiary' }
  ];

  const pipelineSteps = [
    { num: 1, title: 'Kill Switch', desc: 'Global safety override check.', icon: 'shield' },
    { num: 2, title: 'Environment', desc: 'Context verification.', icon: 'public' },
    { num: 3, title: 'Boolean Logic', desc: 'Core state evaluation.', icon: 'toggle_on' },
    { num: 4, title: 'Targeting', desc: 'Identifier-based rules.', icon: 'person_search' },
    { num: 5, title: 'Rollout', desc: 'Final weight calculation.', icon: 'data_usage' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-headline text-on-surface mb-1">Diagnostic Evaluator</h2>
          <p className="text-tertiary text-sm mt-1">Monitor and deploy your evaluation pipeline across environments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/export')} className="px-4 py-2 rounded-lg text-sm font-semibold border border-outline-variant/20 hover:bg-surface-container-high transition-all text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">download</span> Export Report
          </button>
          <button onClick={() => navigate('/create')} className="bg-gradient-to-br from-primary to-on-primary-container text-on-primary px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg active:scale-95 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add</span> Create Flag
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-tertiary mb-1">{stat.title}</h4>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold font-headline text-on-surface mb-0">{stat.value}</span>
                </div>
              </div>
              <div className={`p-2 rounded-lg bg-surface-container-highest/50 ${stat.iconColor}`}>
                <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
              </div>
            </div>
            <div className="text-[11px] font-medium text-tertiary/80">
              {stat.subtitle}
            </div>
          </div>
        ))}
      </div>

      {/* Evaluation Pipeline */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-on-surface flex items-center gap-2">
            <span className="font-mono text-primary font-bold">{'>_'}</span> Evaluation Pipeline
          </h3>
          <span className="text-xs font-mono text-tertiary">Logic Engine v4.2.0</span>
        </div>
        
        <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-outline-variant/20 -translate-y-1/2 z-0 hidden md:block"></div>
            
            {pipelineSteps.map((step, i) => (
              <React.Fragment key={i}>
                <div className="relative z-10 flex flex-col items-center bg-surface-container-low px-2">
                  <div className="w-16 h-16 rounded-full bg-surface-container border border-outline-variant/30 flex items-center justify-center shadow-sm mb-3 relative">
                    <span className="material-symbols-outlined text-[24px] text-on-surface">{step.icon}</span>
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(0,218,243,0.5)]">
                      {step.num}
                    </div>
                  </div>
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-on-surface mb-1">{step.title}</h4>
                  <p className="text-[10px] text-tertiary/70 text-center max-w-[120px] leading-relaxed">{step.desc}</p>
                </div>
                {i < pipelineSteps.length - 1 && (
                  <div className="hidden md:flex text-outline-variant/50 z-10 bg-surface-container-low">
                    <span className="material-symbols-outlined text-[24px]">chevron_right</span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Diagnostic Evaluator */}
      <div>
        <div className="mb-4">
          <h3 className="text-xl font-bold font-headline text-on-surface">Simulate Rule Engine</h3>
          <p className="text-sm text-tertiary mt-1">Provide target user context to manually verify rollout rules, environment overrides, and kill-switch states before deploying.</p>
        </div>
        
        <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Form */}
          <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-outline-variant/10 space-y-6">
            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-primary mb-1 uppercase tracking-widest">
                <span className="material-symbols-outlined text-[16px]">terminal</span> Evaluation Request
              </h4>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Flag Name (Key)</label>
                <div className="relative">
                  <select 
                    name="flag_name"
                    value={evalForm.flag_name}
                    onChange={handleEvalChange}
                    className="w-full pl-3 pr-8 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary appearance-none cursor-pointer hover:bg-surface-container transition-colors"
                  >
                    <option value="">Select a flag...</option>
                    {flags.map(f => (
                      <option key={f.id} value={f.name}>{f.name}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-tertiary pointer-events-none text-sm">unfold_more</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-tertiary uppercase tracking-widest">User ID</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-tertiary/50 text-[18px]">person</span>
                    <input 
                      type="text" name="user_id" value={evalForm.user_id} onChange={handleEvalChange}
                      className="w-full pl-10 pr-3 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary placeholder:text-tertiary/40 transition-colors"
                      placeholder="e.g. usr_alpha_112"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Country</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-tertiary/50 text-[18px]">public</span>
                    <input 
                      type="text" name="country" value={evalForm.country} onChange={handleEvalChange}
                      className="w-full pl-10 pr-3 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary placeholder:text-tertiary/40 transition-colors"
                      placeholder="e.g. US"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-tertiary uppercase tracking-widest">App Version</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-tertiary/50 text-[18px]">tag</span>
                  <input 
                    type="text" name="app_version" value={evalForm.app_version} onChange={handleEvalChange}
                    className="w-full pl-10 pr-3 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary placeholder:text-tertiary/40 transition-colors font-mono"
                    placeholder="2.14.5"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pb-2">
                <label className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Environment Target</label>
                <div className="flex items-center gap-4 mt-2">
                  {['Dev', 'Staging', 'Production'].map(e => (
                    <label key={e} className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${evalForm.environment === e ? 'border-primary' : 'border-outline-variant/30 group-hover:border-primary/50'}`}>
                        {evalForm.environment === e && <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,218,243,0.5)]"></div>}
                      </div>
                      <input type="radio" className="hidden" name="environment" value={e} onChange={handleEvalChange} />
                      <span className={`text-xs font-semibold uppercase tracking-widest ${evalForm.environment === e ? 'text-primary' : 'text-tertiary'}`}>{e}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleEvaluate}
                disabled={evalStatus === 'loading'}
                className="w-full border-2 border-primary bg-primary/10 hover:bg-primary/20 disabled:opacity-50 text-primary py-3 rounded-lg text-sm font-bold uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2"
              >
                {evalStatus === 'loading' ? <span className="material-symbols-outlined animate-spin text-[18px]">autorenew</span> : <span className="material-symbols-outlined text-[18px]">play_arrow</span>}
                {evalStatus === 'loading' ? 'Running Evaluation...' : 'Run Evaluation'}
              </button>

              <div className="p-3 bg-surface-container-highest border-l-2 border-primary rounded-r-lg flex gap-3 text-[10px] text-tertiary items-start font-mono uppercase tracking-widest leading-relaxed mt-4">
                <span className="material-symbols-outlined text-primary text-[14px]">info</span>
                <p>Evaluations are locally performed via mock engine proxy. Results bypass cache.</p>
              </div>
            </div>
          </div>

          {/* Right: Result */}
          <div className="p-6 md:p-8 flex flex-col items-center justify-center min-h-[400px] bg-surface-container-lowest/50 relative overflow-hidden">
            {evalStatus === 'idle' && (
               <div className="border border-dashed border-outline-variant/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center w-full max-w-[320px] bg-surface-container-low/30 relative z-10">
                 <div className="w-12 h-12 bg-surface-container border border-outline-variant/10 text-tertiary rounded-full flex items-center justify-center mb-4">
                   <span className="material-symbols-outlined text-[24px]">power_settings_new</span>
                 </div>
                 <h4 className="text-on-surface font-bold font-headline mb-1 text-sm tracking-wide">Waiting for Input</h4>
                 <p className="text-[11px] text-tertiary leading-relaxed mt-2">Fill in the evaluation request form and click "Run Evaluation" to see the decision trace.</p>
               </div>
            )}
            
            {evalStatus === 'loading' && (
               <div className="border border-dashed border-primary/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center w-full max-w-[320px] bg-primary/5 relative z-10 animate-pulse">
                 <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4 border border-primary/30">
                   <span className="material-symbols-outlined text-[24px]">sync</span>
                 </div>
                 <h4 className="text-primary font-bold font-headline mb-1 text-sm tracking-wide">Evaluating rules...</h4>
               </div>
            )}

            {evalStatus === 'error' && (
               <div className="border border-dashed border-error/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center w-full max-w-[320px] bg-error/5 relative z-10">
                 <div className="w-12 h-12 bg-error/20 text-error rounded-full flex items-center justify-center mb-4 border border-error/30">
                   <span className="material-symbols-outlined text-[24px]">error</span>
                 </div>
                 <h4 className="text-error font-bold font-headline mb-1 text-sm tracking-wide">Evaluation Failed</h4>
                 <p className="text-[11px] text-error/70 mt-2">The engine encountered an error. Check context inputs.</p>
               </div>
            )}

            {evalStatus === 'success' && (
               <div className={`border rounded-2xl p-8 flex flex-col items-center justify-center text-center w-full max-w-[320px] transition-all duration-500 relative z-10 ${evalResult ? 'bg-primary/5 border-primary/30 shadow-[0_0_30px_rgba(0,218,243,0.15)]' : 'bg-surface-container-low border-outline-variant/30'}`}>
                 <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg ${evalResult ? 'bg-primary text-on-primary shadow-[0_0_15px_rgba(0,218,243,0.4)]' : 'bg-surface-container-highest text-tertiary border border-outline-variant/20'}`}>
                   {evalResult ? <span className="material-symbols-outlined text-[32px]">check</span> : <span className="material-symbols-outlined text-[32px]">close</span>}
                 </div>
                 <h4 className={`text-2xl font-black font-headline tracking-widest mb-3 uppercase ${evalResult ? 'text-primary' : 'text-on-surface-variant'}`}>
                   {evalResult ? 'TRUE (ON)' : 'FALSE (OFF)'}
                 </h4>
                 <p className="text-[11px] text-tertiary leading-relaxed mt-2 bg-surface-container-lowest px-4 py-2 rounded-lg border border-outline-variant/10 font-mono">
                   Result: <strong className={evalResult ? 'text-primary' : 'text-tertiary'}>{evalResult ? 'true' : 'false'}</strong> resolved for user context.
                 </p>
               </div>
            )}
            
            {/* Background embellishment */}
            <div className="absolute inset-0 pointer-events-none opacity-20 hidden md:block">
               <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Feature Status Overview */}
      <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-6 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold font-headline text-on-surface">Feature Context Overview</h3>
          <button className="text-xs font-bold uppercase tracking-widest text-primary hover:text-primary-fixed transition-colors">View all flags</button>
        </div>
        
        <div className="overflow-x-auto rounded-xl border border-outline-variant/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-lowest/50 text-tertiary text-[10px] uppercase font-bold tracking-widest">
              <tr className="border-b border-outline-variant/10">
                <th className="px-6 py-4">Flag Name</th>
                <th className="px-6 py-4">Target Environment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Rollout Strategy</th>
                <th className="px-6 py-4">Kill Switch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5 bg-surface-container-low/20">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sm text-tertiary font-medium">Loading flags...</td>
                </tr>
              ) : flags.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sm text-tertiary font-medium">No flags found.</td>
                </tr>
              ) : flags.map((flag) => {
                let envBg = 'bg-surface-container-highest text-tertiary border-outline-variant/20';
                if (flag.environment?.toLowerCase() === 'prod' || flag.environment?.toLowerCase() === 'production') {
                   envBg = 'bg-primary/10 text-primary border-primary/20';
                } else if (flag.environment?.toLowerCase() === 'staging') {
                   envBg = 'bg-secondary/10 text-secondary border-secondary/20';
                }

                const ksStatus = flag.kill_switch ? 'bg-error/10 text-error border-error/20 font-bold' : 'bg-surface-container-highest text-tertiary border-outline-variant/20';

                return (
                  <tr key={flag.id} className="hover:bg-surface-container-high/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-on-surface mb-0.5">{flag.name}</p>
                      <p className="text-[10px] font-mono text-tertiary/70 truncate max-w-[200px]">ID: {flag.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-0.5 text-[9px] uppercase tracking-widest font-bold rounded border ${envBg}`}>
                        {flag.environment || 'Global'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                         <div className={`w-1.5 h-1.5 rounded-full ${flag.enabled ? 'bg-primary shadow-[0_0_8px_#00daf3]' : 'bg-tertiary'}`}></div>
                         <span className={flag.enabled ? 'text-primary' : 'text-tertiary'}>{flag.enabled ? 'Active' : 'Inactive'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${flag.rollout_percentage === 0 ? 'bg-tertiary/30' : 'bg-primary'}`} 
                            style={{ width: `${flag.rollout_percentage || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-on-surface w-8">{flag.rollout_percentage || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-0.5 text-[9px] uppercase tracking-widest font-bold rounded border ${ksStatus}`}>
                        {flag.kill_switch ? 'Engaged' : 'Default'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Evaluator;
