import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import API from '../../api/api';

const Layout = () => {
  const [isGlobalKillSwitchActive, setIsGlobalKillSwitchActive] = React.useState(false);

  const fetchKillSwitchStatus = async () => {
    try {
      const res = await API.get('/settings/kill-switch');
      setIsGlobalKillSwitchActive(res.data.data.enabled);
    } catch (err) {
      console.error('Failed to fetch global kill switch status:', err);
    }
  };

  React.useEffect(() => {
    fetchKillSwitchStatus();
    const interval = setInterval(fetchKillSwitchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleKillSwitch = async (newState) => {
    try {
      await API.post('/settings/kill-switch', { enabled: newState });
      setIsGlobalKillSwitchActive(newState);
    } catch (err) {
      console.error('Failed to toggle global kill switch:', err);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {isGlobalKillSwitchActive && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-error text-on-error py-1 text-center text-[10px] font-bold uppercase tracking-widest animate-pulse shadow-[0_0_20px_rgba(255,84,73,0.5)]">
          🚨 Selective Global Kill Switch Active - Targeted Features Disabled 🚨
        </div>
      )}
      <Header isActive={isGlobalKillSwitchActive} onToggle={handleToggleKillSwitch} />
      <Sidebar />
      <main className={`lg:pl-64 min-h-screen transition-all ${isGlobalKillSwitchActive ? 'pt-20' : 'pt-16'}`}>
        <div className="max-w-[1400px] mx-auto p-6 md:p-8 space-y-8">
          <Outlet />
        </div>
      </main>
      
      {/* Mobile Navigation (visible only on small screens) */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0b1326]/90 backdrop-blur-xl border-t border-[#2d3449]/30 flex md:hidden items-center justify-around z-50">
        <button className="flex flex-col items-center gap-1 text-[#00daf3]">
          <span className="material-symbols-outlined">flag</span>
          <span className="text-[10px] font-bold">Flags</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#b9c8de]">
          <span className="material-symbols-outlined">layers</span>
          <span className="text-[10px] font-bold">Envs</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#b9c8de]">
          <span className="material-symbols-outlined">analytics</span>
          <span className="text-[10px] font-bold">Metrics</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#b9c8de]">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] font-bold">Settings</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
