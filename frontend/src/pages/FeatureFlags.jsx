import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Plus, MoreHorizontal, TerminalSquare, Clock, Trash2 } from 'lucide-react';
import API from '../api/api';
import { useNavigate, useLocation } from 'react-router-dom';

const FeatureFlags = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(location.state?.search || '');
  const [envFilter, setEnvFilter] = useState('All');

  const filteredFlags = flags.filter(flag => {
    const searchString = searchQuery.toLowerCase();
    const matchesSearch = 
      (flag.name || '').toLowerCase().includes(searchString) ||
      String(flag.id).includes(searchString) ||
      (flag.rules?.description || '').toLowerCase().includes(searchString);
      
    let matchesEnv = true;
    if (envFilter !== 'All') {
      const dbEnv = (flag.environment || '').toLowerCase();
      const filterEnv = envFilter.toLowerCase();
      if (filterEnv === 'production') {
        matchesEnv = dbEnv === 'prod' || dbEnv === 'production';
      } else if (filterEnv === 'development') {
        matchesEnv = dbEnv === 'dev' || dbEnv === 'development';
      } else {
        matchesEnv = dbEnv === filterEnv;
      }
    }
                       
    return matchesSearch && matchesEnv;
  });

  const fetchFlags = async () => {
    try {
      const res = await API.get('/flags');
      // Backend returns { data: [...] } based on standard struct, verify nested data
      setFlags(res.data.data || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const toggleFlag = async (flag) => {
    try {
      await API.put(`/flags/${flag.id}`, { ...flag, enabled: !flag.enabled });
      fetchFlags();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteFlag = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this flag?")) {
        await API.delete(`/flags/${id}`);
        fetchFlags();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const downloadFilteredCSV = () => {
    if (!filteredFlags.length) return;
    const headers = ["ID", "Name", "Enabled", "Environment", "Rollout Percentage", "Kill Switch", "Created At"];
    const csvRows = [headers.join(',')];
    filteredFlags.forEach(flag => {
      csvRows.push([
        flag.id,
        `"${flag.name}"`,
        flag.enabled,
        `"${flag.environment || ''}"`,
        flag.rollout_percentage,
        flag.kill_switch,
        `"${flag.created_at || ''}"`
      ].join(','));
    });
    const csvContent = "data:text/csv;charset=utf-8," + encodeURI(csvRows.join('\n'));
    const link = document.createElement("a");
    link.href = csvContent;
    link.download = "feature_flags_filtered.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeCount = flags.filter(f => f.enabled).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Feature Flags</h2>
          <p className="text-slate-500 text-sm">Manage your application feature toggles across multiple environments.</p>
        </div>
        <button 
          onClick={() => navigate('/create')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <Plus size={18} /> New Flag
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border md:border-r-0 border-slate-200 rounded-lg md:rounded-r-none p-5 flex items-center gap-4 justify-center md:justify-start">
           <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
             <TerminalSquare size={20} />
           </div>
           <div>
             <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Total Flags</p>
             <h4 className="text-2xl font-bold text-slate-900">{flags.length}</h4>
           </div>
        </div>
        <div className="bg-white border md:border-x border-slate-200 p-5 flex items-center gap-4 justify-center md:justify-start">
           <div>
             <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Active Now</p>
             <h4 className="text-2xl font-bold text-slate-900">{activeCount}</h4>
           </div>
        </div>
        <div className="bg-white border md:border-l-0 border-slate-200 rounded-lg md:rounded-l-none p-5 flex items-center gap-4 justify-center md:justify-start">
           <div className="text-slate-400"><Clock size={20} /></div>
           <div>
             <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Recent Changes</p>
             <h4 className="text-2xl font-bold text-slate-900">-</h4>
           </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 items-center">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flags by name, ID or description..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          />
        </div>
        <div className="flex w-full lg:w-auto items-center gap-3 justify-end">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <Filter size={16} /> Filters
          </button>
          <select 
            value={envFilter}
            onChange={(e) => setEnvFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-slate-50 focus:outline-none focus:border-blue-500 appearance-none"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', paddingRight: '2rem' }}
          >
            <option value="All">All Environments</option>
            <option value="Production">Production</option>
            <option value="Staging">Staging</option>
            <option value="Development">Development</option>
          </select>
          <button 
            onClick={downloadFilteredCSV}
            disabled={filteredFlags.length === 0}
            className="bg-white border border-slate-200 text-slate-700 p-2 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} className="text-slate-500" />
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Flag Name & ID</th>
                <th className="px-6 py-4">Environment</th>
                <th className="px-6 py-4">Rollout Percentage</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sm text-slate-500">Loading flags...</td>
                </tr>
              ) : filteredFlags.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sm text-slate-500">
                    {flags.length === 0 ? "No flags found. Create one to get started." : "No flags match your search and filter criteria."}
                  </td>
                </tr>
              ) : filteredFlags.map((flag) => {
                let envColor = 'bg-slate-100 text-slate-600 border-slate-200';
                if (flag.environment?.toLowerCase() === 'prod' || flag.environment?.toLowerCase() === 'production') {
                   envColor = 'bg-blue-50 text-blue-600 border-blue-100';
                } else if (flag.environment?.toLowerCase() === 'staging') {
                   envColor = 'bg-amber-50 text-amber-600 border-amber-100';
                }
                
                return (
                  <tr key={flag.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 mb-0.5">{flag.name}</p>
                      <p className="text-xs font-mono text-blue-500 mb-1">ID: {flag.id}</p>
                      {flag.kill_switch && <span className="text-[10px] bg-red-100 text-red-600 px-1 py-0.5 rounded font-bold">KILL SWITCH ENGAGED</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full border ${envColor}`}>
                        {flag.environment || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-[120px]">
                          <div className="text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Targeting</div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${flag.rollout_percentage === 0 ? 'bg-slate-300' : 'bg-blue-500'}`} 
                              style={{ width: `${flag.rollout_percentage || 0}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-600 mt-3">{flag.rollout_percentage || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         <div 
                           onClick={() => toggleFlag(flag)}
                           className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${flag.enabled ? 'bg-blue-600' : 'bg-slate-300'}`}
                         >
                           <div className={`bg-white w-3 h-3 rounded-full shadow-sm transform transition-transform ${flag.enabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                         </div>
                         <span className={`text-sm font-semibold ${flag.enabled ? 'text-slate-900' : 'text-slate-400'}`}>
                           {flag.enabled ? 'Live' : 'Off'}
                         </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => deleteFlag(flag.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-slate-100"
                        title="Delete Flag"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">Showing <span className="font-semibold text-slate-900">{filteredFlags.length > 0 ? 1 : 0}-{filteredFlags.length}</span> of <span className="font-semibold text-slate-900">{flags.length}</span> flags</p>
          <div className="flex items-center gap-1">
            <button className="text-sm font-medium text-slate-400 px-3 py-1 flex items-center gap-1 cursor-not-allowed">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              Previous
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md bg-transparent text-sm font-medium text-slate-500 hover:bg-slate-50">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md bg-transparent text-sm font-medium text-slate-500 hover:bg-slate-50">3</button>
            <span className="text-slate-400 px-1">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-md bg-transparent text-sm font-medium text-slate-500 hover:bg-slate-50">25</button>
            <button className="text-sm font-medium text-slate-900 px-3 py-1 flex items-center gap-1 hover:bg-slate-50 rounded-md">
              Next
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FeatureFlags;
