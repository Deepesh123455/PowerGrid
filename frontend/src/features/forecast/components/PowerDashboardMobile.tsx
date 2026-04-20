import { Bell, ChevronRight, Clock3, Home, Gauge, Sparkles, Zap, Calendar, TrendingUp, BarChart3, Cloud, Droplets, Sun, CloudRain, Snowflake, CloudLightning, Loader2, FileText, Lightbulb, Car, AlertTriangle, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/useAppStore';
import type { ForecastData } from '../types/forecast.types';
import type { ActiveAppliance } from '../../active-appliances/types/activeAppliance.types';
import { useWeather } from '../hooks/useWeather';
import { useUnreadAlertsCount } from '../../alerts/hooks/useAlerts';

interface PowerDashboardMobileProps {
  forecast: ForecastData;
  locationId: string;
  userName?: string;
  appliances: ActiveAppliance[];
  selectedApplianceId: string | null;
  onSelectAppliance: (applianceId: string) => void;
  onLocationChange?: (locationId: string) => void;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number) {
  return `${Math.abs(value).toFixed(1)}%`;
}

function formatStartTime(value: string | undefined) {
  if (!value) return 'N/A';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';

  return date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

const generateDemoData = (period: 'day' | 'week' | 'month') => {
  const count = period === 'day' ? 24 : period === 'week' ? 7 : 30;
  // Use fixed heights to ensure visibility
  return Array.from({ length: count }, (_, i) => {
    return 50 + (i % 3) * 15; // Alternating heights: 50, 65, 80, 50, 65, 80...
  });
};

export function PowerDashboardMobile({
  forecast,
  locationId,
  appliances,
  selectedApplianceId,
  onSelectAppliance,
  onLocationChange,
}: PowerDashboardMobileProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useAppStore();
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [lastSync, setLastSync] = useState(new Date());
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const { data: unreadData } = useUnreadAlertsCount(locationId);

  const availableLocations = [
    { id: 'DL-BDP-100234567', name: 'Home', meter: 'MH-MUM-000112233' },
    { id: 'DL-BDP-200345678', name: 'Farmhouse', meter: 'HR-GGN-000556677' },
    { id: 'DL-BDP-300456789', name: 'Office', meter: 'MH-MUM-000998877' },
    { id: 'DL-BDP-400567890', name: 'Shop', meter: 'DL-NZB-000334455' }
  ];


  const { data: weatherData, isLoading: isWeatherLoading, error: weatherError } = useWeather('Delhi');

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear': return <Sun size={24} className="text-sky-500" />;
      case 'clouds': return <Cloud size={24} className="text-slate-500" />;
      case 'rain':
      case 'drizzle': return <CloudRain size={24} className="text-blue-500" />;
      case 'thunderstorm': return <CloudLightning size={24} className="text-purple-500" />;
      case 'snow': return <Snowflake size={24} className="text-sky-300" />;
      default: return <Cloud size={24} className="text-slate-400" />;
    }
  };

  // Update last sync time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSync(new Date());
    }, 60000); // Update every 60 seconds

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to top smoothly when modal opens
  useEffect(() => {
    if (isLocationModalOpen) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isLocationModalOpen]);

  const selectedAppliance = appliances.find((appliance) => appliance.applianceId === selectedApplianceId) ?? appliances[0] ?? null;

  // Temporarily disable API integration to show demo data
  // const intervalTypeMap: Record<'day' | 'week' | 'month', 'daily' | 'weekly' | 'monthly'> = {
  //   day: 'daily',
  //   week: 'weekly',
  //   month: 'monthly',
  // };
  // const intervalType = intervalTypeMap[selectedPeriod];
  // const loadGraphQuery = useLoadGraphSync(locationId, intervalType);
  const loadGraphQuery = { loadGraphs: [] as any[] };

  const trendLabel = forecast.vsLastMonth >= 0 ? 'up' : 'down';
  const isEV = selectedAppliance?.type === 'EV';
  const statusWord = isEV ? 'Charging' : 'Running';
  const currentKw = selectedAppliance?.currentDrawKw ?? 0;
  const capacityKw = 52;
  const progress = Math.min((currentKw / capacityKw) * 100, 100);
  const statusLabel = `${currentKw.toFixed(1)} kW`;

  const barWidthClass = selectedPeriod === 'week' ? 'w-[28px] md:w-[40px] lg:w-[48px]' : selectedPeriod === 'month' ? 'w-[4px] md:w-[6px]' : 'w-[6px] md:w-[8px]';
  const barRoundedClass = selectedPeriod === 'week' ? 'rounded-t-[4px]' : 'rounded-t-full';

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header Section */}
      <div className="flex items-center justify-between px-0 md:px-1">
        <div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 flex items-center gap-2 md:gap-3">
            Your <span className="text-cyan-600">Dashboard</span>
          </h1>
          <p className="text-slate-600 text-xs md:text-sm mt-1 md:mt-2 font-medium italic">Monitor consumption & energy forecast</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => navigate('/alerts')}
            className="w-10 h-10 md:w-12 md:h-12 bg-white/70 border border-slate-200 shadow-sm rounded-2xl flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:border-cyan-400/30 transition-all relative"
          >
            <Bell size={18} className="md:w-5 md:h-5" />
            {unreadData?.data?.unreadCount !== undefined && unreadData.data.unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadData.data.unreadCount}
              </span>
            )}
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
        </div>
      </div>

      {/* Location Selector */}
      <div>
        <div className="flex items-center gap-2 mb-3 md:mb-4 px-0 md:px-1">
          <Home size={14} className="text-cyan-600" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Service Location</span>
        </div>
        <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-3 scrollbar-none">
          {availableLocations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => onLocationChange?.(loc.id)}
              className={`flex-shrink-0 md:flex-shrink px-4 md:px-5 py-3 md:py-4 rounded-2xl border transition-all duration-300 flex flex-col items-start gap-1 ${locationId === loc.id
                  ? 'bg-gradient-to-br from-cyan-600/10 to-cyan-500/5 border-cyan-600/50 text-slate-900 shadow-[0_8px_20px_-8px_rgba(34,211,238,0.2)]'
                  : 'bg-white/70 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-white'
                }`}
            >
              <span className="text-xs font-black tracking-widest uppercase">{loc.name}</span>
              <span className="text-[10px] opacity-60 font-medium truncate max-w-[120px] md:max-w-full">{loc.id}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-12 md:space-y-20">

        {/* Bill Forecast Section */}
        <section className="group relative overflow-hidden bg-white/70 border border-slate-200/50 rounded-[32px] p-6 md:p-10 transition-all duration-500 hover:border-cyan-400/30 shadow-sm hover:shadow-md">
          <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-300/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-cyan-300/20 transition-colors"></div>

          <div className="flex items-center justify-between relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Financial Forecast</p>
            <div className="p-1.5 bg-brand/10 rounded-lg border border-brand/20">
              <Zap size={14} className="text-brand shadow-[0_0_8px_rgba(20,154,134,0.4)]" />
            </div>
          </div>

          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-1.5">
                {formatCurrency(forecast.billForecast)}
              </p>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Projected billing period</p>
            </div>
            <div className="text-right flex flex-col items-end gap-2">
              <div className="px-3 py-1.5 rounded-xl border border-white bg-white/60 backdrop-blur-md shadow-sm ring-1 ring-slate-100/50">
                <span className="text-[10px] font-black text-slate-700">Confidence {forecast.aiConfidenceScore.toFixed(0)}%</span>
              </div>
              <p className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${forecast.vsLastMonth >= 0 ? 'text-amber-600' : 'text-brand'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                {formatPercent(forecast.vsLastMonth)} {trendLabel} vs last month
              </p>
            </div>
          </div>
        </section>

        {/* Daily/Week/Month Tabs Section */}
        <section className="group relative overflow-hidden bg-white/70 border border-slate-200/50 rounded-[32px] p-6 md:p-10 transition-all duration-500 hover:border-cyan-400/30 shadow-sm hover:shadow-md">
          <div className="absolute -top-8 -left-8 w-20 h-20 bg-gradient-to-br from-brand/10 to-teal-500/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>

          {/* Tab Navigation */}
          <div className="flex items-center justify-between relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Consumption Analytics</p>
            <div className="p-1.5 bg-amber-50 rounded-lg border border-amber-200">
              <BarChart3 size={14} className="text-amber-600 shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
            </div>
          </div>

          {/* Period Tabs */}
          <div className="relative z-10">
            <div className="flex gap-1.5 p-1 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
              {(['day', 'week', 'month'] as const).map((period) => {
                const isSelected = selectedPeriod === period;
                const icons = { day: Calendar, week: TrendingUp, month: BarChart3 };
                const Icon = icons[period];

                return (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`
                    relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                    font-black text-[10px] uppercase tracking-[0.15em] transition-all duration-300
                    ${isSelected
                        ? 'bg-white text-brand shadow-[0_4px_12px_-4px_rgba(20,154,134,0.25)] border border-brand/20 scale-105'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                      }
                    group
                  `}
                  >
                    <Icon
                      size={12}
                      className={`transition-all duration-300 ${isSelected ? 'text-brand animate-pulse' : 'group-hover:scale-110'}`}
                    />
                    <span className="relative z-10">{period}</span>
                    {isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-r from-brand/5 to-teal-500/5 rounded-xl animate-shimmer"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>


        </section>

        {/* Current Load Section */}
        <section className="group relative overflow-hidden bg-white/70 border border-slate-200/50 rounded-[32px] p-6 md:p-10 transition-all duration-500 hover:border-cyan-400/30 shadow-sm hover:shadow-md">

          {/* Rearranged Heading + Badge to avoid overlap */}
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-start">
              <h2 className="text-3xl font-black leading-tight text-slate-900 tracking-tighter">
                Energy<br />Load.
              </h2>
              <div className="flex gap-2">
                <Link
                  to="/sessions"
                  className="shrink-0 text-[9px] px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 font-black uppercase tracking-[0.15em] flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors ring-1 ring-slate-100 cursor-pointer z-20"
                >
                  <Calendar size={12} className="shrink-0" />
                  View Sessions
                </Link>
                <div className="shrink-0 animate-glow-breath">
                  <div className="text-[9px] px-3.5 py-1.5 rounded-full border border-teal-200 bg-teal-50/80 text-teal-800 font-black uppercase tracking-[0.15em] flex items-center gap-2 shadow-sm backdrop-blur-sm ring-1 ring-teal-300/30">
                    <Gauge size={12} className="shrink-0" />
                    {statusWord} now
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-brand font-black text-[10px] uppercase tracking-widest pl-0.5">
              <div className="w-4 h-[1px] bg-brand/30"></div>
              Active Draw: {statusLabel}
            </div>
          </div>

          {/* Circular Meter + Progress */}
          <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
            <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full border-[6px] border-slate-50 flex flex-col items-center justify-center shadow-[inset_0_4px_12px_rgba(0,0,0,0.05),0_10px_20px_-5px_rgba(0,0,0,0.05)] relative bg-white animate-float">
              <div className="absolute inset-1 rounded-full border border-slate-100 opacity-40"></div>
              <p className="text-3xl lg:text-4xl font-black text-slate-800 tracking-tighter leading-none">{currentKw.toFixed(1)}</p>
              <p className="text-[9px] lg:text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mt-1.5">kW</p>
            </div>
            <div className="flex-1 space-y-4 w-full">
              <div className="h-2.5 lg:h-3 rounded-full bg-slate-100 overflow-hidden shadow-inner ring-1 ring-slate-200/5">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${progress < 40
                    ? 'bg-gradient-to-r from-green-400 to-green-500'
                    : 'bg-gradient-to-r from-amber-400 to-amber-500'
                    }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-baseline justify-between pl-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{capacityKw} kW Max</p>
                <p className="text-[9px] font-black text-amber-600 uppercase">{progress.toFixed(0)}% Use</p>
              </div>
            </div>
          </div>

          {/* Appliance Selector Styling */}
          <div className="space-y-2.5 relative z-10">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Grid Controller</label>
            <div className="relative group/select">
              <select
                value={selectedAppliance?.applianceId ?? ''}
                onChange={(event) => onSelectAppliance(event.target.value)}
                className="w-full rounded-[22px] border border-slate-200/60 bg-white px-5 py-4 text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-teal-100 focus:border-brand transition-all appearance-none cursor-pointer shadow-[0_4px_12px_-4px_rgba(0,0,0,0.04)] ring-1 ring-slate-50 hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)]"
              >
                {appliances.map((appliance) => (
                  <option key={appliance.applianceId} value={appliance.applianceId}>
                    {appliance.name} - {appliance.currentDrawKw.toFixed(1)} kW
                  </option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                <ChevronRight size={16} className="rotate-90" />
              </div>
            </div>
          </div>

          {/* Source Switcher - Premium Pills */}
          <div className="flex items-center gap-4 relative z-10">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 shrink-0 italic">Source</span>
            <div className="flex gap-2.5 w-full">
              <span className="text-[9px] font-black px-4 py-2 border border-slate-100 rounded-2xl text-slate-500 bg-white shadow-sm ring-1 ring-slate-50 cursor-default hover:bg-slate-50 transition-colors uppercase tracking-widest">Utility</span>
              <span className="text-[9px] font-black px-4 py-2 border border-slate-100 rounded-2xl text-slate-500 bg-white shadow-sm ring-1 ring-slate-50 cursor-default hover:bg-slate-50 transition-colors uppercase tracking-widest">Battery</span>
              <span className="text-[9px] font-black px-4 py-2 border border-teal-200 rounded-2xl text-teal-700 bg-teal-50 shadow-[0_0_15px_-5px_rgba(20,154,134,0.3)] ring-1 ring-teal-400/20 cursor-default uppercase tracking-widest">Genset</span>
            </div>
          </div>

          {/* Improved Data Graph Legend */}
          <div className="rounded-3xl border border-slate-200/40 bg-white p-5 relative z-10 overflow-hidden ring-1 ring-slate-100/50">
            <div className="h-32 flex items-end justify-between px-2">
              {loadGraphQuery.loadGraphs.length > 0 ? (
                loadGraphQuery.loadGraphs.map((graph, index) => {
                  const maxLoad = Math.max(...loadGraphQuery.loadGraphs.map(g => g.totalLoad), 1);
                  const totalHeightPct = (graph.totalLoad / maxLoad) * 96;
                  const weatherPct = (graph.weatherSensitiveLoad / graph.totalLoad) * 100 || 0;
                  const timePct = (graph.timeSensitiveLoad / graph.totalLoad) * 100 || 0;
                  const normalPct = (graph.normalLoad / graph.totalLoad) * 100 || 0;

                  return (
                    <div key={`${graph.timestamp}-${index}`} className={`flex flex-col ${barWidthClass} ${barRoundedClass} overflow-hidden group/bar hover:scale-y-110 origin-bottom transition-transform duration-300 gap-0`} style={{ height: `${Math.max(totalHeightPct, 4)}%` }}>
                      <div className="w-full bg-[#22a2e8] transition-opacity" style={{ height: `${weatherPct}%` }} />
                      <div className="w-full bg-[#e37e25] transition-opacity" style={{ height: `${timePct}%` }} />
                      <div className="w-full bg-[#52ded1] transition-all" style={{ height: `${normalPct}%` }} />
                    </div>
                  );
                })
              ) : (
                // Fallback to dynamic demo data based on selected period
                generateDemoData(selectedPeriod).map((height, index) => {
                  const normalPct = 40 + (index % 5) * 5;
                  const timePct = 20 + (index % 3) * 5;
                  const weatherPct = 100 - normalPct - timePct;

                  return (
                    <div key={`${height}-${index}`} className={`flex flex-col ${barWidthClass} ${barRoundedClass} overflow-hidden group/bar hover:scale-y-110 origin-bottom transition-transform duration-300 gap-0`} style={{ height: `${height}px` }}>
                      <div className="w-full bg-[#22a2e8] transition-opacity" style={{ height: `${weatherPct}%` }} />
                      <div className="w-full bg-[#e37e25] transition-opacity" style={{ height: `${timePct}%` }} />
                      <div className="w-full bg-[#52ded1] transition-all" style={{ height: `${normalPct}%` }} />
                    </div>
                  );
                })
              )}
            </div>
            <div className="mt-5 flex justify-center gap-6 border-t border-slate-200/20 pt-4">
              <div className="flex items-center gap-2 text-[10px] md:text-xs font-medium text-slate-600">
                <div className="w-3 h-3 rounded-[3px] bg-[#22a2e8]"></div> Weather-sensitive
              </div>
              <div className="flex items-center gap-2 text-[10px] md:text-xs font-medium text-slate-600">
                <div className="w-3 h-3 rounded-[3px] bg-[#e37e25]"></div> Time-sensitive
              </div>
              <div className="flex items-center gap-2 text-[10px] md:text-xs font-medium text-slate-600">
                <div className="w-3 h-3 rounded-[3px] bg-[#52ded1]"></div> Normal
              </div>
            </div>
          </div>

          <div className="text-[10px] font-black text-slate-400 flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Clock3 size={12} className="text-slate-200" />
              <span className="uppercase tracking-widest opacity-60">Last Sync</span>
            </div>
            <span className="uppercase tracking-widest opacity-80">{lastSync.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
          </div>

          <div className="rounded-2xl border border-slate-200/40 bg-slate-50/30 p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                {selectedPeriod === 'day' ? 'Today\'s Summary' : selectedPeriod === 'week' ? 'Weekly Summary' : 'Monthly Summary'}
              </span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                {selectedPeriod === 'day' ? '24h' : selectedPeriod === 'week' ? '7d' : '30d'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Weather</p>
                <p className="text-lg font-black text-sky-600 leading-none">
                  {selectedPeriod === 'day' ? '12.4' : selectedPeriod === 'week' ? '87.2' : '348.5'}
                  <span className="text-[10px] font-bold text-slate-400 ml-0.5">kWh</span>
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Pattern</p>
                <p className="text-lg font-black text-amber-600 leading-none">
                  {selectedPeriod === 'day' ? '8.7' : selectedPeriod === 'week' ? '61.1' : '244.3'}
                  <span className="text-[10px] font-bold text-slate-400 ml-0.5">kWh</span>
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Normal</p>
                <p className="text-lg font-black text-teal-600 leading-none">
                  {selectedPeriod === 'day' ? '15.2' : selectedPeriod === 'week' ? '106.4' : '425.8'}
                  <span className="text-[10px] font-bold text-slate-400 ml-0.5">kWh</span>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/40">
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Efficiency</p>
                <p className="text-lg font-black text-slate-700 leading-none">
                  82<span className="text-[10px] font-bold text-slate-400 ml-0.5">%</span>
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Cost / Unit</p>
                <p className="text-lg font-black text-slate-700 leading-none">
                  ₹8.41
                </p>
              </div>
            </div>
          </div>

          {selectedPeriod === 'day' && (
            <Link
              to="/sessions"
              className="w-full cursor-pointer rounded-[28px] border border-brand/5 bg-white p-5 flex items-center justify-between text-left group transition-all hover:bg-slate-50 hover:border-brand/20 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.03)] active:translate-y-1 active:shadow-none ring-1 ring-slate-100"
            >
              <div className="space-y-1">
                <p className="text-xs font-black text-slate-900 tracking-tight leading-none mb-1.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand animate-ping"></span>
                  {isEV ? 'EV CHARGING PORT' : `${selectedAppliance?.name.toUpperCase() || 'APPLIANCE'} ACTIVE`}
                </p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] flex items-center gap-2">
                  <Clock3 size={10} />
                  Session started {formatStartTime(selectedAppliance?.startedAt)}
                </p>
              </div>
              <div className="flex items-center gap-3 text-slate-300 group-hover:text-brand transition-all">
                <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                <div className="p-1 bg-slate-50 rounded-lg group-hover:bg-brand/10 group-hover:text-brand transition-colors">
                  <ChevronRight size={20} />
                </div>
              </div>
            </Link>
          )}

        </section>

        {/* Weather Conditions Card */}
        <section className="group relative overflow-hidden bg-white/70 border border-slate-200/50 rounded-[32px] p-6 md:p-10 transition-all duration-500 hover:border-cyan-400/30 shadow-sm hover:shadow-md">
          {isWeatherLoading ? (
            <div className="flex items-center justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div>
          ) : weatherError ? (
            <div className="text-red-400 text-sm p-4 text-center">Failed to load weather</div>
          ) : weatherData ? (
            <>
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-base font-medium text-slate-800">Weather Conditions</h3>
                <div className="p-3 bg-sky-50 rounded-2xl">
                  {getWeatherIcon(weatherData.condition)}
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[32px] font-normal text-slate-900 tracking-tight leading-none mb-1.5 flex items-start">
                    {weatherData.temperature.toFixed(1)}<span className="text-xl mt-1">°C</span>
                  </div>
                  <div className="text-sm font-medium text-slate-500 mb-5">{weatherData.condition}</div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <Clock3 size={12} />
                    <span>Last updated: {weatherData.lastUpdated.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pb-6">
                  <div className="flex items-center justify-end gap-3 text-sm font-semibold text-slate-700">
                    <Droplets size={16} className="text-slate-500 stroke-[2]" />
                    <span>{weatherData.humidity}%</span>
                  </div>
                  <div className="flex items-center justify-end gap-3 text-sm font-semibold text-slate-700">
                    <Cloud size={16} className="text-slate-600 stroke-[2]" fill="currentColor" />
                    <span>{weatherData.windSpeed} km/h</span>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </section>

        {/* Next Actions Section */}
        <section className="group relative overflow-hidden bg-white/70 border border-slate-200/50 rounded-[32px] p-6 md:p-10 transition-all duration-500 hover:border-cyan-400/30 shadow-sm hover:shadow-md">
          <h3 className="text-base font-medium text-slate-800 mb-5">Next actions</h3>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { label: 'Bills', path: '/bills', icon: FileText, colorClass: 'text-teal-600', bgClass: 'bg-teal-50' },
              { label: 'Save tips', path: '/save', icon: Lightbulb, colorClass: 'text-amber-500', bgClass: 'bg-amber-50' },
              { label: 'EV', path: '/sessions', icon: Car, colorClass: 'text-sky-500', bgClass: 'bg-sky-50' },
              { label: 'Outages', path: '/alerts', icon: AlertTriangle, colorClass: 'text-orange-500', bgClass: 'bg-orange-50' },
              { label: 'Locations', path: '/profile', icon: Home, colorClass: 'text-teal-600', bgClass: 'bg-teal-50' },
            ].map((action) => (
              action.label === 'Outages' ? (
                <div
                  key={action.label}
                  onClick={(e) => { e.preventDefault(); navigate('/alerts'); }}
                  className="flex flex-col items-center justify-center p-4 rounded-[20px] border border-slate-100/80 hover:border-slate-200 bg-white shadow-sm hover:shadow-md transition-all active:scale-95 group/btn ring-1 ring-slate-50 cursor-pointer"
                >
                  <div className={`p-2.5 rounded-[14px] mb-2.5 transition-colors ${action.bgClass} ${action.colorClass} group-hover/btn:opacity-80`}>
                    <action.icon size={22} strokeWidth={2} />
                  </div>
                  <span className="text-[13px] font-medium text-slate-700">{action.label}</span>
                </div>
              ) : (
                <Link
                  to={action.path}
                  key={action.label}
                  className="flex flex-col items-center justify-center p-4 rounded-[20px] border border-slate-100/80 hover:border-slate-200 bg-white shadow-sm hover:shadow-md transition-all active:scale-95 group/btn ring-1 ring-slate-50"
                >
                  <div className={`p-2.5 rounded-[14px] mb-2.5 transition-colors ${action.bgClass} ${action.colorClass} group-hover/btn:opacity-80`}>
                    <action.icon size={22} strokeWidth={2} />
                  </div>
                  <span className="text-[13px] font-medium text-slate-700">{action.label}</span>
                </Link>
              )
            ))}
          </div>

          <Link to="/profile" className="flex items-center justify-between text-[13px] font-semibold text-slate-500 hover:text-slate-800 transition-colors pt-1 px-1">
            More tools in Profile
            <ChevronRight size={16} />
          </Link>
        </section>

        {isLocationModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setIsLocationModalOpen(false)}>
            <div className="bg-slate-100 rounded-[32px] p-6 w-full max-w-sm shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Switch location</h3>
              <p className="text-[13px] text-slate-500 mb-5">Choose which meter to view:</p>

              <div className="flex flex-col gap-2.5">
                {availableLocations.map(loc => (
                  <button
                    key={loc.id}
                    onClick={() => {
                      if (onLocationChange) onLocationChange(loc.id);
                      setIsLocationModalOpen(false);
                    }}
                    className={`w-full p-4 rounded-full text-[13px] font-semibold transition-all ${locationId === loc.id
                      ? 'bg-teal-600 text-white shadow-md ring-2 ring-teal-500/50'
                      : 'bg-[#e2e8f0]/80 text-slate-700 hover:bg-slate-300/80'
                      } text-center`}
                  >
                    {loc.name} ({loc.meter})
                  </button>
                ))}
                <div className="h-2"></div>
                <button
                  onClick={() => setIsLocationModalOpen(false)}
                  className="w-full p-4 rounded-full bg-[#e2e8f0]/80 text-slate-600 text-[13px] font-bold hover:bg-slate-300/80 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="text-[9px] text-slate-400 text-center tracking-[0.4em] uppercase font-black opacity-30 pt-6 mx-8">
          Powergrid v4.2 · Secure Connection
        </div>
      </div>
    </div>
  );
}
