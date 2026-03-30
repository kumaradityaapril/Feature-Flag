// import React, { useState, useEffect } from 'react';
// import { Download, Filter, Calendar, ChevronDown } from 'lucide-react';
// import API from '../api/api';

// const AuditLogs = () => {
//   const [activeFlags, setActiveFlags] = useState(42);

//   useEffect(() => {
//     API.get('/flags').then(res => {
//       const flags = res.data.data || res.data || [];
//       setActiveFlags(flags.filter(f => f.enabled).length);
//     }).catch(console.error);
//   }, []);

//   const logs = [
//     { time: 'Oct 24, 2023 • 10:22 AM', action: 'CREATE', actionColor: 'bg-green-100 text-green-700', flag: 'dark_mode_v2', env: 'Prod', envColor: 'border-purple-200 text-purple-700 bg-purple-50', user: 'Alex Rivera', role: 'ADMINISTRATOR', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
//     { time: 'Oct 24, 2023 • 10:35 AM', action: 'KILL_SWITCH', actionColor: 'bg-red-500 text-white', flag: 'ai_recommendations', env: 'Staging', envColor: 'border-amber-200 text-amber-700 bg-amber-50', user: 'Sarah Chen', role: 'ADMINISTRATOR', avatar: 'https://i.pravatar.cc/150?u=1' },
//     { time: 'Oct 24, 2023 • 11:10 AM', action: 'UPDATE', actionColor: 'bg-blue-100 text-blue-700', flag: 'checkout_redesign', env: 'Dev', envColor: 'border-slate-200 text-slate-600 bg-slate-100', user: 'Mike Johnson', role: 'ADMINISTRATOR', avatar: 'https://i.pravatar.cc/150?u=2' },
//     { time: 'Oct 24, 2023 • 01:45 PM', action: 'DELETE', actionColor: 'bg-red-100 text-red-700', flag: 'legacy_tracker', env: 'Prod', envColor: 'border-purple-200 text-purple-700 bg-purple-50', user: 'Alex Rivera', role: 'ADMINISTRATOR', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
//     { time: 'Oct 24, 2023 • 03:20 PM', action: 'RESTORE', actionColor: 'bg-amber-100 text-amber-700', flag: 'beta_search_api', env: 'Staging', envColor: 'border-amber-200 text-amber-700 bg-amber-50', user: 'Jordan Lee', role: 'ADMINISTRATOR', avatar: 'https://i.pravatar.cc/150?u=3' },
//     { time: 'Oct 25, 2023 • 09:15 AM', action: 'UPDATE', actionColor: 'bg-blue-100 text-blue-700', flag: 'pricing_tier_c', env: 'Prod', envColor: 'border-purple-200 text-purple-700 bg-purple-50', user: 'Sarah Chen', role: 'ADMINISTRATOR', avatar: 'https://i.pravatar.cc/150?u=1' },
//     { time: 'Oct 25, 2023 • 10:05 AM', action: 'CREATE', actionColor: 'bg-green-100 text-green-700', flag: 'holiday_promo_banner', env: 'Dev', envColor: 'border-slate-200 text-slate-600 bg-slate-100', user: 'Mike Johnson', role: 'ADMINISTRATOR', avatar: 'https://i.pravatar.cc/150?u=2' },
//   ];

//   const exportLogsCSV = () => {
//     const headers = ["Timestamp", "Action", "Flag", "Environment", "User", "Role"];
//     const csvRows = [headers.join(',')];
//     logs.forEach(log => {
//       csvRows.push([`"${log.time}"`, log.action, log.flag, log.env, `"${log.user}"`, log.role].join(','));
//     });
//     const csvContent = "data:text/csv;charset=utf-8," + encodeURI(csvRows.join('\n'));
//     const link = document.createElement("a");
//     link.href = csvContent;
//     link.download = "audit_logs.csv";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-slate-900 mb-1">Audit Logs</h2>
//           <p className="text-slate-500 text-sm">Track and monitor all changes across your feature flag ecosystem for compliance.</p>
//         </div>
//         <button onClick={exportLogsCSV} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2">
//           <Download size={16} /> Export CSV
//         </button>
//       </div>

//       <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
        
//         {/* Filters */}
//         <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
//           <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
//              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 mr-2">
//                <Filter size={16} /> FILTERS:
//              </div>
             
//              <button className="flex items-center justify-between min-w-[140px] px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
//                All Actions <ChevronDown size={16} className="text-slate-400" />
//              </button>
//              <button className="flex items-center justify-between min-w-[140px] px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
//                All Environments <ChevronDown size={16} className="text-slate-400" />
//              </button>
//              <button className="flex items-center justify-between min-w-[140px] px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
//                All Flags <ChevronDown size={16} className="text-slate-400" />
//              </button>
             
//              <div className="hidden md:block w-px h-6 bg-slate-200 mx-1"></div>
             
//              <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
//                <Calendar size={16} className="text-slate-400" /> Last 30 Days
//              </button>
//           </div>
//           <button className="text-sm font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap">
//             Clear all
//           </button>
//         </div>

//         {/* Data Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-sm text-slate-600">
//             <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold border-b border-slate-200 uppercase tracking-widest">
//               <tr>
//                 <th className="px-6 py-4">TIMESTAMP</th>
//                 <th className="px-6 py-4">ACTION</th>
//                 <th className="px-6 py-4">FLAG IDENTIFIER</th>
//                 <th className="px-6 py-4">ENV</th>
//                 <th className="px-6 py-4">PERFORMED BY</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {logs.map((log, i) => (
//                 <tr key={i} className="hover:bg-slate-50/50 transition-colors">
//                   <td className="px-6 py-4">
//                     <span className="font-medium text-slate-700 text-xs">{log.time}</span>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span className={`inline-block px-2.5 py-1 text-[10px] font-bold rounded tracking-wide ${log.actionColor}`}>
//                       {log.action}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-2">
//                        <span className="font-mono text-slate-400 text-xs w-4">{'>_'}</span>
//                        <span className="font-bold text-slate-900">{log.flag}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-sm border ${log.envColor}`}>
//                       {log.env}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center justify-between max-w-[180px]">
//                       <div>
//                         <p className="font-semibold text-slate-900 text-sm">{log.user}</p>
//                         <p className="text-[10px] font-semibold text-slate-400 mt-0.5 tracking-wider">{log.role}</p>
//                       </div>
//                       <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-200 ml-3">
//                         <img src={log.avatar} alt={log.user} className="w-full h-full object-cover" />
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
        
//         {/* Pagination Setup */}
//         <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50">
//           <p className="text-sm text-slate-500">Showing <span className="font-bold text-slate-900">1-10</span> of <span className="font-bold text-slate-900">28</span> results</p>
//           <div className="flex items-center gap-1">
//             <button className="text-sm font-medium text-slate-400 px-3 py-1 flex items-center gap-1 cursor-not-allowed">
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
//               Prev
//             </button>
//             <button className="w-8 h-8 flex items-center justify-center rounded-md bg-blue-600 text-sm font-semibold text-white">1</button>
//             <button className="w-8 h-8 flex items-center justify-center rounded-md bg-transparent text-sm font-medium text-slate-600 hover:bg-white hover:border border-slate-200">2</button>
//             <button className="w-8 h-8 flex items-center justify-center rounded-md bg-transparent text-sm font-medium text-slate-600 hover:bg-white hover:border border-slate-200">3</button>
//             <span className="text-slate-400 px-1">...</span>
//             <button className="text-sm font-medium text-slate-900 px-3 py-1 flex items-center gap-1 hover:bg-white hover:border border-slate-200 border border-transparent rounded-md transition-colors">
//               Next
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
//             </button>
//           </div>
          
//           <div className="hidden md:flex items-center gap-3">
//              <span className="text-sm text-slate-500">Go to:</span>
//              <div className="relative">
//                <input type="text" defaultValue="1" className="w-12 h-8 px-2 pl-3 border border-slate-200 rounded-md text-sm font-medium text-center focus:outline-none focus:ring-1 focus:ring-blue-500" />
//              </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Stats Banner */}
//       <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
//         <div className="flex-1 pb-4 md:pb-0 md:pr-6">
//           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Actions</p>
//           <p className="text-2xl font-bold text-slate-900">1,248</p>
//         </div>
//         <div className="flex-1 py-4 md:py-0 md:px-6">
//           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Critical Events</p>
//           <p className="text-2xl font-bold text-red-500">14</p>
//         </div>
//         <div className="flex-1 py-4 md:py-0 md:px-6">
//           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active Flags</p>
//           <p className="text-2xl font-bold text-slate-900">{activeFlags}</p>
//         </div>
//         <div className="flex-1 pt-4 md:pt-0 md:pl-6 leading-tight">
//           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Audit Stability</p>
//           <p className="text-2xl font-bold text-green-500 flex items-center gap-2">
//             99.9% 
//             <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 tracking-wide uppercase font-bold">Healthy</span>
//           </p>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default AuditLogs;
