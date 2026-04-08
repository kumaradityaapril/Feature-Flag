import React, { useState, useEffect } from 'react';
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
      } else {
        await API.post('/flags', payload);
      }
      navigate('/flags');
    } catch (err) {
      console.error(err);
      alert("Error creating flag. Check console.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-8 text-center text-tertiary">Loading flag details...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <nav className="flex items-center gap-2 text-xs font-mono text-tertiary/60 mb-4 uppercase tracking-tighter">
            <span className="cursor-pointer hover:text-on-surface" onClick={() => navigate('/flags')}>Flags</span>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-primary">{isEditMode ? 'Edit Flag' : 'New Flag'}</span>
          </nav>
          <h1 className="text-4xl font-headline font-bold tracking-tight text-on-surface">{isEditMode ? 'Edit Feature Flag' : 'Create New Flag'}</h1>
          <p className="text-on-surface-variant mt-2 max-w-xl">{isEditMode ? 'Modify configurations and targeting rules for this existing flag.' : 'Initialize a new feature toggle across your infrastructure. Define targeting rules and environment states.'}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/flags')}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold border border-outline-variant/20 hover:bg-surface-container-high transition-all text-on-surface"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 rounded-lg text-sm font-bold bg-gradient-to-br from-primary to-on-primary-container text-on-primary shadow-lg shadow-primary/10 active:scale-95 transition-all outline-none disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <span className="material-symbols-outlined animate-spin text-sm">clock_loader_40</span> : <span className="material-symbols-outlined text-sm">rocket_launch</span>}
            {isEditMode ? 'Save Changes' : 'Deploy Flag'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Primary Config & Targeting */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Section: General Identity */}
          <section className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="flex items-center gap-2 mb-8">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              <h2 className="font-headline text-lg font-semibold tracking-wide uppercase">General Identity</h2>
            </div>
            
            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-tertiary">Flag Name (Key)</label>
                <div className="relative">
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    readOnly={isEditMode}
                    className={`w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg pl-4 pr-10 py-3 font-mono text-sm transition-all outline-none ${isEditMode ? 'text-tertiary cursor-not-allowed opacity-70' : 'text-primary focus:border-primary focus:ring-1 focus:ring-primary/20'}`} 
                    placeholder="e.g. beta_dashboard_v1" 
                    type="text"
                  />
                  {isEditMode && <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant text-sm">lock</span>}
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-tertiary">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none resize-none" 
                  placeholder="Describe the purpose of this flag..." 
                  rows="3"
                ></textarea>
              </div>
            </div>
          </section>

          {/* Section: Targeting Rules */}
          <section className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/10">
            <div className="flex items-center gap-2 mb-8">
              <span className="w-1.5 h-6 bg-secondary rounded-full"></span>
              <h2 className="font-headline text-lg font-semibold tracking-wide uppercase">Targeting Rules</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-tertiary">Target User IDs (Comma Separated)</label>
                  <input 
                    name="targetUserIds"
                    value={formData.targetUserIds}
                    onChange={handleChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all outline-none" 
                    placeholder="user_123, user_456" 
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-tertiary">Country Codes (e.g. US, IN)</label>
                  <input 
                    name="countryCodes"
                    value={formData.countryCodes}
                    onChange={handleChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all outline-none uppercase font-mono text-sm" 
                    placeholder="US, CA, GB" 
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-tertiary">Minimum App Version</label>
                  <input 
                    name="minAppVersion"
                    value={formData.minAppVersion}
                    onChange={handleChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 text-primary font-mono focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all outline-none text-sm" 
                    placeholder="1.2.0" 
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-tertiary">Rollout Percentage ({formData.rolloutPercentage}%)</label>
                  <input 
                    type="range" 
                    name="rolloutPercentage"
                    value={formData.rolloutPercentage}
                    onChange={handleChange}
                    min="0" max="100" step="1"
                    className="w-full h-2 bg-surface-container mt-3 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column: Contextual Actions */}
        <div className="space-y-6">
          
          {/* Default Boolean State */}
          <section className="bg-surface-container rounded-xl p-6 border border-outline-variant/10 shadow-lg">
            <h2 className="font-headline text-sm font-bold tracking-widest uppercase mb-6 flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-sm">toggle_on</span>
              Default State
            </h2>
            <div className="bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/10 flex">
              <button 
                onClick={() => setBooleanState('ON')}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${booleanState === 'ON' ? 'bg-primary/20 text-primary border border-primary/30' : 'text-tertiary hover:bg-surface-container'}`}
              >
                ENABLE (ON)
              </button>
              <button 
                onClick={() => setBooleanState('OFF')}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${booleanState === 'OFF' ? 'bg-surface-container-highest text-on-surface border border-outline-variant/30' : 'text-tertiary hover:bg-surface-container'}`}
              >
                DISABLE (OFF)
              </button>
            </div>
          </section>

          {/* Environment Selection */}
          <section className="bg-surface-container rounded-xl p-6 border border-outline-variant/10 shadow-lg">
            <h2 className="font-headline text-sm font-bold tracking-widest uppercase mb-6 flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-sm">cloud_done</span>
              Environment
            </h2>
            <div className="space-y-3">
              {['Dev', 'Staging', 'Production'].map((e) => (
                <div 
                  key={e} 
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${env === e.toLowerCase() ? 'bg-primary/10 border-primary/30' : 'bg-surface-container-lowest border-outline-variant/5 hover:border-outline-variant/20'}`}
                  onClick={() => setEnv(e.toLowerCase())}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${env === e.toLowerCase() ? 'bg-primary shadow-[0_0_8px_rgba(0,218,243,0.5)]' : 'bg-tertiary'}`}></div>
                    <div>
                      <p className={`text-xs font-bold ${env === e.toLowerCase() ? 'text-primary' : 'text-on-surface'}`}>{e}</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${env === e.toLowerCase() ? 'border-primary' : 'border-outline-variant/30'}`}>
                    {env === e.toLowerCase() && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Kill Switch Card */}
          <section className={`rounded-xl p-6 border-l-2 shadow-lg transition-colors ${killSwitch ? 'bg-error/10 border-error' : 'bg-surface-container-lowest border-outline-variant/20'}`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`material-symbols-outlined text-sm ${killSwitch ? 'text-error' : 'text-tertiary'}`}>shield</span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${killSwitch ? 'text-error' : 'text-tertiary'}`}>Emergency Kill Switch</span>
                </div>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Immediately overrides logic and evaluates this flag as <span className="font-mono text-error">false</span> for all traffic.
                </p>
              </div>
              <button 
                onClick={() => setKillSwitch(!killSwitch)}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 outline-none ${killSwitch ? 'bg-error' : 'bg-surface-container-highest'}`}
              >
                <div className={`w-4 h-4 rounded-full shadow-sm transform transition-transform ${killSwitch ? 'translate-x-6 bg-error-container' : 'translate-x-0 bg-tertiary'}`}></div>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CreateFlag;
