import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import { PowerDashboardMobile } from '../features/forecast/components/PowerDashboardMobile';
import { useForecastSync } from '../features/forecast/hooks/useForecastSync';
import { useForecastStore } from '../features/forecast/store/useForecastStore';
import { useActiveAppliancesSync } from '../features/active-appliances/hooks/useActiveAppliancesSync';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const selectedLocationId = useForecastStore((state) => state.selectedLocationId);
  const setSelectedLocationId = useForecastStore((state) => state.setSelectedLocationId);
  const forecastQuery = useForecastSync(selectedLocationId);
  const activeAppliancesQuery = useActiveAppliancesSync(selectedLocationId);

  const isLoading = forecastQuery.isLoading || activeAppliancesQuery.isLoading;
  const isError = forecastQuery.isError || activeAppliancesQuery.isError;
  const error = (forecastQuery.error as Error) ?? (activeAppliancesQuery.error as Error);
  const canRenderDashboard =
    Boolean(forecastQuery.forecast) && activeAppliancesQuery.appliances.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 text-slate-900 pb-32 px-4 md:px-6">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-200/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl animate-blob stagger-2"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-slate-100/30 rounded-full blur-3xl animate-blob stagger-4"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto pt-8 md:pt-12">
        {isLoading && (
          <div className="text-slate-600 flex items-center gap-3 justify-center min-h-[400px]">
            <Loader2 className="animate-spin text-cyan-600" size={32} />
            <span className="text-sm font-medium">Fetching dashboard from backend...</span>
          </div>
        )}

        {!isLoading && isError && (
          <div className="max-w-sm mx-auto rounded-2xl bg-red-50 border border-red-200 p-6 text-red-700 shadow-xl animate-slide-in-fade">
            <p className="font-semibold text-lg">Unable to load dashboard</p>
            <p className="text-sm mt-2">{(error as Error)?.message ?? 'Please try again.'}</p>
          </div>
        )}

        {!isLoading && !isError && canRenderDashboard && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <PowerDashboardMobile
              forecast={forecastQuery.forecast!}
              locationId={selectedLocationId}
              userName={user?.name}
              appliances={activeAppliancesQuery.appliances}
              selectedApplianceId={activeAppliancesQuery.selectedApplianceId}
              onSelectAppliance={activeAppliancesQuery.onSelectAppliance}
              onLocationChange={setSelectedLocationId}
            />
          </div>
        )}

        {!isLoading && !isError && !canRenderDashboard && (
          <div className="max-w-sm mx-auto rounded-2xl bg-amber-50 border border-amber-200 p-6 text-amber-700 shadow-xl animate-slide-in-fade text-center">
            <p className="font-semibold text-lg text-slate-900 mb-2">No active data</p>
            <p className="text-xs text-slate-600">Try another location or ensure appliances are active.</p>
          </div>
        )}
      </div>
    </div>
  );
}
