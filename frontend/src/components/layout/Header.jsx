import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16 bg-[#0b1326]/80 backdrop-blur-xl border-b border-[#2d3449]/30 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold tracking-tighter text-[#00daf3] font-headline">Feature-Flags</span>
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6 font-headline text-sm tracking-tight text-[#b9c8de]">
            <NavLink to="/" className={({ isActive }) => `transition-all duration-200 py-5 ${isActive || location.pathname === '/flags' ? 'text-[#00daf3] font-bold border-b-2 border-[#00daf3]' : 'hover:text-[#00daf3]'}`}>
              Flags
            </NavLink>
            <NavLink to="/evaluator" className={({ isActive }) => `transition-all duration-200 py-5 ${isActive ? 'text-[#00daf3] font-bold border-b-2 border-[#00daf3]' : 'hover:text-[#00daf3]'}`}>
              Evaluator
            </NavLink>
          </nav>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-[#131b2e] px-3 py-1.5 rounded-lg border border-[#2d3449]/30">
          <span className="material-symbols-outlined text-xs text-primary">circle</span>
          <span className="text-xs font-mono font-semibold tracking-wider text-secondary">Production</span>
        </div>
        <button className="bg-gradient-to-br from-error-container to-on-error py-1.5 px-4 rounded-lg text-xs font-bold text-on-error-container hover:opacity-90 transition-all active:scale-95">
          KILL SWITCH
        </button>
      </div>
    </header>
  );
};

export default Header;
