import React, { useState, useEffect } from 'react';
import { Download, Plus, Flag, Activity, ShieldAlert, Globe, ChevronRight, MoreVertical, User, Hash, CheckCircle, XCircle, Terminal, Server } from 'lucide-react';
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

  const total = flags.length;
  const activeCount = flags.filter(f => f.enabled).length;
  const killSwitches = flags.filter(f => f.kill_switch).length;
  const envs = new Set(flags.map(f => f.environment).filter(Boolean)).size;

  const stats = [
    { title: 'Total Flags', value: total.toString(), subtitle: 'Registered flags in system', icon: Flag, iconBg: 'bg-blue-50', iconColor: 'text-blue-500', trend: 'Live' },
    { title: 'Active Flags', value: activeCount.toString(), subtitle: 'Currently serving traffic', icon: Activity, iconBg: 'bg-slate-50', iconColor: 'text-slate-500', trend: 'Live' },
    { title: 'Kill Switches', value: killSwitches.toString(), subtitle: 'Safety triggers engaged', icon: ShieldAlert, iconBg: 'bg-slate-50', iconColor: 'text-slate-500', trend: '' },
    { title: 'Environments', value: envs.toString(), subtitle: 'Active environments', icon: Globe, iconBg: 'bg-slate-50', iconColor: 'text-slate-500', trend: '' }
  ];

  const pipelineSteps = [
    { num: 1, title: 'Kill Switch', desc: 'Global safety override check.', icon: <ShieldAlert size={20} className="text-blue-500" /> },
    { num: 2, title: 'Environment', desc: 'Context verification.', icon: <Globe size={20} className="text-blue-500" /> },
    { num: 3, title: 'Boolean Logic', desc: 'Core state evaluation.', icon: <span className="font-bold text-blue-500 w-[20px] text-center">T/F</span> },
    { num: 4, title: 'User Targeting', desc: 'Identifier-based rules.', icon: <span className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div></span> },
    { num: 5, title: 'Rollout', desc: 'Final weight calculation.', icon: <div className="flex items-end gap-[2px] h-5"><div className="w-1.5 h-2 bg-blue-300"></div><div className="w-1.5 h-3.5 bg-blue-400"></div><div className="w-1.5 h-5 bg-blue-500"></div></div> }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Dashboard</h2>
          <p className="text-slate-500 text-sm">Monitor and manage your evaluation pipeline across environments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/export')} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Download size={16} /> Export Report
          </button>
          <button onClick={() => navigate('/create')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2">
            <Plus size={18} /> Create Flag
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-1">{stat.title}</h4>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</span>
                  </div>
                </div>
                <div className={`p-2.5 rounded-lg ${stat.iconBg} ${stat.iconColor}`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                {stat.trend && (
                  <span className={`px-1.5 py-0.5 rounded ${stat.trend}`}>
                    {stat.subtitle.split(' ')[0]}
                  </span>
                )}
                <span className="font-normal">{stat.trend ? stat.subtitle.split(' ').slice(1).join(' ') : stat.subtitle}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Evaluation Pipeline */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <span className="font-mono text-blue-500 font-bold">{'>_'}</span> Evaluation Pipeline
          </h3>
          <span className="text-xs font-semibold text-slate-400">Logic Engine v4.2.0</span>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-100 -translate-y-1/2 z-0 hidden md:block"></div>
            
            {pipelineSteps.map((step, i) => (
              <React.Fragment key={i}>
                <div className="relative z-10 flex flex-col items-center bg-white px-2">
                  <div className="w-16 h-16 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center shadow-sm mb-3 relative">
                    {step.icon}
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center border-2 border-white">
                      {step.num}
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{step.title}</h4>
                  <p className="text-[10px] text-slate-500 text-center max-w-[120px]">{step.desc}</p>
                </div>
                {i < pipelineSteps.length - 1 && (
                  <div className="hidden md:flex text-slate-300 z-10 bg-white">
                    <ChevronRight size={20} />
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
          <h3 className="text-xl font-bold text-slate-800">Diagnostic Evaluator</h3>
          <p className="text-sm text-slate-500 mt-1">Simulate flag resolution logic by providing target user context. Use this tool to verify rollout rules, environment overrides, and kill-switch states before deploying to production.</p>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Form */}
          <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-100 space-y-6">
            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-blue-600 mb-1">
                <Terminal size={16} /> Evaluation Request
              </h4>
              <p className="text-xs text-slate-500">Input user context parameters to simulate a flag check.</p>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Flag Name</label>
                <select 
                  name="flag_name"
                  value={evalForm.flag_name}
                  onChange={handleEvalChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select a flag...</option>
                  {flags.map(f => (
                    <option key={f.id} value={f.name}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">User ID</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" name="user_id" value={evalForm.user_id} onChange={handleEvalChange}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      placeholder="usr_alpha_112"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Country</label>
                  <div className="relative">
                    <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" name="country" value={evalForm.country} onChange={handleEvalChange}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      placeholder="US"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">App Version</label>
                <div className="relative">
                  <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" name="app_version" value={evalForm.app_version} onChange={handleEvalChange}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    placeholder="2.14.5"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pb-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Environment Target</label>
                <div className="flex items-center gap-4 mt-1">
                  {['Dev', 'Staging', 'Production'].map(e => (
                    <label key={e} className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${evalForm.environment === e ? 'border-blue-500' : 'border-slate-300'}`}>
                        {evalForm.environment === e && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                      </div>
                      <input type="radio" className="hidden" name="environment" value={e} onChange={handleEvalChange} />
                      <span className={`text-sm tracking-wide ${evalForm.environment === e ? 'text-blue-600 font-semibold' : 'text-slate-600'}`}>{e}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleEvaluate}
                disabled={evalStatus === 'loading'}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
              >
                {evalStatus === 'loading' ? 'Running Evaluation...' : 'Run Evaluation'}
              </button>

              <div className="p-3 bg-blue-50/50 border border-blue-100/50 rounded-lg flex gap-3 text-[11px] text-slate-500 items-start">
                <Server size={14} className="mt-0.5 text-blue-400 shrink-0" />
                <p>Evaluations are performed using the Edge SDK v4.2.1. Results are cached for 30s locally.</p>
              </div>
            </div>
          </div>

          {/* Right: Result */}
          <div className="p-6 md:p-8 flex flex-col items-center justify-center min-h-[400px]">
            {evalStatus === 'idle' && (
               <div className="border border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center w-full max-w-[320px]">
                 <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
                   <Activity size={20} />
                 </div>
                 <h4 className="text-slate-800 font-bold mb-1 text-sm">Waiting for Input</h4>
                 <p className="text-xs text-slate-500 leading-relaxed">Fill in the evaluation request form and click "Run Evaluation" to see the decision trace.</p>
               </div>
            )}
            
            {evalStatus === 'loading' && (
               <div className="border border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center w-full max-w-[320px]">
                 <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
                   <Activity size={20} />
                 </div>
                 <h4 className="text-slate-800 font-bold mb-1 text-sm">Evaluating...</h4>
                 <p className="text-xs text-slate-500">Processing rules globally.</p>
               </div>
            )}

            {evalStatus === 'error' && (
               <div className="border border-dashed border-red-200 rounded-xl p-8 flex flex-col items-center justify-center text-center w-full max-w-[320px] bg-red-50/50">
                 <div className="w-10 h-10 bg-white text-red-500 shadow-sm rounded-full flex items-center justify-center mb-4">
                   <ShieldAlert size={20} />
                 </div>
                 <h4 className="text-red-800 font-bold mb-1 text-sm">Evaluation Failed</h4>
                 <p className="text-xs text-red-600">The server encountered an error simulating this flag. Did you provide valid inputs?</p>
               </div>
            )}

            {evalStatus === 'success' && (
               <div className={`border rounded-xl p-8 flex flex-col items-center justify-center text-center w-full max-w-[320px] shadow-sm transition-all duration-500 ${evalResult ? 'bg-white border-green-200 shadow-green-100' : 'bg-slate-50 border-slate-200'}`}>
                 <div className={`w-14 h-14 rounded-full shadow-sm flex items-center justify-center mb-4 ${evalResult ? 'bg-green-500 text-white shadow-green-200' : 'bg-slate-400 text-white'}`}>
                   {evalResult ? <CheckCircle size={28} /> : <XCircle size={28} />}
                 </div>
                 <h4 className={`text-xl font-black tracking-tight mb-2 uppercase ${evalResult ? 'text-green-600' : 'text-slate-600'}`}>
                   {evalResult ? 'ENABLED' : 'DISABLED'}
                 </h4>
                 <p className={`text-sm ${evalResult ? 'text-slate-600' : 'text-slate-500'}`}>
                   The flag resolved to <strong>{evalResult ? 'true' : 'false'}</strong> for the provided user context.
                 </p>
               </div>
            )}
          </div>
          
        </div>
      </div>

      {/* Feature Status Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Feature Status Overview</h3>
          <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700">View all feature flags</a>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold border-b border-slate-200 tracking-wider">
              <tr>
                <th className="px-6 py-4">Flag Name</th>
                <th className="px-6 py-4">Environment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Rollout</th>
                <th className="px-6 py-4">Kill Switch</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-sm text-slate-500">Loading flags...</td>
                </tr>
              ) : flags.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-sm text-slate-500">No flags found.</td>
                </tr>
              ) : flags.map((flag) => {
                let envBg = 'bg-slate-100 text-slate-600 border-slate-200';
                if (flag.environment?.toLowerCase() === 'prod' || flag.environment?.toLowerCase() === 'production') {
                   envBg = 'bg-green-50 text-green-700 border-green-200';
                } else if (flag.environment?.toLowerCase() === 'staging') {
                   envBg = 'bg-amber-50 text-amber-700 border-amber-200';
                }

                const ksStatus = flag.kill_switch ? 'bg-red-50 text-red-700 border-red-200 font-bold' : 'bg-slate-50 text-slate-500 border-slate-200';

                return (
                  <tr key={flag.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 mb-0.5">{flag.name}</p>
                      <p className="text-[11px] text-slate-500 truncate max-w-[250px]">{flag.rules?.description || 'No description'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 text-[11px] font-semibold tracking-wide rounded-full border ${envBg}`}>
                        {flag.environment || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                         <div className={`w-2 h-2 rounded-full ${flag.enabled ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                         {flag.enabled ? 'Active' : 'Inactive'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${flag.rollout_percentage === 0 ? 'bg-slate-300' : 'bg-blue-500'}`} 
                            style={{ width: `${flag.rollout_percentage || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-slate-600 w-8">{flag.rollout_percentage || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded border ${ksStatus}`}>
                        {flag.kill_switch ? 'Engaged' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100">
                        <MoreVertical size={18} />
                      </button>
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
