import React from 'react';
import { Sparkles, Calendar, PlusCircle, MessageSquareText, Printer, FileText, ChevronDown } from 'lucide-react';
import { EventPlan } from '../types/event';

interface NavbarProps {
  currentPlan: EventPlan | null;
  onOpenPlanner: () => void;
  onOpenAssistant: () => void;
  onLoadSample: (sampleKey: string) => void;
  onPrint: () => void;
  onResetToLanding: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPlan,
  onOpenPlanner,
  onOpenAssistant,
  onLoadSample,
  onPrint,
  onResetToLanding,
}) => {
  const [showSamplesMenu, setShowSamplesMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#FAF7F2]/90 border-b border-[#E8E1D5] no-print transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <button
          onClick={onResetToLanding}
          className="flex items-center gap-3 group text-left transition hover:opacity-95"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9F7AEA] via-[#D4AF37] to-[#F59E0B] p-0.5 shadow-md shadow-[#D4AF37]/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#FAF7F2] rounded-[10px] flex items-center justify-center group-hover:bg-transparent transition">
              <Sparkles className="w-5 h-5 text-[#9F7AEA] group-hover:text-white transition" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif-luxury text-2xl font-bold tracking-tight text-[#2D2438]">
                EventAura
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#E8DEF8] text-[#553C9A]">
                AI
              </span>
            </div>
            <p className="text-[11px] text-[#7E6E85] hidden sm:block -mt-0.5 font-medium">
              Every Celebration Deserves a Perfect Plan
            </p>
          </div>
        </button>

        {/* Right Action Items */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sample Plans Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSamplesMenu(!showSamplesMenu)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#D9D0C1] text-[#4A3E56] hover:bg-[#F2ECE1] transition shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5 text-[#9F7AEA]" />
              <span className="hidden md:inline">Sample Plans</span>
              <ChevronDown className="w-3 h-3 text-[#7E6E85]" />
            </button>

            {showSamplesMenu && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#E8E1D5] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onMouseLeave={() => setShowSamplesMenu(false)}
              >
                <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#9E90A2]">
                  Explore Inspiration
                </div>
                <button
                  onClick={() => {
                    onLoadSample('wedding');
                    setShowSamplesMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-[#FAF7F2] flex flex-col transition"
                >
                  <span className="font-semibold text-[#2D2438]">Royal Heritage Wedding (Udaipur)</span>
                  <span className="text-[11px] text-[#7E6E85]">250 Guests • ₹15,00,000 INR</span>
                </button>
                <button
                  onClick={() => {
                    onLoadSample('birthday');
                    setShowSamplesMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-[#FAF7F2] flex flex-col transition"
                >
                  <span className="font-semibold text-[#2D2438]">30th Rooftop Soirée (Bengaluru)</span>
                  <span className="text-[11px] text-[#7E6E85]">60 Guests • ₹1,80,000 INR</span>
                </button>
              </div>
            )}
          </div>

          {currentPlan && (
            <>
              {/* Print / Export Button */}
              <button
                onClick={onPrint}
                title="Download or Print Plan"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#D9D0C1] text-[#4A3E56] hover:bg-[#F2ECE1] transition shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 text-[#7E6E85]" />
                <span className="hidden lg:inline">Download PDF</span>
              </button>

              {/* AI Assistant Button */}
              <button
                onClick={onOpenAssistant}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white hover:from-[#7C3AED] hover:to-[#6D28D9] transition shadow-sm shadow-[#7C3AED]/25"
              >
                <MessageSquareText className="w-3.5 h-3.5" />
                <span>AI Assistant</span>
              </button>
            </>
          )}

          {/* Primary CTA: Plan My Event */}
          <button
            onClick={onOpenPlanner}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#DFBD49] to-[#C99E25] text-white shadow-md shadow-[#D4AF37]/30 hover:brightness-105 active:scale-98 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Plan My Event</span>
          </button>
        </div>
      </div>
    </header>
  );
};
