import { ChatWidget } from '../features/chat/components/ChatWidget';
import { Zap, TrendingDown, Lightbulb } from 'lucide-react';

export default function ChatPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-900 dark:text-slate-100">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-200/20 dark:bg-cyan-900/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200/20 dark:bg-teal-900/10 rounded-full blur-3xl animate-blob stagger-2"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-slate-100/30 dark:bg-slate-700/20 rounded-full blur-3xl animate-blob stagger-4"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-8 md:py-12">
        {/* Hero Section - Premium Mobile Aligned */}
        <div className="mb-8 sm:mb-12 md:mb-16 text-center md:text-left">
          {/* Icon and Title Container - Mobile Centered */}
          <div className="flex flex-col md:flex-row md:items-start gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8 md:mb-8 md:justify-start">
            {/* Icon Box - Centered on Mobile */}
            <div className="flex justify-center md:justify-start">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-brand to-brand-light rounded-xl sm:rounded-2xl shadow-xl">
                <Zap size={32} className="sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
              </div>
            </div>
            
            {/* Title and Subtitle */}
            <div className="flex flex-col items-center md:items-start justify-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-brand via-brand-light to-cyan-500 bg-clip-text text-transparent leading-tight tracking-tight">
                Energy Concierge
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-slate-500 dark:text-slate-400 mt-2 sm:mt-3 font-medium">
                Your AI-powered energy assistant
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed font-medium mx-auto md:mx-0">
            Get instant advice on reducing electricity bills, optimizing energy consumption, and making smart decisions about your home's power usage.
          </p>
        </div>

        {/* Main Layout - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {/* Chat Widget - Full Width on Mobile */}
          <div className="lg:col-span-2 order-1 flex flex-col">
            <div className="flex-1 min-h-[450px] sm:min-h-[550px] md:h-[600px] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700">
              <ChatWidget />
            </div>

          </div>

          {/* Info Cards - Grid on Mobile, Sidebar on Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:col-span-1 gap-4 md:gap-6 order-2">
            {/* Quick Tips */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="text-yellow-500" size={20} />
                <h3 className="font-bold text-base sm:text-lg">Quick Tips</h3>
              </div>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <li className="flex gap-2">
                  <span className="text-brand font-bold">•</span>
                  <span>Ask about peak hours and off-peak rates</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand font-bold">•</span>
                  <span>Get tips for appliance efficiency</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand font-bold">•</span>
                  <span>Learn about energy-saving habits</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand font-bold">•</span>
                  <span>Understand your electricity bill</span>
                </li>
              </ul>
            </div>

            {/* Benefits */}
            <div className="bg-gradient-to-br from-brand/10 to-brand-light/10 dark:from-brand/20 dark:to-brand-light/20 rounded-2xl p-5 sm:p-6 border border-brand/20 dark:border-brand/30">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <TrendingDown className="text-brand" size={20} />
                <h3 className="font-bold text-base sm:text-lg">Save More</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                Our AI analyzes your usage patterns and provides personalized recommendations to reduce your electricity bills by up to 30%.
              </p>
            </div>

            {/* Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-base sm:text-lg mb-4">Why Energy Concierge?</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">24/7 Available</span>
                  <span className="text-xl sm:text-2xl font-bold text-brand">✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">AI Powered</span>
                  <span className="text-xl sm:text-2xl font-bold text-brand">✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Instant Answers</span>
                  <span className="text-xl sm:text-2xl font-bold text-brand">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
