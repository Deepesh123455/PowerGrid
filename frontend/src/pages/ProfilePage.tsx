import { useNavigate } from 'react-router-dom';
import {
  User, ChevronRight, ArrowLeftRight, Home, Tag, Car,
  Bell, Sparkles, Moon, Sun, TrendingUp
} from 'lucide-react';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import { useAppStore } from '../store/useAppStore';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useAppStore();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 text-slate-900 pb-32 px-4 md:px-6">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-200/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl animate-blob stagger-2"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-slate-100/30 rounded-full blur-3xl animate-blob stagger-4"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto pt-8 md:pt-12">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 flex items-center gap-2 md:gap-3">
              User <span className="text-cyan-600">Profile</span>
            </h1>
            <p className="text-slate-600 text-xs md:text-sm mt-1 md:mt-2 font-medium italic">Manage account & households</p>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => navigate('/alerts')}
              className="w-10 h-10 md:w-12 md:h-12 bg-white/70 border border-slate-200 shadow-sm rounded-2xl flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:border-cyan-400/30 transition-all"
            >
              <Bell size={18} className="md:w-5 md:h-5" />
            </button>
            <button 
              onClick={toggleTheme}
              className={`w-10 h-10 md:w-12 md:h-12 border shadow-sm rounded-2xl flex items-center justify-center transition-all ${
                theme === 'dark' 
                  ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' 
                  : 'bg-white/70 border-slate-200 text-amber-500 hover:bg-amber-50'
              }`}
            >
              {theme === 'dark' ? <Moon size={18} className="md:w-5 md:h-5" /> : <Sun size={18} className="md:w-5 md:h-5" />}
            </button>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/70 border border-slate-200 shadow-sm rounded-2xl flex items-center justify-center text-cyan-600">
              <User size={18} className="md:w-5 md:h-5" />
            </div>
          </div>
        </div>



        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">

          {/* Account Card */}
          <div className="space-y-8 md:space-y-12">
            <section className="group relative overflow-hidden bg-white/70 border border-slate-200/50 rounded-[32px] p-6 md:p-10 transition-all duration-500 hover:border-cyan-400/30 shadow-sm hover:shadow-md">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-300/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-cyan-300/20 transition-colors"></div>
              <div className="relative z-10">
                <h2 className="text-slate-900 text-lg font-black uppercase tracking-tight mb-6 flex items-center gap-2">
                  <User size={18} className="text-cyan-600" />
                  Account Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Full Name</p>
                    <p className="text-base font-bold text-slate-900">{user?.name || 'Power User'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Contact Number</p>
                    <p className="text-base font-bold text-slate-900 font-mono tracking-wider">9876543210</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Tools & Actions Card */}
          <div className="space-y-8 md:space-y-12">
            <section className="group relative overflow-hidden bg-white/70 border border-slate-200/50 rounded-[32px] p-6 md:p-10 transition-all duration-500 hover:border-cyan-400/30 shadow-sm hover:shadow-md h-full">
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-purple-300/10 rounded-full blur-3xl group-hover:bg-purple-300/20 transition-colors"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-slate-900 text-lg font-black uppercase tracking-tight flex items-center gap-2">
                    <Sparkles size={18} className="text-purple-600" />
                    Optimization Tools
                  </h2>
                </div>

                <div className="space-y-2">
                  {[
                    { icon: ArrowLeftRight, label: 'P2P Energy Trading', color: 'text-cyan-600', bg: 'bg-cyan-50', path: '/p2p' },
                    { icon: Home, label: 'Manage Locations', color: 'text-emerald-600', bg: 'bg-emerald-50', path: '/dashboard' },
                    { icon: Tag, label: 'Tariff & Plan Guidance', color: 'text-amber-600', bg: 'bg-amber-50', path: '/save' },
                    { icon: Car, label: 'EV + Storage Insights', color: 'text-indigo-600', bg: 'bg-indigo-50', path: '/sessions' },
                    { icon: TrendingUp, label: 'Advanced Analytics', color: 'text-purple-600', bg: 'bg-purple-50', path: '/analytics' }
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={() => navigate(item.path)}
                      className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all group/item"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl ${item.bg} ${item.color} group-hover/item:scale-110 transition-transform`}>
                          <item.icon size={18} strokeWidth={2.5} />
                        </div>
                        <span className="text-sm font-bold text-slate-700">{item.label}</span>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover/item:text-slate-900 translate-x-0 group-hover/item:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Support Section Refinement */}
            <section className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-slate-200/60 rounded-[32px] p-6 md:p-8 flex items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                  <Bell size={24} />
                </div>
                <div>
                  <h4 className="text-slate-900 text-sm font-black uppercase tracking-widest mb-1">Need Assistance?</h4>
                  <p className="text-slate-600 text-xs font-medium italic">Our support team is active 24/7</p>
                </div>
              </div>
              <button className="px-6 py-3 bg-slate-900/5 hover:bg-slate-900/10 rounded-xl text-slate-900 text-[10px] font-black uppercase tracking-widest transition-all">
                Help
              </button>
            </section>
          </div>

        </div>

        <div className="text-[9px] text-slate-400 text-center tracking-[0.4em] uppercase font-black opacity-30 pt-16">
          Powergrid v4.2 · Account Portal
        </div>
      </div>
    </div>
  );
}
