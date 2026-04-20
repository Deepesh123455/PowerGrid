import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Key, Phone, Repeat2, Fingerprint, ArrowRight, Zap, Globe, Loader2 } from 'lucide-react';
import { useLogin } from '../features/auth/hooks/useLogin';

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('+91-9876543210');
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const handleInitialize = () => {
    if (!phoneNumber) return;
    loginMutation.mutate(phoneNumber, {
      onSuccess: () => {
        navigate('/dashboard');
      },
      onError: (error: any) => {
        console.error('Login failed:', error.response?.data?.message || error.message);
        alert(error.response?.data?.message || 'Login failed. Please check your network.');
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 md:p-12 relative overflow-hidden bg-slate-50/20">
      {/* Premium Ambient Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-brand/5 rounded-full blur-[140px] animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-100/20 rounded-full blur-[160px] animate-blob" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

        {/* Left Side: Premium Branding */}
        <div className="hidden lg:flex flex-col space-y-10 animate-slide-up stagger-1">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-brand/10 border border-brand/20 rounded-2xl flex items-center justify-center shadow-sm group transition-all cursor-pointer">
                <Zap className="text-brand group-hover:scale-110 transition-transform" size={32} fill="currentColor" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.4em] text-brand/60 underline decoration-brand/20 underline-offset-4">Grid Protocol v4.2</span>
            </div>

            <h1 className="text-7xl font-extrabold text-slate-800 tracking-tighter leading-[1.05]">
              Seamless <br />
              <span className="text-brand relative inline-block">
                Energy Flow.
                <div className="absolute bottom-2 left-0 w-full h-4 bg-brand/5 -rotate-1 animate-reveal stagger-4"></div>
              </span>
            </h1>

            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-sm">
              The world&apos;s most advanced decentralized energy management portal.
            </p>
          </div>

          <div className="flex items-center gap-4 animate-slide-up stagger-5">
            <div className="bg-white border border-gray-100 px-6 py-4 rounded-3xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow cursor-default">
              <Globe className="text-brand animate-pulse" size={24} />
              <span className="text-sm font-bold text-slate-500">Live Infrastructure: <span className="text-slate-900">Synchronized</span></span>
            </div>
          </div>
        </div>

        {/* Right Side: High-Fidelity Interface */}
        <div className="flex flex-col space-y-8">

          <div className="lg:hidden animate-slide-up stagger-1 mb-2">
            <div className="flex items-center gap-3 mb-2">
              <Zap size={24} className="text-brand" fill="currentColor" />
              <span className="text-xs font-black uppercase tracking-widest text-brand/80">Powergrid Access</span>
            </div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Login Portal</h1>
          </div>

          <div className="space-y-6">

            {/* P2P Network Card - Subtle Hover Lift */}
            <div className="group bg-white p-5 rounded-[28px] flex items-center justify-between cursor-pointer transition-all hover:bg-white hover:translate-y-[-4px] hover:shadow-[0_12px_44px_-12px_rgba(20,154,134,0.12)] border border-gray-200/60 animate-slide-up stagger-2 overflow-hidden relative">
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:rotate-3 transition-all duration-500 border border-gray-100">
                  <Repeat2 size={24} className="text-brand" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">P2P Network</h3>
                  <p className="text-sm text-slate-400 font-medium tracking-tight">Active energy arbitrage across nodes</p>
                </div>
              </div>
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-brand group-hover:text-white transition-all duration-300 relative z-10 shadow-inner">
                <ChevronRight size={18} />
              </div>
            </div>

            {/* Main Auth Module - LIQUID BORDER EFFECT */}
            <div className="relative group/card animate-slide-up stagger-3">
              {/* Liquid Border Outer Glow Container */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-brand/40 via-emerald-400/20 to-brand/40 rounded-[42px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 blur-[2px] pointer-events-none">
                <div className="absolute inset-0 animate-border-trace bg-[conic-gradient(from_0deg,transparent,rgba(20,154,134,0.3),transparent)] rounded-[42px]"></div>
              </div>

              <div className="bg-white/90 backdrop-blur-xl rounded-[40px] p-8 md:p-10 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.06)] relative overflow-hidden border border-gray-200/80 hover:border-brand/20 transition-colors">
                <div className="absolute -top-24 -right-24 w-60 h-60 bg-brand/5 rounded-full blur-3xl group-hover/card:scale-110 transition-transform duration-1000"></div>

                <div className="flex justify-between items-center mb-8 relative z-10">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase tracking-wider">Vault Access</h2>
                    <p className="text-[10px] font-black text-brand uppercase tracking-[0.3em] opacity-80">End-to-End Encrypted</p>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                    <Fingerprint size={24} className="text-brand-light" />
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  {/* Phone Input */}
                  <div className="group/input relative flex items-center">
                    <Phone size={18} className="absolute left-6 text-gray-300 group-focus-within/input:text-brand transition-all duration-300" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-slate-50/50 border-2 border-gray-100/50 rounded-[24px] py-4.5 pl-14 pr-6 text-lg font-bold text-slate-700 placeholder-gray-200 focus:outline-none focus:border-brand/20 focus:bg-white focus:shadow-[0_0_30px_rgba(20,154,134,0.08)] transition-all"
                      placeholder="Credential ID"
                    />
                  </div>

                  {/* Password Input (Keeping for Demo Aesthetic) */}
                  <div className="group/input relative flex items-center">
                    <Key size={18} className="absolute left-6 text-gray-300 group-focus-within/input:text-brand transition-all duration-300" />
                    <input
                      type="password"
                      defaultValue="password123"
                      className="w-full bg-slate-50/50 border-2 border-gray-100/50 rounded-[24px] py-4.5 pl-14 pr-6 text-lg font-bold text-slate-700 placeholder-gray-200 focus:outline-none focus:border-brand/20 focus:bg-white focus:shadow-[0_0_30px_rgba(20,154,134,0.08)] transition-all"
                      placeholder="Access Code"
                    />
                  </div>

                  {/* Login Button - SHIMMER EFFECT ACCENT */}
                  <button
                    onClick={handleInitialize}
                    disabled={loginMutation.isPending}
                    className="w-full group/btn relative overflow-hidden bg-[#D4ECEA] hover:bg-[#C5E4E1] text-[#149A86] rounded-[24px] py-5 text-lg font-black tracking-widest transition-all mt-4 shadow-lg shadow-brand/5 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-brand/10 active:translate-y-[1px] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {/* Shimmer Light Streak */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:animate-shimmer pointer-events-none"></div>
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {loginMutation.isPending ? (
                        <>INITIALIZING <Loader2 size={22} className="animate-spin" /></>
                      ) : (
                        <>INITIALIZE <ArrowRight size={22} className="group-hover/btn:translate-x-1 transition-transform" /></>
                      )}
                    </span>
                  </button>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand animate-pulse"></div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Node Cluster Alpha</span>
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 hover:text-brand transition-colors cursor-pointer uppercase tracking-widest">
                    System Recovery
                  </div>
                </div>
              </div>
            </div>



          </div>
        </div>
      </div>
    </div>
  );
}
