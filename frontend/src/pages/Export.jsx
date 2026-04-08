import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

const Export = () => {
  const navigate = useNavigate();
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/flags')
      .then(res => setFlags(res.data.data || res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(flags, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `feature_flags_export_${new Date().getTime()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const downloadCSV = () => {
    if (!flags.length) return;
    
    // Convert to CSV
    const headers = ["ID", "Name", "Enabled", "Environment", "Rollout Percentage", "Kill Switch", "Created At"];
    const csvRows = [headers.join(',')];
    
    flags.forEach(flag => {
      const row = [
        flag.id,
        `"${flag.name}"`,
        flag.enabled,
        `"${flag.environment || 'Global'}"`,
        flag.rollout_percentage,
        flag.kill_switch,
        `"${flag.created_at}"`
      ];
      csvRows.push(row.join(','));
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + encodeURI(csvRows.join('\n'));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", csvContent);
    downloadAnchorNode.setAttribute("download", `feature_flags_export_${new Date().getTime()}.csv`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-outline-variant/10 pb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-surface-container rounded-full transition-colors text-tertiary flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div>
          <h2 className="text-3xl font-bold font-headline text-on-surface mb-1">Export Data</h2>
          <p className="text-tertiary text-sm">Download your feature flag configurations for backup or analysis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* JSON Export Card */}
        <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-16 h-16 bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center justify-center mb-6 relative z-10 shadow-[0_0_15px_rgba(0,218,243,0.15)]">
            <span className="material-symbols-outlined text-[32px]">data_object</span>
          </div>
          <h3 className="text-lg font-bold font-headline tracking-widest text-on-surface mb-2 uppercase z-10">JSON Format</h3>
          <p className="text-[11px] text-tertiary mb-8 leading-relaxed max-w-[240px] z-10">
            Full configuration including complex targeting rules. Best for precise, reliable infrastructure backups.
          </p>
          <button 
            onClick={downloadJSON}
            disabled={loading || flags.length === 0}
            className="w-full py-3 bg-surface-container-highest border border-primary/30 hover:border-primary/60 hover:bg-primary/10 disabled:border-outline-variant/10 disabled:opacity-50 disabled:cursor-not-allowed text-primary rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 z-10"
          >
            {loading ? <span className="material-symbols-outlined animate-spin text-[16px]">sync</span> : <span className="material-symbols-outlined text-[16px]">download</span>}
            Download JSON
          </button>
        </div>

        {/* CSV Export Card */}
        <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden group">
           <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-16 h-16 bg-secondary/10 text-secondary border border-secondary/20 rounded-full flex items-center justify-center mb-6 relative z-10 shadow-[0_0_15px_rgba(255,180,171,0.1)]">
            <span className="material-symbols-outlined text-[32px]">view_list</span>
          </div>
          <h3 className="text-lg font-bold font-headline tracking-widest text-on-surface mb-2 uppercase z-10">CSV Format</h3>
          <p className="text-[11px] text-tertiary mb-8 leading-relaxed max-w-[240px] z-10">
            Flattened overview of feature flags. Best for spreadsheets, analytics integrations, and executive reporting.
          </p>
          <button 
            onClick={downloadCSV}
            disabled={loading || flags.length === 0}
            className="w-full py-3 bg-surface-container-highest border border-secondary/30 hover:border-secondary/60 hover:bg-secondary/10 disabled:border-outline-variant/10 disabled:opacity-50 disabled:cursor-not-allowed text-secondary rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 z-10"
          >
            {loading ? <span className="material-symbols-outlined animate-spin text-[16px]">sync</span> : <span className="material-symbols-outlined text-[16px]">download</span>}
            Download CSV
          </button>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-6">
        <h4 className="font-bold text-[10px] uppercase tracking-widest text-tertiary mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">visibility</span> 
          Export Data Preview ({flags.length} Flags Loaded)
        </h4>
        <div className="bg-surface-container-lowest border border-outline-variant/5 rounded-xl p-4 overflow-x-auto max-h-[400px]">
          <pre className="text-[11px] text-primary/80 font-mono tracking-tight leading-relaxed">
            {loading ? 'Initializing payload...' : JSON.stringify(flags, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Export;
