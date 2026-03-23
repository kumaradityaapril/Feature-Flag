import React from 'react';
import { Bell, ChevronDown, User, LogOut } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  // Format pathname to a readable title
  const getPageTitle = (path) => {
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/flags')) return 'Feature Flags';
    if (path.startsWith('/evaluator')) return 'Evaluator';
    if (path.startsWith('/create')) return 'Create Flag';
    if (path.startsWith('/audit')) return 'Audit Logs';
    return 'Dashboard';
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex flex-col justify-center px-8 z-10 sticky top-0">
      <div className="flex items-center justify-between">
        
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
            {getPageTitle(location.pathname)}
          </h1>
          
          {/* Environment Switcher */}
          <div className="hidden md:flex items-center gap-2 pl-6 border-l border-slate-200">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">ENV</span>
            <button className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 px-2 py-1 rounded bg-slate-50 border border-slate-200">
              Production
              <ChevronDown size={14} className="text-slate-400" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="h-8 w-px bg-slate-200 mx-2"></div>
          
          <button className="flex items-center gap-2 text-slate-700 hover:text-slate-900">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 overflow-hidden">
               {/* Placeholder Avatar */}
               <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <LogOut size={18} className="text-slate-400 ml-2" />
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;
