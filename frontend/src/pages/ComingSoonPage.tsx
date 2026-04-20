import { useNavigate } from 'react-router-dom';
import { Rocket, ArrowLeft, Zap, Sparkles, ShieldCheck } from 'lucide-react';

export default function ComingSoonPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-[#030712] text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-400/20 dark:bg-cyan-500/10 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand/20 dark:bg-brand/10 rounded-full blur-[120px] animate-blob stagger-2"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-[150px] animate-blob stagger-4"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl text-center">
        {/* Visual Element */}
        <div className="mb-12 relative flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[40px] bg-gradient-to-br from-brand to-cyan-500 flex items-center justify-center shadow-2xl animate-float">
                <Rocket size={64} className="text-white transform -rotate-12" />
            </div>
            {/* Accents */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center animate-bounce stagger-1">
                <Sparkles size={20} className="text-amber-500" />
            </div>
            <div className="absolute -bottom-2 -left-6 w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center animate-bounce stagger-3">
                <Zap size={24} className="text-cyan-500" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand/20 bg-brand/5 dark:bg-brand/10 backdrop-blur-md mb-4">
            <ShieldCheck size={14} className="text-brand" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand">Next Generation Logic</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-slate-100 leading-none">
            Something <span className="text-brand">Extraordinary</span> is on the way.
          </h1>
          
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-lg font-medium max-w-lg mx-auto italic">
            We're engineering a premium energy experience that redefines efficiency. This module is currently undergoing final calibration.
          </p>

          <div className="pt-12 flex flex-col items-center gap-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="group relative flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back to Command Center
              <div className="absolute inset-0 rounded-2xl bg-brand/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
            </button>

            <div className="flex items-center gap-8 opacity-40">
                <div className="h-[1px] w-12 bg-slate-400"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Powergrid v4.2</span>
                <div className="h-[1px] w-12 bg-slate-400"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
