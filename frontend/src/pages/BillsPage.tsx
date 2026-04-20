import { useState, useEffect } from 'react';
import {
  History,
  MapPin,
  Zap,
  Download,
  IndianRupee,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import { useLocations } from '../features/locations/hooks/useLocations';
import { useBillingSummary, useCreatePaymentOrder } from '../features/billing/hooks/useBills';
import { useRazorpay } from '../features/billing/hooks/useRazorpay';
import { useBillingStore } from '../store/useBillingStore';
import { useForecastStore } from '../features/forecast/store/useForecastStore';
import { format } from 'date-fns';

export default function BillsPage() {
  const user = useAuthStore((state) => state.user);
  const { data: locationsData, isLoading: isLoadingLocations } = useLocations(user?.userId);
  const selectedLocationId = useForecastStore((state) => state.selectedLocationId);
  const setSelectedLocationId = useForecastStore((state) => state.setSelectedLocationId);

  const {
    data: billingData,
    isLoading: isLoadingBilling,
    isError: isBillingError,
    refetch: refetchBilling
  } = useBillingSummary(selectedLocationId);

  const { mutateAsync: createPaymentOrder } = useCreatePaymentOrder();
  const { openCheckout } = useRazorpay();
  const { setBillSummary } = useBillingStore();

  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    if (billingData?.currentBill) {
      setBillSummary({
        billId: billingData.currentBill.billId,
        amount: Number(billingData.currentBill.amountDue),
        status: billingData.currentBill.status,
        dueDate: billingData.currentBill.dueDate,
      });
    }
  }, [billingData, setBillSummary]);

  const handlePayment = async () => {
    if (!billingData?.currentBill) return;

    try {
      setIsPaying(true);
      setPaymentError(null);

      const orderData = await createPaymentOrder({
        billId: billingData.currentBill.billId,
        amount: Number(billingData.currentBill.amountDue),
        locationId: selectedLocationId,
      });

      await openCheckout({
        key: orderData.key,
        amount: orderData.amount,
        orderId: orderData.orderId,
        transactionId: orderData.transactionId,
        billId: orderData.billId,
        userName: user?.name,
        userEmail: user?.email,
      });

      // After successful payment, the hook updates the store status to SUCCESS
      // We refetch to get updated PAID status from backend
      await refetchBilling();
    } catch (err: any) {
      console.error('Payment flow failed:', err);
      setPaymentError(err.message || 'Payment process failed. Please try again.');
    } finally {
      setIsPaying(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'UNPAID': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'OVERDUE': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const currentBill = billingData?.currentBill;
  const billingHistory = billingData?.billingHistory || [];
  const locations = locationsData?.data?.locations || [];

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
              Manage your <span className="text-cyan-600">Bills</span>
            </h1>
            <p className="text-slate-600 text-xs md:text-sm mt-1 md:mt-2 font-medium italic">Track energy spending & pay instantly</p>
          </div>
          <button className="w-10 h-10 md:w-12 md:h-12 bg-slate-900/10 border border-slate-900/20 rounded-2xl flex items-center justify-center text-cyan-600 hover:bg-slate-900/20 transition-colors flex-shrink-0">
            <Download size={18} className="md:w-5 md:h-5" />
          </button>
        </div>

        {/* Location Selector */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-2 mb-3 md:mb-4 px-0 md:px-1">
            <MapPin size={14} className="text-cyan-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Service Location</span>
          </div>
          <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-3 scrollbar-none">
            {isLoadingLocations ? (
              <div className="flex gap-3">
                {[1, 2].map(i => <div key={i} className="w-32 md:w-full h-16 bg-slate-200/40 rounded-2xl animate-pulse flex-shrink-0 md:flex-shrink"></div>)}
              </div>
            ) : (
              locations.map((loc) => (
                <button
                  key={loc.locationId}
                  onClick={() => setSelectedLocationId(loc.locationId)}
                  className={`flex-shrink-0 md:flex-shrink px-4 md:px-5 py-3 md:py-4 rounded-2xl border transition-all duration-300 flex flex-col items-start gap-1 ${selectedLocationId === loc.locationId
                      ? 'bg-gradient-to-br from-cyan-600/10 to-cyan-500/5 border-cyan-600/50 text-slate-900 shadow-[0_8px_20px_-8px_rgba(34,211,238,0.2)]'
                      : 'bg-slate-900/5 border-slate-900/10 text-slate-700 hover:border-slate-900/20'
                    }`}
                >
                  <span className="text-xs font-black tracking-widest uppercase">{loc.locationName}</span>
                  <span className="text-[10px] opacity-60 font-medium truncate max-w-[120px] md:max-w-full">{loc.meterNumber}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Current Bill Section */}
        <div className="mb-10 md:mb-16">
          <div className="flex items-center gap-2 mb-4 md:mb-6 px-0 md:px-1">
            <Zap size={14} className="text-amber-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Current Outstanding</span>
          </div>

          {isLoadingBilling ? (
            <div className="bg-white/60 border border-slate-200/50 rounded-[32px] p-6 md:p-12 h-64 md:h-80 flex flex-col items-center justify-center gap-4 animate-pulse">
              <Loader2 className="animate-spin text-cyan-600" size={32} />
              <span className="text-slate-600 text-sm">Calculating current usage...</span>
            </div>
          ) : isBillingError ? (
            <div className="bg-red-50 border border-red-200 rounded-[32px] p-6 md:p-12 text-center">
              <AlertTriangle className="mx-auto text-red-600 mb-4" size={32} />
              <h3 className="text-slate-900 font-bold mb-2">Failed to load bill</h3>
              <p className="text-slate-600 text-xs mb-6">We couldn't fetch your latest billing data for this location.</p>
              <button
                onClick={() => refetchBilling()}
                className="px-6 py-2 bg-red-100 text-red-600 rounded-xl text-xs font-bold uppercase transition-all hover:bg-red-200"
              >
                Retry Fetching
              </button>
            </div>
          ) : currentBill ? (
            <div className="group relative overflow-hidden bg-white/70 border border-slate-200/50 rounded-[32px] p-6 md:p-10 lg:p-12 transition-all duration-500 hover:border-cyan-400/30 shadow-sm hover:shadow-md">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-40 h-40 md:w-64 md:h-64 bg-cyan-300/15 rounded-full blur-3xl -mr-20 -mt-20 md:-mr-40 md:-mt-40 group-hover:bg-cyan-300/20 transition-colors"></div>

              <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-12">
                {/* Left Column - Bill Info */}
                <div>
                  <div className="mb-8 md:mb-10">
                    <h2 className="text-slate-600 text-xs font-black uppercase tracking-[0.2em] mb-2">
                      {format(new Date(currentBill.dueDate), 'MMMM yyyy')}
                    </h2>
                    <div className="flex items-center gap-2 mb-6 md:mb-8">
                      <span className="text-slate-900 text-sm md:text-base font-medium">{currentBill.unitsConsumed} units consumed</span>
                    </div>

                    <div className="flex items-baseline gap-2 md:gap-3 mb-6">
                      <span className="text-3xl md:text-5xl font-black text-slate-900 italic">₹{Number(currentBill.amountDue).toLocaleString('en-IN')}</span>
                      <span className="text-slate-600 text-xs md:text-sm font-bold uppercase tracking-widest">Total Due</span>
                    </div>
                  </div>

                  <div className={`inline-block px-4 py-2 rounded-full border text-xs font-black uppercase tracking-widest ${getStatusColor(currentBill.status)}`}>
                    {currentBill.status}
                  </div>
                </div>

                {/* Right Column - Payment */}
                <div>
                  {currentBill.status !== 'PAID' ? (
                    <div className="space-y-4">
                      <div className="relative group/input">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                          <IndianRupee size={16} />
                        </div>
                        <input
                          type="text"
                          readOnly
                          value={user?.phoneNumber || 'user@upi'}
                          className="w-full bg-slate-900/5 border border-slate-300/50 rounded-2xl py-3 md:py-4 pl-12 pr-4 text-xs md:text-sm font-bold text-slate-700 focus:outline-none focus:border-cyan-600/50 transition-colors"
                        />
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-40">
                          <History size={14} />
                        </div>
                      </div>

                      <button
                        disabled={isPaying}
                        onClick={handlePayment}
                        className="w-full relative group/btn overflow-hidden bg-cyan-600 text-white font-black uppercase tracking-[0.2em] text-xs py-4 md:py-5 rounded-2xl shadow-[0_12px_24px_-8px_rgba(8,145,178,0.3)] hover:shadow-[0_12px_32px_-4px_rgba(8,145,178,0.4)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
                      >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                        <div className="flex items-center justify-center gap-3">
                          {isPaying ? (
                            <Loader2 className="animate-spin" size={18} />
                          ) : (
                            <>
                              <ArrowUpRight size={18} />
                              <span>Pay via Razorpay</span>
                            </>
                          )}
                        </div>
                      </button>

                      {paymentError && (
                        <div className="flex items-center gap-2 text-red-600 text-[10px] font-bold justify-center mt-2">
                          <AlertCircle size={12} />
                          <span>{paymentError}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                          <CheckCircle2 size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-slate-900 text-xs font-black uppercase tracking-widest">Payment Success</p>
                          <p className="text-emerald-700 text-[10px] font-medium">Thank you for paying on time</p>
                        </div>
                      </div>
                      <button className="text-emerald-700 text-[10px] font-black uppercase tracking-widest hover:underline flex-shrink-0">
                        Receipt
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/60 border border-slate-200/50 rounded-[32px] p-8 md:p-12 text-center">
              <CheckCircle2 className="mx-auto text-emerald-600 mb-4" size={32} />
              <h3 className="text-slate-900 font-bold mb-2">No Bills found</h3>
              <p className="text-slate-600 text-xs">Everything is up to date for this location.</p>
            </div>
          )}
        </div>

        {/* Bill History Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6 px-0 md:px-1">
            <div className="flex items-center gap-2">
              <History size={14} className="text-purple-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">History (12 Months)</span>
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest text-[#52ded1] hover:underline">View All</button>
          </div>

          {isLoadingBilling ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {[1, 2, 3].map(i => <div key={i} className="h-20 md:h-24 bg-slate-200/40 rounded-2xl animate-pulse"></div>)}
            </div>
          ) : billingHistory.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {billingHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden p-4 md:p-5 bg-white/70 border border-slate-200/60 rounded-2xl hover:bg-white hover:border-cyan-400/30 transition-all duration-300 hover:shadow-[0_8px_20px_-8px_rgba(8,145,178,0.15)]"
                >
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <p className="text-slate-900 text-xs font-black uppercase tracking-widest mb-1">
                        {format(new Date(item.year, item.month - 1), 'MMM yyyy')}
                      </p>
                      <p className="text-slate-600 text-[10px] font-medium">{item.totalConsumptionKwh} kWh used</p>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                      <span className="text-slate-900 text-xs font-bold">₹{Number(item.totalPaidInr).toLocaleString('en-IN')}</span>
                      <div className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${getStatusColor(item.status)}`}>
                        {item.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-600 font-medium italic">
              No historical records found for this location.
            </div>
          )}
        </div>

        {/* Support Card */}
        <div className="mt-12 md:mt-16 p-6 md:p-8 bg-gradient-to-br from-indigo-50 to-purple-50 border border-slate-200/60 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 flex-shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div className="min-w-0">
              <h4 className="text-slate-900 text-xs font-black uppercase tracking-widest mb-1">Facing Issues?</h4>
              <p className="text-slate-600 text-[10px] font-medium truncate">Contact our 24/7 billing support line</p>
            </div>
          </div>
          <button className="px-4 md:px-6 py-2 md:py-3 bg-slate-900/5 hover:bg-slate-900/10 rounded-xl text-slate-900 text-[10px] font-black uppercase tracking-widest transition-all flex-shrink-0">
            Help
          </button>
        </div>
      </div>
    </div>
  );
}
