import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'dashboard' },
    { name: 'Flags', path: '/flags', icon: 'flag' },
    { name: 'Evaluator', path: '/evaluator', icon: 'terminal' },
    { name: 'Environments', path: '/environments', icon: 'layers' },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 flex-col py-6 bg-[#131b2e] border-r border-[#2d3449]/20 overflow-y-auto hidden lg:flex">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#2d3449] flex items-center justify-center border border-primary/20">
            <span className="material-symbols-outlined text-primary">terminal</span>
          </div>
          <div>
            <h3 className="text-on-surface font-bold text-sm">Active Project</h3>
            <p className="text-[10px] text-tertiary uppercase tracking-widest font-semibold">V1.0.0</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                isActive && item.path !== '#' 
                  ? 'bg-gradient-to-r from-[#00daf3]/10 to-transparent text-[#00daf3] border-r-2 border-[#00daf3]' 
                  : 'text-[#b9c8de] hover:bg-[#2d3449]/30'
              }`
            }
          >
            <span className="material-symbols-outlined text-lg">{item.icon}</span>
            <span className="text-xs uppercase tracking-widest font-semibold font-label">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-4 space-y-1">
        <button 
          onClick={() => navigate('/create')}
          className="w-full mb-4 bg-gradient-to-br from-[#00daf3] to-[#00899a] text-[#00363d] font-bold text-xs py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/10 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          NEW FLAG
        </button>
        <a className="flex items-center gap-3 px-4 py-3 text-[#b9c8de] hover:bg-[#2d3449]/30 transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-lg">menu_book</span>
          <span className="text-xs uppercase tracking-widest font-semibold font-label">Documentation</span>
        </a>
        <a className="flex items-center gap-3 px-4 py-3 text-[#b9c8de] hover:bg-[#2d3449]/30 transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-lg">contact_support</span>
          <span className="text-xs uppercase tracking-widest font-semibold font-label">Support</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
