import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock3,
  Loader2,
  CheckCheck,
  Zap,
  TrendingDown,
  ShieldAlert
} from 'lucide-react';
import { useState } from 'react';
import { useForecastStore } from '../features/forecast/store/useForecastStore';
import { useAlerts, useMarkAlertAsRead } from '../features/alerts/hooks/useAlerts';
import { format } from 'date-fns';

type FilterType = 'ALL' | 'URGENT' | 'INFO' | 'USAGE';

export default function AlertsPage() {
  const selectedLocationId = useForecastStore((state) => state.selectedLocationId);
  const { data: alertsResponse, isLoading } = useAlerts(selectedLocationId);
  const { mutate: markAsRead } = useMarkAlertAsRead(selectedLocationId);

  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');

  const alerts = alertsResponse?.data?.alerts || [];

  const filteredAlerts = alerts.filter(alert => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'URGENT') return alert.severity === 'URGENT';
    if (activeFilter === 'INFO') return alert.severity === 'INFO' || alert.severity === 'URGENT';
    if (activeFilter === 'USAGE') return alert.category === 'USAGE' || alert.category === 'BILLING';
    return true;
  });

  const unreadCount = alerts.filter(a => !a.isRead).length;

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'URGENT':
      case 'CRITICAL':
        return {
          icon: ShieldAlert,
          bg: 'bg-rose-50',
          text: 'text-rose-600',
          border: 'border-rose-100',
          glow: 'shadow-[0_0_15px_-5px_rgba(225,29,72,0.3)]'
        };
      case 'WARNING':
        return {
          icon: AlertTriangle,
          bg: 'bg-amber-50',
          text: 'text-amber-600',
          border: 'border-amber-100',
          glow: 'shadow-[0_0_15px_-5px_rgba(217,119,6,0.3)]'
        };
      default:
        return {
          icon: Info,
          bg: 'bg-cyan-50',
          text: 'text-cyan-600',
          border: 'border-cyan-100',
          glow: 'shadow-[0_0_15px_-5px_rgba(8,145,178,0.3)]'
        };
    }
  };

  const categories = [
    { id: 'ALL', label: 'All Alerts', icon: Bell },
    { id: 'URGENT', label: 'Urgent', icon: ShieldAlert },
    { id: 'USAGE', label: 'Usage', icon: Zap },
    { id: 'INFO', label: 'Insights', icon: TrendingDown },
  ];

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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900">
                System <span className="text-cyan-600">Alerts</span>
              </h1>
              {unreadCount > 0 && (
                <span className="px-3 py-1 bg-cyan-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-cyan-600/30">
                  {unreadCount} New
                </span>
              )}
            </div>
            <p className="text-slate-600 text-xs md:text-sm font-medium italic">Notifications & grid status updates</p>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-5 py-3 bg-white/70 border border-slate-200 rounded-2xl text-slate-600 text-[10px] font-black uppercase tracking-widest hover:border-cyan-400/30 transition-all shadow-sm">
              <CheckCheck size={14} className="text-cyan-600" />
              Mark all as read
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id as FilterType)}
              className={`flex-shrink-0 flex items-center gap-2.5 px-5 py-3 rounded-2xl border transition-all duration-300 ${activeFilter === cat.id
                ? 'bg-gradient-to-br from-cyan-600/10 to-cyan-500/5 border-cyan-600/50 text-slate-900 shadow-[0_8px_20px_-8px_rgba(34,211,238,0.2)]'
                : 'bg-white/70 border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-white'
                }`}
            >
              <cat.icon size={14} className={activeFilter === cat.id ? 'text-cyan-600' : 'text-slate-400'} />
              <span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-cyan-600" size={32} />
              <p className="text-slate-500 text-sm font-medium italic">Synchronizing with node...</p>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="bg-white/70 border border-slate-200/50 rounded-[32px] p-12 text-center">
              <CheckCircle2 className="mx-auto text-emerald-500 mb-4 opacity-40" size={48} />
              <h3 className="text-slate-900 font-bold mb-2">Clear Skies</h3>
              <p className="text-slate-500 text-sm italic">No alerts matching your current filter.</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const styles = getSeverityStyles(alert.severity);
              return (
                <div
                  key={alert.alertId}
                  onClick={() => !alert.isRead && markAsRead(alert.alertId)}
                  className={`group relative overflow-hidden bg-white/70 border border-slate-200/50 rounded-3xl p-5 md:p-6 transition-all duration-500 hover:border-cyan-400/30 shadow-sm hover:shadow-md ${!alert.isRead ? 'cursor-pointer ring-1 ring-cyan-600/5' : 'opacity-80 grayscale-[0.5]'}`}
                >
                  <div className="flex items-start gap-5 relative z-10">
                    <div className={`mt-1 p-3 rounded-2xl ${styles.bg} ${styles.text} ${styles.border} ${styles.glow} transition-transform group-hover:scale-110`}>
                      <styles.icon size={22} strokeWidth={2.5} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h3 className={`text-base font-black tracking-tight ${!alert.isRead ? 'text-slate-900' : 'text-slate-600'}`}>
                            {alert.title}
                          </h3>
                          <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border ${styles.border} ${styles.text}`}>
                            {alert.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold">
                          <Clock3 size={12} />
                          <span>{format(new Date(alert.timestamp), 'MMM d, h:mm a')}</span>
                        </div>
                      </div>

                      <p className={`text-sm leading-relaxed mb-4 ${!alert.isRead ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                        {alert.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {!alert.isRead && (
                            <button
                              onClick={(e) => { e.stopPropagation(); markAsRead(alert.alertId); }}
                              className="text-cyan-600 text-[10px] font-black uppercase tracking-widest hover:underline"
                            >
                              Mark as Read
                            </button>
                          )}
                          <button className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-900 transition-colors">
                            Details
                          </button>
                        </div>
                        {!alert.isRead && (
                          <div className="w-2 h-2 bg-cyan-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(8,145,178,0.8)]"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="mt-16 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.4em] font-black opacity-30">
            Powergrid v4.2 · Secure Broadcast
          </p>
        </div>
      </div>
    </div>
  );
}
