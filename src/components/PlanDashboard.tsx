import React, { useState } from 'react';
import {
  Sparkles,
  Coins,
  CalendarDays,
  Layers,
  Lightbulb,
  Share2,
  Copy,
  Printer,
  Check,
  ArrowLeft,
  MessageSquareText,
  HeartHandshake,
  Cake,
  GlassWater,
  Briefcase,
  Users,
  Compass,
} from 'lucide-react';
import { EventPlan } from '../types/event';
import { formatINR, formatDate, planToMarkdown } from '../utils/formatters';
import { OverviewTab } from './tabs/OverviewTab';
import { BudgetTab } from './tabs/BudgetTab';
import { TimelineTab } from './tabs/TimelineTab';
import { VendorChecklistTab } from './tabs/VendorChecklistTab';
import { InspirationTab } from './tabs/InspirationTab';

interface PlanDashboardProps {
  plan: EventPlan;
  onUpdatePlan: (updatedPlan: EventPlan) => void;
  onOpenPlanner: () => void;
  onOpenAssistant: () => void;
  onPrint: () => void;
  onRegenerateSection: (section: string) => Promise<void>;
  isRegeneratingSection: string | null;
  onResetToLanding: () => void;
}

type TabType = 'overview' | 'budget' | 'timeline' | 'vendors' | 'inspiration';

export const PlanDashboard: React.FC<PlanDashboardProps> = ({
  plan,
  onUpdatePlan,
  onOpenPlanner,
  onOpenAssistant,
  onPrint,
  onRegenerateSection,
  isRegeneratingSection,
  onResetToLanding,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [copiedPlan, setCopiedPlan] = useState(false);

  const { formData, concept, budget, vendorChecklist } = plan;

  const handleCopyPlan = () => {
    const md = planToMarkdown(plan);
    navigator.clipboard.writeText(md);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2500);
  };

  const getEventIcon = () => {
    switch (formData.eventType) {
      case 'wedding':
        return HeartHandshake;
      case 'birthday':
        return Cake;
      case 'anniversary':
        return GlassWater;
      case 'corporate':
        return Briefcase;
      default:
        return Users;
    }
  };

  const EventIcon = getEventIcon();

  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Concept & Overview', icon: Sparkles },
    { id: 'budget', label: 'Budget Planner', icon: Coins },
    { id: 'timeline', label: 'Timeline & Schedule', icon: CalendarDays },
    { id: 'vendors', label: 'Vendor Checklist', icon: Layers },
    { id: 'inspiration', label: 'Ideas & Inspiration', icon: Lightbulb },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 no-print space-y-6">
      {/* Top Breadcrumb & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onResetToLanding}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A6B84] hover:text-[#271E30] transition self-start"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing Page</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Copy Full Plan */}
          <button
            onClick={handleCopyPlan}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-[#D9CEBC] text-[#483B52] hover:bg-[#FAF4EB] transition shadow-xs"
          >
            {copiedPlan ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied Plan!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#8D7E96]" />
                <span>Copy Full Plan</span>
              </>
            )}
          </button>

          {/* Download / Print PDF */}
          <button
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-[#D9CEBC] text-[#483B52] hover:bg-[#FAF4EB] transition shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#8D7E96]" />
            <span>Print / PDF</span>
          </button>

          {/* Plan AI Assistant button */}
          <button
            onClick={onOpenAssistant}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white hover:brightness-105 transition shadow-sm shadow-[#7C3AED]/25"
          >
            <MessageSquareText className="w-3.5 h-3.5" />
            <span>AI Assistant Copilot</span>
          </button>

          {/* Edit / New Plan */}
          <button
            onClick={onOpenPlanner}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[#271E30] text-white hover:bg-[#150F1D] transition shadow-xs"
          >
            <span>Modify Plan Parameters</span>
          </button>
        </div>
      </div>

      {/* Main Header Card with Key Details */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#E9DFCE] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF0E6] border border-[#E9D9C3] flex items-center justify-center text-[#B78628] shrink-0 shadow-xs">
              <EventIcon className="w-7 h-7" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E8DEF8] text-[#553C9A]">
                  {formData.eventType}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FAF0E6] text-[#7B581E]">
                  {formData.eventStyle}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0369A1]">
                  {formData.indoorOutdoor}
                </span>
              </div>

              <h1 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-[#271E30]">
                {formData.eventName || concept.themeTitle}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B5A75] mt-1.5 font-medium">
                <span>📅 {formatDate(formData.eventDate)}</span>
                <span>📍 {formData.eventLocation}</span>
                <span>👥 {formData.guestCount} Guests</span>
                <span>💰 Budget: {formatINR(budget.totalBudget)}</span>
              </div>
            </div>
          </div>

          {/* Quick AI badge */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FBF7F0] border border-[#EBE2D3] lg:max-w-xs shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#9F7AEA] to-[#D4AF37] flex items-center justify-center text-white shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-[11px] text-[#5D4E67] leading-tight">
              <span className="font-bold text-[#271E30] block">Gemini 3.8 Intelligence</span>
              Budget balanced strictly within {formatINR(budget.totalBudget)}.
            </div>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pt-8 border-t border-[#F0E8DC] mt-6 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#D4AF37] via-[#DFBD49] to-[#C99E25] text-white shadow-md shadow-[#D4AF37]/25'
                    : 'text-[#64556F] hover:text-[#271E30] hover:bg-[#FAF4EB]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8C7D96]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Render */}
      <div>
        {activeTab === 'overview' && (
          <OverviewTab
            plan={plan}
            onNavigateTab={(tab) => setActiveTab(tab as TabType)}
            onOpenAssistant={onOpenAssistant}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetTab
            plan={plan}
            onUpdatePlan={onUpdatePlan}
            onOpenAssistant={onOpenAssistant}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineTab
            plan={plan}
            onUpdatePlan={onUpdatePlan}
            onOpenAssistant={onOpenAssistant}
          />
        )}

        {activeTab === 'vendors' && (
          <VendorChecklistTab
            plan={plan}
            onUpdatePlan={onUpdatePlan}
            onOpenAssistant={onOpenAssistant}
          />
        )}

        {activeTab === 'inspiration' && (
          <InspirationTab
            plan={plan}
            onRegenerateSection={onRegenerateSection}
            onOpenAssistant={onOpenAssistant}
            isRegeneratingSection={isRegeneratingSection}
          />
        )}
      </div>
    </div>
  );
};
