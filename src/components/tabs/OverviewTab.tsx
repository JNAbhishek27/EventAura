import React, { useState } from 'react';
import {
  Sparkles,
  Palette,
  Lightbulb,
  Copy,
  Check,
  Compass,
  ArrowRight,
  TrendingDown,
  Layers,
  Calendar,
  MapPin,
  Users,
  Coins,
} from 'lucide-react';
import { EventPlan } from '../../types/event';
import { formatINR, formatDate } from '../../utils/formatters';

interface OverviewTabProps {
  plan: EventPlan;
  onNavigateTab: (tabId: string) => void;
  onOpenAssistant: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  plan,
  onNavigateTab,
  onOpenAssistant,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const { concept, budget, formData, timeline, vendorChecklist, recommendations } = plan;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Event Concept Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FAF3EA] via-white to-[#F5EFFC] border border-[#E8DEC9] p-6 sm:p-10 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE4D2] border border-[#DFCDB3] text-xs font-bold text-[#72521C] mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#B78628]" />
              <span>Event Concept & Theme Blueprint</span>
            </div>

            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-[#271E30] leading-tight">
              {concept.themeTitle}
            </h2>

            <p className="font-serif-luxury italic text-lg sm:text-xl text-[#7E6642] mt-2 font-medium">
              "{concept.tagline}"
            </p>

            <p className="mt-4 text-sm sm:text-base text-[#5F4F6A] leading-relaxed">
              {concept.story}
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-72 shrink-0">
            <div className="p-3.5 rounded-2xl bg-white/90 border border-[#E9DFCE] shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C7C98]">Total Budget</span>
              <p className="text-base sm:text-lg font-extrabold text-[#B78628] mt-0.5">
                {formatINR(budget.totalBudget)}
              </p>
              <span className="text-[10px] text-[#8C7C98]">₹ INR Allocated</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 border border-[#E9DFCE] shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C7C98]">Guests</span>
              <p className="text-base sm:text-lg font-extrabold text-[#7C3AED] mt-0.5">
                {formData.guestCount}
              </p>
              <span className="text-[10px] text-[#8C7C98]">
                ≈ {formatINR(Math.round(budget.totalBudget / (formData.guestCount || 1)))}/guest
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 border border-[#E9DFCE] shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C7C98]">Date</span>
              <p className="text-xs sm:text-sm font-bold text-[#2D2438] mt-0.5 truncate">
                {formatDate(formData.eventDate)}
              </p>
              <span className="text-[10px] text-[#8C7C98]">{formData.eventLocation}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 border border-[#E9DFCE] shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C7C98]">Checklist</span>
              <p className="text-base sm:text-lg font-extrabold text-[#16A34A] mt-0.5">
                {vendorChecklist.filter((v) => v.completed).length}/{vendorChecklist.length}
              </p>
              <span className="text-[10px] text-[#8C7C98]">Milestones done</span>
            </div>
          </div>
        </div>

        {/* Personalized Recommendations Callout */}
        <div className="mt-8 pt-6 border-t border-[#E8DEC9] grid grid-cols-1 md:grid-cols-3 gap-4">
          {concept.personalizedSuggestions.map((sug, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#4E4059] bg-white/60 p-3 rounded-xl border border-[#EFE5D6]">
              <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>{sug}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Color Palette Section */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#E9DFCE] shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-serif-luxury text-2xl font-bold text-[#271E30] flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#9F7AEA]" />
              <span>Curated Color Palette</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#73637C] mt-1">
              Harmonized tones designed for linens, floral installations, stage draping, and stationery.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#8C7C98]">Click hex to copy</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {concept.colorPalette.map((color, index) => {
            const isCopied = copiedHex === color.hex;
            return (
              <div
                key={index}
                className="group rounded-2xl p-4 border border-[#EAE1D3] bg-[#FAF8F5] hover:bg-white hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div
                    className="w-full h-24 rounded-xl shadow-inner mb-3 border border-black/5 flex items-end justify-end p-2 transition group-hover:scale-[1.02]"
                    style={{ backgroundColor: color.hex }}
                  >
                    <button
                      onClick={() => handleCopyHex(color.hex)}
                      className="px-2 py-1 rounded-md bg-white/90 backdrop-blur-xs text-[11px] font-mono font-bold text-slate-800 shadow-xs flex items-center gap-1 hover:bg-white transition"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-500" />
                          <span>{color.hex}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h4 className="font-bold text-sm text-[#271E30]">{color.name}</h4>
                  <p className="text-xs text-[#6B5C74] mt-1 leading-relaxed">
                    {color.usage}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decoration Focal Ideas */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#E9DFCE] shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-serif-luxury text-2xl font-bold text-[#271E30] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#B78628]" />
              <span>Decoration & Atmosphere Concepts</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#73637C] mt-1">
              Visual installations architected to leave lasting impressions on your guests.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {concept.decorationIdeas.map((idea, index) => (
            <div
              key={index}
              className="rounded-2xl p-5 border border-[#EADFCF] bg-gradient-to-b from-[#FDFBF7] to-[#F8F4ED] hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EFE3CF] text-[#785317] mb-2.5">
                  {idea.focalArea}
                </span>
                <h4 className="font-serif-luxury text-lg font-bold text-[#271E30]">
                  {idea.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#61526C] mt-2 leading-relaxed">
                  {idea.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigateTab('budget')}
          className="p-5 rounded-2xl bg-white border border-[#E8DEC9] text-left hover:border-[#D4AF37] hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FAF0E6] flex items-center justify-center text-[#B78628] mb-3 group-hover:scale-105 transition">
            <Coins className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-[#271E30]">Budget Breakdown</span>
            <ArrowRight className="w-4 h-4 text-[#B78628] group-hover:translate-x-1 transition" />
          </div>
          <p className="text-xs text-[#7A6B84] mt-1">
            {budget.items.length} categories balanced within {formatINR(budget.totalBudget)}
          </p>
        </button>

        <button
          onClick={() => onNavigateTab('timeline')}
          className="p-5 rounded-2xl bg-white border border-[#E8DEC9] text-left hover:border-[#9F7AEA] hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] flex items-center justify-center text-[#7C3AED] mb-3 group-hover:scale-105 transition">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-[#271E30]">Timelines & Day-Of</span>
            <ArrowRight className="w-4 h-4 text-[#7C3AED] group-hover:translate-x-1 transition" />
          </div>
          <p className="text-xs text-[#7A6B84] mt-1">
            30-day prep milestones & {timeline.daySchedule.length}-part hourly schedule
          </p>
        </button>

        <button
          onClick={() => onNavigateTab('vendors')}
          className="p-5 rounded-2xl bg-white border border-[#E8DEC9] text-left hover:border-[#10B981] hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#16A34A] mb-3 group-hover:scale-105 transition">
            <Layers className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-[#271E30]">Vendor Checklist</span>
            <ArrowRight className="w-4 h-4 text-[#16A34A] group-hover:translate-x-1 transition" />
          </div>
          <p className="text-xs text-[#7A6B84] mt-1">
            {vendorChecklist.length} actionable vendor deliverables & deadlines
          </p>
        </button>

        <button
          onClick={() => onNavigateTab('inspiration')}
          className="p-5 rounded-2xl bg-white border border-[#E8DEC9] text-left hover:border-[#EC4899] hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FCE7F3] flex items-center justify-center text-[#DB2777] mb-3 group-hover:scale-105 transition">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-[#271E30]">Menu & Activities</span>
            <ArrowRight className="w-4 h-4 text-[#DB2777] group-hover:translate-x-1 transition" />
          </div>
          <p className="text-xs text-[#7A6B84] mt-1">
            Curated dishes, interactive games, and cost savings
          </p>
        </button>
      </div>
    </div>
  );
};
