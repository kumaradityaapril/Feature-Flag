import React from 'react';
import { ChevronDown } from 'lucide-react';
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
        </div>

        <div className="flex items-center gap-4">
          {/* Auth features pending */}
        </div>

      </div>
    </header>
  );
};

export default Header;
