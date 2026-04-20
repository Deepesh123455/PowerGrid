import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { AlertCircle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

export default function RootErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage = 'An unexpected system failure has occurred.';
  let errorStatus = '500';
  let errorTitle = 'System Interruption';

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status.toString();
    errorTitle = error.statusText || 'Navigation Error';
    if (error.status === 404) {
      errorMessage = "The requested node could not be located in the grid.";
    } else {
      errorMessage = error.data?.message || errorMessage;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-xl w-full relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl text-center space-y-8">

          {/* Error Icon Module */}
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center border border-red-500/20 mx-auto group">
              <ShieldAlert className="text-red-500 group-hover:scale-110 transition-transform duration-500" size={48} />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold animate-bounce">
              !
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-red-500 font-mono text-sm tracking-[0.3em] font-black uppercase">
                Status Error {errorStatus}
              </span>
              <h1 className="text-4xl font-black text-white tracking-tight leading-tight">
                {errorTitle}
              </h1>
            </div>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-sm mx-auto">
              {errorMessage}
            </p>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <button
              onClick={handleRetry}
              className="flex items-center justify-center gap-3 bg-white text-slate-950 rounded-[24px] py-4 px-6 font-bold hover:bg-slate-200 transition-all hover:translate-y-[-2px] active:translate-y-0"
            >
              <RefreshCw size={20} />
              Re-initialize
            </button>
            <button
              onClick={handleGoHome}
              className="flex items-center justify-center gap-3 bg-white/5 text-white border border-white/10 rounded-[24px] py-4 px-6 font-bold hover:bg-white/10 transition-all hover:translate-y-[-2px] active:translate-y-0"
            >
              <Home size={20} />
              Protocol Home
            </button>
          </div>

          <div className="pt-8 border-t border-white/5">
            <div className="flex items-center justify-center gap-2 text-slate-500">
              <AlertCircle size={14} />
              <button
                onClick={() => navigate(-1)}
                className="text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
              >
                Return to previous state
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
