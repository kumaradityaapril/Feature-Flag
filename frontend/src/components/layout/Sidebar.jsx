import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Flag, Terminal, PlusCircle, FileText, Settings, Activity } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Feature Flags', path: '/flags', icon: Flag },
    { name: 'Evaluator', path: '/evaluator', icon: Terminal },
    { name: 'Create Flag', path: '/create', icon: PlusCircle },
    { name: 'Export Data', path: '/export', icon: FileText },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold">
            <Flag size={18} />
          </div>
          <span className="font-bold text-slate-900 text-lg">Feature Flag</span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-slate-100 text-slate-900' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <Icon size={18} className="text-slate-400" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-slate-100">
        {/* Placeholder for future bottom nav items */}
      </div>
    </aside>
  );
};

export default Sidebar;
