import React, { useState } from 'react';
import {
  Coins,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Sparkles,
  Info,
  RotateCcw,
  Pencil,
  Save,
} from 'lucide-react';
import { EventPlan, BudgetItem } from '../../types/event';
import { formatINR } from '../../utils/formatters';

interface BudgetTabProps {
  plan: EventPlan;
  onUpdatePlan: (updatedPlan: EventPlan) => void;
  onOpenAssistant: () => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; hex: string }> = {
  Venue: { bg: 'bg-amber-100', text: 'text-amber-800', hex: '#F59E0B' },
  Catering: { bg: 'bg-emerald-100', text: 'text-emerald-800', hex: '#10B981' },
  Decoration: { bg: 'bg-purple-100', text: 'text-purple-800', hex: '#A855F7' },
  Photography: { bg: 'bg-blue-100', text: 'text-blue-800', hex: '#3B82F6' },
  Entertainment: { bg: 'bg-pink-100', text: 'text-pink-800', hex: '#EC4899' },
  Invitations: { bg: 'bg-indigo-100', text: 'text-indigo-800', hex: '#6366F1' },
  Transportation: { bg: 'bg-cyan-100', text: 'text-cyan-800', hex: '#06B6D4' },
  Miscellaneous: { bg: 'bg-slate-200', text: 'text-slate-800', hex: '#64748B' },
};

export const BudgetTab: React.FC<BudgetTabProps> = ({
  plan,
  onUpdatePlan,
  onOpenAssistant,
}) => {
  const { budget, formData } = plan;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempAmount, setTempAmount] = useState<number>(0);

  const totalAllocated = budget.items.reduce((sum, item) => sum + (Number(item.allocatedAmount) || 0), 0);
  const remainingBudget = budget.totalBudget - totalAllocated;
  const isOverBudget = remainingBudget < 0;
  const isBalanced = remainingBudget === 0;

  // Handle single item budget change
  const handleItemAmountChange = (id: string, newAmount: number) => {
    const safeAmount = Math.max(0, Math.round(newAmount));
    const updatedItems = budget.items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          allocatedAmount: safeAmount,
          percentage: Math.round((safeAmount / budget.totalBudget) * 100),
        };
      }
      return item;
    });

    const newAllocatedTotal = updatedItems.reduce((sum, item) => sum + item.allocatedAmount, 0);

    onUpdatePlan({
      ...plan,
      budget: {
        ...budget,
        items: updatedItems,
        allocatedTotal: newAllocatedTotal,
      },
    });
  };

  // Auto-Balance: Rescale all items so they add up exactly to budget.totalBudget
  const handleAutoBalance = () => {
    if (totalAllocated === 0) return;
    const factor = budget.totalBudget / totalAllocated;

    let runningSum = 0;
    const updatedItems = budget.items.map((item, idx) => {
      if (idx === budget.items.length - 1) {
        // Last item absorbs rounding difference
        const lastAmt = Math.max(0, budget.totalBudget - runningSum);
        return {
          ...item,
          allocatedAmount: lastAmt,
          percentage: Math.round((lastAmt / budget.totalBudget) * 100),
        };
      }
      const scaled = Math.round(item.allocatedAmount * factor);
      runningSum += scaled;
      return {
        ...item,
        allocatedAmount: scaled,
        percentage: Math.round((scaled / budget.totalBudget) * 100),
      };
    });

    onUpdatePlan({
      ...plan,
      budget: {
        ...budget,
        items: updatedItems,
        allocatedTotal: budget.totalBudget,
      },
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Budget Health Card */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#E9DFCE] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#F0E8DC]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0E6] text-xs font-bold text-[#8C6422] mb-2">
              <Coins className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Intelligent Allocation Engine (₹ INR)</span>
            </div>
            <h2 className="font-serif-luxury text-3xl font-bold text-[#271E30]">
              Budget & Expense Architecture
            </h2>
            <p className="text-xs sm:text-sm text-[#73637C] mt-1 max-w-xl">
              {budget.summaryNote || 'Optimized allocation aligned with your guest count, city tier, and style preferences.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!isBalanced && (
              <button
                onClick={handleAutoBalance}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B78628] text-white shadow-xs hover:brightness-105 transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Balance Budget</span>
              </button>
            )}

            <button
              onClick={onOpenAssistant}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#D9CEBC] bg-white text-[#4D3F57] hover:bg-[#FAF4EB] transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#9F7AEA]" />
              <span>Ask AI to Cut Costs</span>
            </button>
          </div>
        </div>

        {/* Big Numbers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE0D1]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8A7A96]">Total Target Budget</span>
            <p className="text-2xl font-extrabold text-[#271E30] mt-1">
              {formatINR(budget.totalBudget)}
            </p>
            <span className="text-[11px] text-[#7A6B84]">
              For {formData.guestCount} guests (≈ {formatINR(Math.round(budget.totalBudget / (formData.guestCount || 1)))}/head)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE0D1]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8A7A96]">Currently Allocated</span>
            <p className={`text-2xl font-extrabold mt-1 ${isOverBudget ? 'text-rose-600' : 'text-[#7C3AED]'}`}>
              {formatINR(totalAllocated)}
            </p>
            <span className="text-[11px] text-[#7A6B84]">
              Across {budget.items.length} celebration categories
            </span>
          </div>

          <div className={`p-4 rounded-2xl border ${
            isOverBudget
              ? 'bg-rose-50 border-rose-200'
              : remainingBudget > 0
              ? 'bg-amber-50 border-amber-200'
              : 'bg-emerald-50 border-emerald-200'
          }`}>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8A7A96]">
              {isOverBudget ? 'Over Budget By' : remainingBudget > 0 ? 'Unallocated Reserve' : 'Budget Balance'}
            </span>
            <p className={`text-2xl font-extrabold mt-1 ${
              isOverBudget ? 'text-rose-600' : remainingBudget > 0 ? 'text-amber-700' : 'text-emerald-700'
            }`}>
              {isOverBudget
                ? `+${formatINR(Math.abs(remainingBudget))}`
                : remainingBudget > 0
                ? formatINR(remainingBudget)
                : '100% Balanced'}
            </p>
            <span className="text-[11px] text-[#7A6B84] flex items-center gap-1 mt-0.5">
              {isOverBudget ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 inline" />
                  <span>Exceeds target budget. Click Auto-Balance to trim.</span>
                </>
              ) : remainingBudget > 0 ? (
                <span>Reserve ready to assign or save.</span>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                  <span>Sum strictly equals user budget.</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Visual Allocation Bar */}
        <div className="mt-8">
          <div className="flex items-center justify-between text-xs font-bold text-[#574861] mb-2">
            <span>Visual Category Allocation</span>
            <span>{Math.round((totalAllocated / budget.totalBudget) * 100)}% of Total</span>
          </div>

          {/* Stacked Percentage Bar */}
          <div className="w-full h-4 rounded-full overflow-hidden flex bg-[#EAE2D5] shadow-inner">
            {budget.items.map((item) => {
              const pct = (item.allocatedAmount / (totalAllocated || 1)) * 100;
              if (pct <= 0) return null;
              const color = CATEGORY_COLORS[item.category] || { hex: '#94A3B8' };
              return (
                <div
                  key={item.id}
                  style={{ width: `${pct}%`, backgroundColor: color.hex }}
                  title={`${item.category}: ${formatINR(item.allocatedAmount)} (${Math.round(pct)}%)`}
                  className="h-full transition-all duration-300 hover:opacity-85"
                />
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-3">
            {budget.items.map((item) => {
              const color = CATEGORY_COLORS[item.category] || { bg: 'bg-slate-100', text: 'text-slate-700' };
              return (
                <div key={item.id} className="flex items-center gap-1.5 text-xs text-[#5D4E67]">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: CATEGORY_COLORS[item.category]?.hex || '#94A3B8' }}
                  />
                  <span className="font-medium">{item.category}</span>
                  <span className="text-[11px] text-[#8E8098]">
                    ({item.percentage || Math.round((item.allocatedAmount / budget.totalBudget) * 100)}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Itemized Budget Breakdown Table / Cards */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#E9DFCE] shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif-luxury text-2xl font-bold text-[#271E30]">
            Itemized Expense Breakdown & Sliders
          </h3>
          <span className="text-xs text-[#7D6D86]">
            Use sliders to fine-tune allocations in real time.
          </span>
        </div>

        <div className="space-y-4">
          {budget.items.map((item) => {
            const isEditing = editingId === item.id;
            const pct = Math.round((item.allocatedAmount / budget.totalBudget) * 100);
            const style = CATEGORY_COLORS[item.category] || { bg: 'bg-slate-100', text: 'text-slate-800' };

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-[#EAE1D2] bg-[#FAF8F5] hover:bg-white transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="md:w-1/3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${style.bg} ${style.text}`}>
                      {item.category}
                    </span>
                    <span className="text-xs font-semibold text-[#8C7D96]">
                      {pct}% of budget
                    </span>
                  </div>
                  <p className="text-xs text-[#584962] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Slider & Input Controller */}
                <div className="md:w-1/3 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#7A6A84] font-medium">Allocated:</span>
                    <span className="font-extrabold text-[#271E30] text-sm">
                      {formatINR(item.allocatedAmount)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={budget.totalBudget * 0.7}
                    step="5000"
                    value={item.allocatedAmount}
                    onChange={(e) => handleItemAmountChange(item.id, Number(e.target.value))}
                    className="w-full accent-[#D4AF37] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#9A8C9E]">
                    <span>₹0</span>
                    <span>Max {formatINR(Math.round(budget.totalBudget * 0.7))}</span>
                  </div>
                </div>

                {/* Cost Saving Tip Callout */}
                <div className="md:w-1/3 p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-[#6B501B]">
                  <div className="flex items-center gap-1 font-bold text-[11px] text-[#976A1C] mb-0.5">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>Cost-Saving Secret</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">{item.costSavingTip}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer Footer */}
        <div className="mt-8 p-4 rounded-2xl bg-[#F6EFE3] border border-[#E8DFC9] flex items-start gap-3 text-xs text-[#6B5A76]">
          <Info className="w-4 h-4 text-[#B78628] shrink-0 mt-0.5" />
          <p>
            <strong>Note on Estimates:</strong> These figures are intelligent algorithmic benchmarks based on contemporary venue rates, culinary per-plate pricing, and decorator standards. Actual quotes may fluctuate depending on seasonal peak auspicious dates (muhurat) and specific vendor negotiations.
          </p>
        </div>
      </div>
    </div>
  );
};
