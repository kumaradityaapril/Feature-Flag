import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';

const Header = ({ isActive, onToggle }) => {
  const location = useLocation();
  
  const handleKillSwitchClick = () => {
    const action = isActive ? 'DISABLE' : 'ENGAGE';
    const message = isActive 
      ? "Are you sure you want to DISENGAGE the global Kill Switch? All targeted features will return to their normal evaluation logic."
      : "CRITICAL: Are you sure you want to ENGAGE the Selective Global Kill Switch? This will instantly disable ALL features marked as 'Kill-Switchable' globally.";
    
    if (window.confirm(message)) {
      onToggle(!isActive);
    }
  };
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16 bg-[#0b1326]/80 backdrop-blur-xl border-b border-[#2d3449]/30 shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all ${isActive ? 'mt-6' : ''}`}>
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold tracking-tighter text-[#00daf3] font-headline underline-offset-4 decoration-primary/20">Feature-Flags</span>
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
        <button 
          onClick={handleKillSwitchClick}
          className={`py-1.5 px-4 rounded-lg text-xs font-bold transition-all active:scale-95 flex items-center gap-2 ${
            isActive 
              ? 'bg-error text-on-error animate-pulse shadow-[0_0_15px_#ff5449]' 
              : 'bg-gradient-to-br from-error-container to-on-error-container text-on-error hover:opacity-90'
          }`}
        >
          <span className="material-symbols-outlined text-sm">{isActive ? 'shield_notification' : 'shield'}</span>
          {isActive ? 'GLOBAL KILL SWITCH ACTIVE' : 'KILL SWITCH'}
        </button>
      </div>
    </header>
  );
};

export default Header;
