import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <Sidebar />
      <main className="lg:pl-64 pt-16 min-h-screen">
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
