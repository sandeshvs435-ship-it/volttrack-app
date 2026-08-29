import { Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Menu, Search, Bell, Zap } from 'lucide-react';
import Sidebar from './Sidebar';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0B0F] flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-[#0A0B0F]/80 backdrop-blur-xl border-b border-white/5 px-4 lg:px-8 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search vehicles, alerts, contracts..."
              className="w-full bg-[#13151C] border border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#3B82F6]/30 transition-colors"
            />
          </div>
          <button
            onClick={() => navigate('/alerts')}
            className="relative w-10 h-10 rounded-xl bg-[#13151C] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </button>
        </header>
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <Outlet />
          <footer className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#3B82F6]" fill="#3B82F6" />
              <span>VoltTrack Technologies</span>
              <span className="text-gray-700">·</span>
              <span>© 2026 All rights reserved</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
              <a href="mailto:contact@volttrack.in" className="hover:text-gray-400 transition-colors">contact@volttrack.in</a>
              <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" className="hover:text-gray-400 transition-colors">+91 99999 99999</a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
