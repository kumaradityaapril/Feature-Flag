import React, { useState, useEffect } from 'react';
import { ChevronLeft, ShieldAlert, HelpCircle, Globe } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/api';

const CreateFlag = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [killSwitch, setKillSwitch] = useState(false);
  const [booleanState, setBooleanState] = useState('OFF');
  const [env, setEnv] = useState('Production');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetUserIds: '',
    countryCodes: '',
    minAppVersion: '',
    rolloutPercentage: 100
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (isEditMode) {
      const fetchFlag = async () => {
        try {
          const res = await API.get(`/flags/${id}`);
          const flag = res.data?.data || res.data;
          setFormData({
            name: flag.name || '',
            description: flag.rules?.description || '',
            targetUserIds: flag.rules?.users?.join(', ') || '',
            countryCodes: flag.rules?.countries?.join(', ') || '',
            minAppVersion: flag.rules?.min_version || '',
            rolloutPercentage: flag.rollout_percentage || 0
          });
          setBooleanState(flag.enabled ? 'ON' : 'OFF');
          setKillSwitch(flag.kill_switch || false);
          setEnv(flag.environment || 'Production');
        } catch (err) {
          console.error(err);
          alert("Error fetching flag details.");
        } finally {
          setFetching(false);
        }
      };
      fetchFlag();
    }
  }, [id, isEditMode]);

  const handleSubmit = async () => {
    if (!formData.name) {
      alert("Flag Name is required.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        enabled: booleanState === 'ON',
        environment: env,
        rollout_percentage: Number(formData.rolloutPercentage),
        kill_switch: killSwitch,
        rules: {
          description: formData.description,
          users: formData.targetUserIds ? formData.targetUserIds.split(',').map(s=>s.trim()) : [],
          countries: formData.countryCodes ? formData.countryCodes.split(',').map(s=>s.trim()) : [],
          min_version: formData.minAppVersion
        }
      };

      if (isEditMode) {
        await API.put(`/flags/${id}`, payload);
        alert("Flag updated successfully!");
      } else {
        await API.post('/flags', payload);
        alert("Flag created successfully!");
      }
      navigate('/flags');
    } catch (err) {
      console.error(err);
      alert("Error creating flag. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
        <div>
          <button 
            onClick={() => navigate('/flags')}
            className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-2"
          >
            <ChevronLeft size={16} /> Back to Flags
          </button>
          <h2 className="text-3xl font-bold text-slate-900 mb-1">{isEditMode ? 'Edit Feature Flag' : 'Create Feature Flag'}</h2>
          <p className="text-slate-500 text-sm">{isEditMode ? 'Modify configurations and targeting rules for this existing flag.' : 'Define a new flag, its default state, and targeting rules for specific user cohorts.'}</p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button 
            onClick={() => navigate('/flags')}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Discard Changes
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading || fetching}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
          >
            {loading ? "Saving..." : (isEditMode ? "Save Changes" : "Create Flag")}
          </button>
        </div>
      </div>

      {fetching && <div className="p-8 text-center text-slate-500">Loading flag details...</div>}

      {!fetching && (
        <>
          <div className="h-px bg-slate-200 w-full mb-8"></div>


      {/* General Information */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">General Information</h3>
          <p className="text-sm text-slate-500">Identity and purpose of the feature flag.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-2">
               <div className="flex items-center justify-between">
                 <label className="text-sm font-semibold text-slate-900">Flag Name*</label>
                 <HelpCircle size={14} className="text-slate-400 cursor-help" />
               </div>
               <input 
                 type="text" 
                 name="name"
                 value={formData.name}
                 onChange={handleChange}
                 placeholder="Enter flag name..." 
                 className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow focus:bg-white"
               />
               <p className="text-xs text-slate-500">Unique identifier used in your source code (e.g., <code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-mono">new_checkout_v2</code>).</p>
            </div>
            
            <div className="flex-1 space-y-2">
               <div className="flex items-center justify-between">
                 <label className="text-sm font-semibold text-slate-900">Environment</label>
                 <HelpCircle size={14} className="text-slate-400 cursor-help" />
               </div>
               <div className="flex items-center gap-6 mt-2">
                 {['Dev', 'Staging', 'Production'].map((e) => (
                   <label key={e} className="flex items-center gap-2 cursor-pointer group">
                     <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${env === e ? 'border-blue-500' : 'border-slate-300 group-hover:border-blue-400'}`}>
                       {env === e && <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>}
                     </div>
                     <input type="radio" className="hidden" name="env" value={e} checked={env === e} onChange={() => setEnv(e)} />
                     <span className={`text-sm font-medium ${env === e ? 'text-slate-900' : 'text-slate-600'}`}>{e}</span>
                   </label>
                 ))}
               </div>
               <p className="text-xs text-slate-500 mt-2 block">Primary environment for this configuration.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
               <div className="flex items-center justify-between">
                 <label className="text-sm font-semibold text-slate-900">Description</label>
                 <HelpCircle size={14} className="text-slate-400 cursor-help" />
               </div>
               <textarea 
                 rows="3"
                 name="description"
                 value={formData.description}
                 onChange={handleChange}
                 placeholder="Describe what this feature controls and who requested it..." 
                 className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow focus:bg-white resize-none"
               ></textarea>
            </div>

            <div className="space-y-2 w-full md:w-1/2">
               <div className="flex items-center justify-between">
                 <label className="text-sm font-semibold text-slate-900">Rollout Percentage</label>
                 <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 rounded">{formData.rolloutPercentage}%</span>
               </div>
               <input 
                 type="range" 
                 name="rolloutPercentage"
                 value={formData.rolloutPercentage}
                 onChange={handleChange}
                 min="0" max="100" step="1"
                 className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
               />
               <p className="text-xs text-slate-500 mt-1">Percentage of traffic that receives this flag when targeted.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Configuration */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Global Configuration</h3>
          <p className="text-sm text-slate-500">Control the fundamental behavior of the flag across the environment.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
             <div className="space-y-1">
               <label className="text-sm font-semibold text-slate-900">Boolean State</label>
               <p className="text-xs text-slate-500 pr-4 mt-0">The fallback value if no targeting rules are met.</p>
             </div>
             <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
               <button 
                 onClick={() => setBooleanState('ON')}
                 className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${booleanState === 'ON' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 ON
               </button>
               <button 
                 onClick={() => setBooleanState('OFF')}
                 className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${booleanState === 'OFF' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 OFF
               </button>
             </div>
          </div>
          
          <div className={`p-4 rounded-lg border flex items-start gap-4 transition-colors ${killSwitch ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-slate-50'}`}>
            <div className={`p-2 rounded-lg mt-0.5 ${killSwitch ? 'bg-red-100 text-red-600' : 'bg-white text-slate-400 shadow-sm'}`}>
              <ShieldAlert size={20} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className={`text-sm font-bold ${killSwitch ? 'text-red-900' : 'text-slate-800'}`}>Kill Switch</h4>
                  <p className={`text-xs mt-1 leading-relaxed ${killSwitch ? 'text-red-700' : 'text-slate-500'}`}>
                    Immediately disables flag logic across all targeting. If active, the flag will always return FALSE (or the system default).
                  </p>
                </div>
                
                {/* Toggle Switch */}
                <button 
                  onClick={() => setKillSwitch(!killSwitch)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${killSwitch ? 'bg-red-500' : 'bg-slate-300'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${killSwitch ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Targeting Rules */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Targeting Rules</h3>
          <p className="text-sm text-slate-500">Apply specific logic to subsets of users or versions.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6 relative overflow-hidden">
          <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 left-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
               <div className="flex items-center justify-between">
                 <label className="text-sm font-semibold text-slate-900">Target User IDs</label>
                 <HelpCircle size={14} className="text-slate-400 cursor-help" />
               </div>
               <div className="relative">
                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                 </div>
                 <input 
                   type="text" 
                   name="targetUserIds"
                   value={formData.targetUserIds}
                   onChange={handleChange}
                   placeholder="e.g. user_123, admin@org.com" 
                   className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow focus:bg-white"
                 />
               </div>
               <p className="text-xs text-slate-500 mt-1">Comma-separated list of UUIDs or Emails.</p>
            </div>
            
            <div className="space-y-2">
               <div className="flex items-center justify-between">
                 <label className="text-sm font-semibold text-slate-900">Country Codes</label>
                 <HelpCircle size={14} className="text-slate-400 cursor-help" />
               </div>
               <div className="relative">
                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                   <Globe size={16} />
                 </div>
                 <input 
                   type="text" 
                   name="countryCodes"
                   value={formData.countryCodes}
                   onChange={handleChange}
                   placeholder="US, CA, FR" 
                   className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow focus:bg-white text-slate-900"
                 />
               </div>
               <p className="text-xs text-slate-500 mt-1">ISO 3166-1 alpha-2 codes (e.g., US, GB, JP).</p>
            </div>
            
            <div className="space-y-2">
               <div className="flex items-center justify-between">
                 <label className="text-sm font-semibold text-slate-900">Min App Version</label>
                 <HelpCircle size={14} className="text-slate-400 cursor-help" />
               </div>
               <div className="relative">
                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">
                   &gt;=
                 </div>
                 <input 
                   type="text" 
                   name="minAppVersion"
                   value={formData.minAppVersion}
                   onChange={handleChange}
                   placeholder="0.0.0" 
                   className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow focus:bg-white text-slate-900"
                 />
               </div>
               <p className="text-xs text-slate-500 mt-1">Semantic versioning (e.g. 1.2.0)</p>
            </div>
            
          </div>
        </div>
      </section>
        </>
      )}
    </div>
  );
};

export default CreateFlag;
