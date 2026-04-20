import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Car, RefreshCw, List, Zap, Battery, X } from 'lucide-react';
import { useForecastStore } from '../features/forecast/store/useForecastStore';
import { useApplianceSessionSync } from '../features/appliance-sessions/hooks/useApplianceSessionSync';

export default function ApplianceSessionsPage() {
  const navigate = useNavigate();
  const selectedLocationId = useForecastStore((state) => state.selectedLocationId);
  const [selectedApplianceType, setSelectedApplianceType] = useState<'EV' | 'AC'>('EV');

  const applianceSessionQuery = useApplianceSessionSync(selectedLocationId, selectedApplianceType);
  const type = selectedApplianceType;

  return (
    <div className="min-h-screen bg-slate-50 md:bg-black md:p-8 flex items-center justify-center">
      <div className="w-full max-w-md md:max-w-5xl bg-[#F9FAF9] md:rounded-[32px] min-h-screen md:min-h-[80vh] flex flex-col relative overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="pt-8 md:pt-10 pb-4 md:pb-6 px-6 md:px-10 relative z-10 flex justify-between items-start border-b border-transparent md:border-slate-200">
          <div className="space-y-1 pr-6 flex-1 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <button onClick={() => navigate('/dashboard')} className="md:hidden text-slate-400 hover:text-slate-600 transition-colors">
                  <ArrowLeft size={20} />
                </button>
                {type} + Storage Insights
              </h1>
              <p className="text-xs text-slate-500 font-medium md:pl-0 pl-8 mt-1">
                Demo analytics for Home • Meter MH-MUM-000112233
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3 md:gap-4 mt-1 md:mt-0">
            {/* Appliance Switcher */}
            <div className="bg-slate-200/50 p-1 rounded-full flex gap-1 shrink-0">
              <button
                onClick={() => setSelectedApplianceType('EV')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${type === 'EV' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
              >
                EV
              </button>
              <button
                onClick={() => setSelectedApplianceType('AC')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${type === 'AC' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
              >
                AC
              </button>
            </div>

            {/* Cross Button */}
            <button
              onClick={() => navigate('/dashboard')}
              className="text-slate-900 cursor-pointer hover:text-slate-600 transition-colors bg-white rounded-full p-1.5 shadow-sm border border-slate-200 shrink-0 hidden md:block" // Hidden on mobile if needed, or md:flex
            >
              <X size={20} strokeWidth={3} />
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-slate-900 hover:text-slate-600 transition-colors bg-white rounded-full p-1.5 shadow-sm border border-slate-100 shrink-0 md:hidden"
            >
              <X size={20} strokeWidth={3} />
            </button>
          </div>
        </div>

        <div className="px-4 md:px-10 pb-8 pt-4 space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-8 relative z-10 flex-1 overflow-y-auto">

          {/* Left Column: Impact Data */}
          <div>
            <div className="rounded-[24px] bg-white p-5 md:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-black text-slate-800">{type} impact (last 30 days)</h2>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <RefreshCw size={16} />
                </button>
              </div>

              {/* Current Status Box */}
              <div className="rounded-[16px] bg-[#E8F6F4] border border-[#BDE3DC] p-3.5 mb-5 flex gap-3">
                <div className="mt-0.5">
                  <Car size={16} className="text-[#149A86]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#149A86] mb-1">
                    {type === 'EV' ? 'Charging' : 'Running'} now • 7.7 kW
                  </p>
                  <p className="text-[11px] font-medium text-[#149A86]/70 leading-snug">
                    This is derived from the current 15-min interval in the demo data.
                  </p>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="text-center space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider text-center">{type} share</p>
                  <p className="text-sm font-black text-slate-800">38%</p>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider text-center">{type} energy</p>
                  <p className="text-sm font-black text-slate-800">56.7 kWh</p>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider text-center">{type} cost</p>
                  <p className="text-sm font-black text-slate-800">₹441</p>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full bg-[#1A897A] hover:bg-[#14766A] text-white py-3.5 rounded-[12px] font-bold text-[13px] flex items-center justify-center gap-2 transition-colors">
                <Car size={16} />
                Simulate {type} charging detection
              </button>
            </div>
          </div>

          {/* Right Column: Sessions & Storage */}
          <div className="space-y-4 md:space-y-6">

            {/* Probable Sessions */}
            <div className="rounded-[24px] bg-white p-5 md:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-sm font-black text-slate-800">Probable {type} sessions</h2>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <List size={18} />
                </button>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {applianceSessionQuery.isLoading ? (
                  <div className="text-center py-6 text-sm text-slate-400 font-medium">Loading sessions...</div>
                ) : applianceSessionQuery.error ? (
                  <div className="text-center py-6 text-sm text-red-400 font-medium">Error loading sessions</div>
                ) : applianceSessionQuery.sessions.length > 0 ? (
                  applianceSessionQuery.sessions.map((session, index) => {
                    const energyKwh = Number(session.energyKwh || 0);
                    const costInr = Number(session.estimatedCostInr || 0);
                    const avgPower = session.avgPowerKw != null ? Number(session.avgPowerKw) : (energyKwh / 2);
                    const conf = Number(session.confidenceScore || 0);

                    return (
                      <div key={session.sessionId || index} className="rounded-[16px] border border-slate-100 p-4 hover:border-slate-300 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 shrink-0">
                            <Zap size={16} className="text-[#E88E36] fill-[#E88E36]/20" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1.5">
                              <span className="text-[13px] font-black text-slate-900 truncate">{energyKwh.toFixed(1)} kWh</span>
                              <span className="text-[13px] font-black text-slate-700 ml-2">₹{costInr.toFixed(0)}</span>
                            </div>
                            <p className="text-[12px] font-bold text-slate-500 mb-1 truncate">
                              {session.date} at {session.startTime} - {session.endTime}
                            </p>
                            <p className="text-[11px] font-bold text-slate-400 truncate">
                              Avg {avgPower.toFixed(1)} kW · Confidence {conf.toFixed(0)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-sm text-slate-400 font-medium">No probable sessions detected</div>
                )}
              </div>
            </div>

            {/* Home Storage Demo */}
            <div className="rounded-[24px] bg-white p-5 md:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[15px] font-black text-slate-800">Home storage (demo)</h2>
                <div className="text-slate-500 p-1.5 rounded-lg border border-slate-200">
                  <Battery size={18} strokeWidth={2.5} />
                </div>
              </div>
              <p className="text-[13px] font-bold text-slate-600 mb-3 leading-snug">
                Current source: genset • Storage SOC: Not active
              </p>
              <p className="text-[11px] font-medium text-slate-500 leading-relaxed max-w-[90%]">
                For the POC, storage behavior is simulated. With real telemetry, this screen would show charge/discharge cycles and savings.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
