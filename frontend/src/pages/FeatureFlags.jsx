import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { useNavigate, useLocation } from 'react-router-dom';

const FeatureFlags = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(location.state?.search || '');
  const [envFilter, setEnvFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 7;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, envFilter, statusFilter]);

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

    let matchesStatus = true;
    if (statusFilter === 'Live') {
      matchesStatus = flag.enabled === true;
    } else if (statusFilter === 'Off') {
      matchesStatus = flag.enabled === false;
    }
                       
    return matchesSearch && matchesEnv && matchesStatus;
  });

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

  const toggleKillSwitch = async (flag) => {
    try {
      if (!flag.kill_switch) {
        if (window.confirm(`Are you sure you want to ENGAGE the Kill Switch for '${flag.name}'? This will instantly bypass all rules and disable it.`)) {
          await API.put(`/flags/${flag.id}`, { ...flag, kill_switch: true });
          fetchFlags();
        }
      } else {
        if (window.confirm(`Disengage the Kill Switch for '${flag.name}'?`)) {
          await API.put(`/flags/${flag.id}`, { ...flag, kill_switch: false });
          fetchFlags();
        }
      }
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

  const totalPages = Math.ceil(filteredFlags.length / ITEMS_PER_PAGE);
  const paginatedFlags = filteredFlags.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-headline text-on-surface mb-1">Feature Flags</h2>
          <p className="text-tertiary text-sm mt-1">Manage your application feature toggles across multiple environments.</p>
        </div>
        <button 
          onClick={() => navigate('/create')}
          className="bg-gradient-to-br from-primary to-on-primary-container text-on-primary px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg active:scale-95 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span> New Flag
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/5">
           <p className="text-tertiary text-[10px] uppercase tracking-widest font-bold mb-1">Total Flags</p>
           <div className="flex items-end justify-between mt-2">
             <h4 className="text-2xl font-bold font-headline text-on-surface">{flags.length}</h4>
             <span className="material-symbols-outlined text-primary text-2xl">flag</span>
           </div>
        </div>
        <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/5">
           <p className="text-tertiary text-[10px] uppercase tracking-widest font-bold mb-1">Active Now</p>
           <div className="flex items-end justify-between mt-2">
             <h4 className="text-2xl font-bold font-headline text-on-surface">{activeCount}</h4>
             <span className="material-symbols-outlined text-secondary text-2xl">check_circle</span>
           </div>
        </div>
        <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/5">
           <p className="text-tertiary text-[10px] uppercase tracking-widest font-bold mb-1">Recent Changes</p>
           <div className="flex items-end justify-between mt-2">
             <h4 className="text-2xl font-bold font-headline text-on-surface">-</h4>
             <span className="material-symbols-outlined text-tertiary text-2xl">history</span>
           </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 items-center bg-surface-container-low/40 p-4 border border-outline-variant/5 rounded-2xl">
        <div className="relative w-full lg:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-tertiary text-lg">search</span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flags by name, ID or description..." 
            className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/10 rounded-lg text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-tertiary/50 transition-all font-body"
          />
        </div>
        <div className="flex w-full lg:w-auto items-center gap-3 justify-end">
          <div className="relative">
            <button 
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-xs font-semibold transition-colors ${showFilterMenu || statusFilter !== 'All' ? 'bg-primary/10 border-primary text-primary' : 'bg-surface-container-lowest border-outline-variant/20 text-tertiary hover:bg-surface-container'}`}
            >
              <span className="material-symbols-outlined text-sm">filter_list</span> Filters
              {statusFilter !== 'All' && <span className="w-1.5 h-1.5 rounded-full bg-primary absolute top-0 -right-1"></span>}
            </button>
            
            {showFilterMenu && (
              <div className="absolute top-full right-0 lg:left-0 mt-2 w-48 bg-surface-container-high border border-outline-variant/20 rounded-xl shadow-xl z-20 py-2">
                <div className="px-4 py-1.5 text-[10px] font-bold text-tertiary uppercase tracking-widest">Status Filter</div>
                <button 
                  onClick={() => { setStatusFilter('All'); setShowFilterMenu(false); }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${statusFilter === 'All' ? 'bg-primary/10 text-primary font-semibold' : 'text-on-surface hover:bg-surface-container'}`}
                >
                  All Statuses
                </button>
                <button 
                  onClick={() => { setStatusFilter('Live'); setShowFilterMenu(false); }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${statusFilter === 'Live' ? 'bg-primary/10 text-primary font-semibold' : 'text-on-surface hover:bg-surface-container'}`}
                >
                  Live Only
                </button>
                <button 
                  onClick={() => { setStatusFilter('Off'); setShowFilterMenu(false); }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${statusFilter === 'Off' ? 'bg-primary/10 text-primary font-semibold' : 'text-on-surface hover:bg-surface-container'}`}
                >
                  Off Only
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <select 
              value={envFilter}
              onChange={(e) => setEnvFilter(e.target.value)}
              className="bg-surface-container-lowest border border-outline-variant/20 text-tertiary px-3 py-2 pr-8 rounded-lg text-xs font-semibold cursor-pointer hover:bg-surface-container focus:outline-none focus:border-primary appearance-none transition-colors h-[34px]"
            >
              <option value="All">All Envs</option>
              <option value="Production">Prod</option>
              <option value="Staging">Staging</option>
              <option value="Development">Dev</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-tertiary text-sm pointer-events-none">expand_more</span>
          </div>

          <button 
            onClick={downloadFilteredCSV}
            disabled={filteredFlags.length === 0}
            className="flex items-center justify-center bg-surface-container-lowest border border-outline-variant/20 text-tertiary px-3 py-2 rounded-lg hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-[34px]"
            title="Download CSV"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface-container-lowest/50 border border-outline-variant/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-low/20">
              <tr className="border-b border-outline-variant/5">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-tertiary">Flag Name & ID</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-tertiary">Environment</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-tertiary">Rollout Percentage</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-tertiary">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-tertiary text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sm text-tertiary font-medium">Loading flags...</td>
                </tr>
              ) : paginatedFlags.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sm text-tertiary font-medium">
                    {flags.length === 0 ? "No flags found. Create one to get started." : "No flags match your search and filter criteria."}
                  </td>
                </tr>
              ) : paginatedFlags.map((flag) => {
                let envColor = 'bg-surface-container-highest text-tertiary border-outline-variant/20';
                if (flag.environment?.toLowerCase() === 'prod' || flag.environment?.toLowerCase() === 'production') {
                   envColor = 'bg-primary/10 text-primary border-primary/20';
                } else if (flag.environment?.toLowerCase() === 'staging') {
                   envColor = 'bg-secondary/10 text-secondary border-secondary/20';
                }
                
                return (
                  <tr key={flag.id} className="hover:bg-surface-container-high/30 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-on-surface mb-0.5">{flag.name}</p>
                      <p className="text-[10px] font-mono text-tertiary/70 mb-1">ID: {flag.id}</p>
                      {flag.kill_switch && <span className="text-[9px] bg-error/10 text-error px-1.5 py-0.5 rounded font-bold uppercase tracking-widest border border-error/20 inline-block shadow-[0_0_8px_rgba(255,180,171,0.2)]">Kill Switch</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded border ${envColor}`}>
                        {flag.environment || 'Global'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-[120px]">
                          <div className="text-[9px] font-bold text-tertiary mb-1 uppercase tracking-wider">Targeting</div>
                          <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${flag.rollout_percentage === 0 ? 'bg-tertiary/30' : 'bg-primary'}`} 
                              style={{ width: `${flag.rollout_percentage || 0}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-on-surface font-semibold mt-3">{flag.rollout_percentage || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div 
                           onClick={() => toggleFlag(flag)}
                           className={`w-10 h-5 flex items-center rounded-full relative cursor-pointer outline-none transition-colors border ${flag.enabled ? 'bg-primary/20 border-primary/30' : 'bg-surface-container-highest border-outline-variant/20'}`}
                         >
                           {flag.enabled ? (
                             <div className="w-3.5 h-3.5 bg-primary rounded-full absolute right-1 top-0.5 shadow-[0_0_8px_#00daf3]"></div>
                           ) : (
                             <div className="w-3.5 h-3.5 bg-tertiary rounded-full absolute left-1 top-0.5"></div>
                           )}
                         </div>
                         <span className={`text-[10px] font-bold uppercase tracking-widest ${flag.enabled ? 'text-primary' : 'text-tertiary'}`}>
                           {flag.enabled ? 'Live' : 'Off'}
                         </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => toggleKillSwitch(flag)}
                          className={`px-3 py-1.5 rounded text-[10px] uppercase font-bold tracking-widest transition-colors ${flag.kill_switch ? 'bg-error text-on-error hover:bg-error/90 shadow-md shadow-error/20' : 'bg-transparent text-error hover:bg-error/10 border border-error/20'}`}
                          title="Toggle Kill Switch"
                        >
                          {flag.kill_switch ? 'DISENGAGE' : 'KILL SWITCH'}
                        </button>
                        <div className="w-[1px] h-4 bg-outline-variant/20 mx-1"></div>
                        <button 
                          onClick={() => navigate(`/edit/${flag.id}`)}
                          className="bg-transparent hover:bg-surface-container p-1.5 rounded transition-all text-tertiary hover:text-primary"
                          title="Edit Flag"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button 
                          onClick={() => deleteFlag(flag.id)}
                          className="bg-transparent hover:bg-error/10 border border-transparent hover:border-error/20 p-1.5 rounded transition-all text-tertiary hover:text-error"
                          title="Delete Flag"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination logic */}
        {filteredFlags.length > ITEMS_PER_PAGE && (
          <div className="border-t border-outline-variant/5 bg-surface-container-low/20 px-6 py-3 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <p className="text-[10px] font-mono text-tertiary">
              Showing <span className="text-on-surface font-semibold">{(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredFlags.length)}</span> of <span className="text-on-surface font-semibold">{filteredFlags.length}</span>
            </p>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="text-xs font-semibold text-tertiary hover:text-on-surface p-1 rounded hover:bg-surface-container flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                if (totalPages > 5 && (pageNum < currentPage - 1 || pageNum > currentPage + 1) && pageNum !== 1 && pageNum !== totalPages) {
                  if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return <span key={idx} className="text-tertiary px-1 text-xs">...</span>;
                  }
                  return null;
                }
                return (
                  <button 
                    key={idx}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-6 h-6 flex items-center justify-center rounded text-[10px] font-mono font-bold transition-all ${
                      currentPage === pageNum 
                        ? 'bg-primary/20 text-primary border border-primary/30' 
                        : 'bg-transparent text-tertiary hover:bg-surface-container hover:text-on-surface border border-transparent'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="text-xs font-semibold text-tertiary hover:text-on-surface p-1 rounded hover:bg-surface-container flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default FeatureFlags;
