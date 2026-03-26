import React, { useState, useEffect } from 'react';
import { Download, FileJson, FileText, ArrowLeft, Loader2 } from 'lucide-react';
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
    downloadAnchorNode.setAttribute("download", "feature_flags_export.json");
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
        `"${flag.environment}"`,
        flag.rollout_percentage,
        flag.kill_switch,
        `"${flag.created_at}"`
      ];
      csvRows.push(row.join(','));
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", encodedUri);
    downloadAnchorNode.setAttribute("download", "feature_flags_export.csv");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Export Data</h2>
          <p className="text-slate-500 text-sm">Download your feature flag configurations for backup or analysis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
            <FileJson size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">JSON Format</h3>
          <p className="text-sm text-slate-500 mb-6">Full configuration including complex targeting rules. Best for reliable backups.</p>
          <button 
            onClick={downloadJSON}
            disabled={loading || flags.length === 0}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            Download JSON
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
            <FileText size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">CSV Format</h3>
          <p className="text-sm text-slate-500 mb-6">Flattened overview of feature flags. Best for spreadsheets and analytical reporting.</p>
          <button 
            onClick={downloadCSV}
            disabled={loading || flags.length === 0}
            className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            Download CSV
          </button>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <h4 className="font-bold text-slate-800 mb-4">Export Preview ({flags.length} Flags found)</h4>
        <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto max-h-[400px]">
          <pre className="text-[11px] text-green-400 font-mono">
            {loading ? 'Loading...' : JSON.stringify(flags, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Export;
