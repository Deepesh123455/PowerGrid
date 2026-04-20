import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, ArrowLeftRight, TrendingUp, FileText, Bell, Leaf, CircleUser, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { path: '/p2p', label: 'P2P', icon: ArrowLeftRight },
  { path: '/analytics', label: 'Analytics', icon: TrendingUp },
  { path: '/bills', label: 'Bills', icon: FileText },
  { path: '/alerts', label: 'Alerts', icon: Bell },
  { path: '/save', label: 'Save', icon: Leaf },
  { path: '/profile', label: 'Profile', icon: CircleUser },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Premium Desktop Navbar */}
      <nav className="hidden md:block sticky top-0 z-50 w-full bg-[#111111]/80 backdrop-blur-xl border-b border-white/5 h-[64px] shadow-[0_1px_0_rgba(255,255,255,0.05)]">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between h-full px-8">
          <div className="flex items-center gap-12 h-full">
            <div className="text-white font-black italic tracking-tighter text-xl mr-4 select-none">
              Powergrid<span className="text-[#52ded1]">.</span>
            </div>
            
            <div className="flex items-center gap-1 h-full">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-2.5 px-5 h-full transition-all duration-300 ${
                      isActive ? 'text-[#52ded1]' : 'text-slate-400 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon 
                        size={18} 
                        strokeWidth={isActive ? 2.5 : 2} 
                        className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                      />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                        {item.label}
                      </span>
                      
                      {/* Active Indicator Line */}
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#52ded1] to-transparent shadow-[0_0_12px_rgba(82,222,209,0.5)]"></div>
                      )}
                      
                      {/* Hover Highlight */}
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.03] transition-colors -z-10 mx-1 my-2 rounded-lg"></div>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95">
              <CircleUser size={16} />
              Admin
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Hamburger Header */}
      <div className="md:hidden sticky top-0 z-50 w-full bg-[#111111] border-b border-white/5 h-16 flex items-center justify-between px-6 shadow-2xl">
        <div className="text-white font-black italic tracking-tighter text-xl">
          Powergrid<span className="text-[#52ded1]">.</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 text-slate-400 hover:text-white transition-all rounded-xl active:scale-90"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 top-16 z-40 bg-[#0a0a0a]/95 backdrop-blur-2xl overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="flex flex-col p-6 gap-3 pb-24">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2 ml-2">Navigation Control</p>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border ${
                    isActive
                      ? 'bg-white/5 border-[#52ded1]/30 text-[#52ded1] shadow-[0_8px_20px_-8px_rgba(82,222,209,0.3)]'
                      : 'border-transparent text-slate-500 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-2.5 rounded-xl ${isActive ? 'bg-[#52ded1]/10' : 'bg-white/5'}`}>
                      <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span className="text-xs font-black tracking-[0.2em] uppercase">
                      {item.label}
                    </span>
                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#52ded1] shadow-[0_0_8px_rgba(82,222,209,0.8)] animate-pulse"></div>}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
