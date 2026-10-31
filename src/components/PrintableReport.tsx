import React from 'react';
import { EventPlan } from '../types/event';
import { formatINR, formatDate } from '../utils/formatters';
import { Sparkles, CheckCircle2, Clock, MapPin, Calendar, Users, Coins } from 'lucide-react';

interface PrintableReportProps {
  plan: EventPlan;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({ plan }) => {
  const { formData, concept, budget, timeline, vendorChecklist, recommendations } = plan;

  return (
    <div className="hidden print:block p-8 bg-white text-black font-sans max-w-4xl mx-auto space-y-8">
      {/* Print Header */}
      <div className="border-b-2 border-[#D4AF37] pb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B78628]">
            <Sparkles className="w-4 h-4" />
            <span>EventAura Comprehensive Celebration Blueprint</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-1">
            {formData.eventName || concept.themeTitle}
          </h1>
          <p className="text-sm italic text-slate-600 mt-0.5">
            "{concept.tagline}"
          </p>
        </div>

        <div className="text-right text-xs text-slate-500">
          <p className="font-semibold text-slate-800">Generated for Host</p>
          <p>{formatDate(new Date().toISOString())}</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4 p-4 border border-slate-200 rounded-lg text-xs bg-slate-50">
        <div>
          <span className="text-slate-500 font-medium">Event Type & Style</span>
          <p className="font-bold text-slate-800 capitalize mt-0.5">{formData.eventType} ({formData.eventStyle})</p>
        </div>
        <div>
          <span className="text-slate-500 font-medium">Date & Location</span>
          <p className="font-bold text-slate-800 mt-0.5">{formatDate(formData.eventDate)} • {formData.eventLocation}</p>
        </div>
        <div>
          <span className="text-slate-500 font-medium">Guest Headcount</span>
          <p className="font-bold text-slate-800 mt-0.5">{formData.guestCount} Guests</p>
        </div>
        <div>
          <span className="text-slate-500 font-medium">Total Spending Budget</span>
          <p className="font-bold text-slate-900 mt-0.5">{formatINR(budget.totalBudget)} INR</p>
        </div>
      </div>

      {/* 1. Concept & Palette */}
      <div>
        <h2 className="text-xl font-serif font-bold border-b border-slate-200 pb-1 mb-3 text-slate-900">
          1. Theme & Color Atmosphere
        </h2>
        <p className="text-xs text-slate-700 leading-relaxed mb-4">{concept.story}</p>

        <div className="grid grid-cols-4 gap-3">
          {concept.colorPalette.map((c, i) => (
            <div key={i} className="p-2 border border-slate-200 rounded text-xs">
              <div className="w-full h-8 rounded mb-1" style={{ backgroundColor: c.hex, border: '1px solid #ddd' }} />
              <p className="font-bold text-slate-800">{c.name}</p>
              <p className="text-[10px] text-slate-500 font-mono">{c.hex}</p>
              <p className="text-[10px] text-slate-600 mt-0.5">{c.usage}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Budget Allocation */}
      <div className="break-before-auto">
        <h2 className="text-xl font-serif font-bold border-b border-slate-200 pb-1 mb-3 text-slate-900">
          2. Itemized Budget Allocation (Strict Total: {formatINR(budget.totalBudget)})
        </h2>
        <table className="w-full text-xs text-left border-collapse border border-slate-200">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <th className="p-2 border border-slate-200">Category</th>
              <th className="p-2 border border-slate-200">Share</th>
              <th className="p-2 border border-slate-200">Allocated Amount</th>
              <th className="p-2 border border-slate-200">Description</th>
              <th className="p-2 border border-slate-200">Cost Saving Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {budget.items.map((item) => (
              <tr key={item.id} className="border-b border-slate-200">
                <td className="p-2 font-bold border border-slate-200">{item.category}</td>
                <td className="p-2 border border-slate-200">{item.percentage}%</td>
                <td className="p-2 font-bold border border-slate-200">{formatINR(item.allocatedAmount)}</td>
                <td className="p-2 border border-slate-200 text-slate-700">{item.description}</td>
                <td className="p-2 border border-slate-200 text-slate-600 italic">{item.costSavingTip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. Event Day Schedule */}
      <div className="break-before-auto">
        <h2 className="text-xl font-serif font-bold border-b border-slate-200 pb-1 mb-3 text-slate-900">
          3. Event Day Run-of-Show Schedule
        </h2>
        <div className="space-y-2">
          {timeline.daySchedule.map((s, idx) => (
            <div key={idx} className="flex items-start gap-3 p-2 border border-slate-100 rounded text-xs">
              <span className="font-mono font-bold text-slate-800 w-20 shrink-0">{s.time}</span>
              <div className="flex-1">
                <strong className="text-slate-900">{s.title}</strong>: {s.activity}
              </div>
              <span className="text-slate-500 text-[11px] shrink-0">Lead: {s.responsible}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Vendor Checklist */}
      <div className="break-before-auto">
        <h2 className="text-xl font-serif font-bold border-b border-slate-200 pb-1 mb-3 text-slate-900">
          4. Vendor Checklist & Procurement
        </h2>
        <table className="w-full text-xs text-left border-collapse border border-slate-200">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <th className="p-2 border border-slate-200 w-12 text-center">Done</th>
              <th className="p-2 border border-slate-200">Category</th>
              <th className="p-2 border border-slate-200">Task</th>
              <th className="p-2 border border-slate-200">Target Deadline</th>
              <th className="p-2 border border-slate-200">Estimated Cost</th>
            </tr>
          </thead>
          <tbody>
            {vendorChecklist.map((v) => (
              <tr key={v.id} className="border-b border-slate-200">
                <td className="p-2 border border-slate-200 text-center">{v.completed ? '[X]' : '[ ]'}</td>
                <td className="p-2 font-bold border border-slate-200">{v.category}</td>
                <td className="p-2 border border-slate-200">{v.task}</td>
                <td className="p-2 border border-slate-200">{v.deadline}</td>
                <td className="p-2 font-bold border border-slate-200">{formatINR(v.estimatedCost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 5. Food Menu */}
      <div className="break-before-auto">
        <h2 className="text-xl font-serif font-bold border-b border-slate-200 pb-1 mb-3 text-slate-900">
          5. Curated Culinary Menu
        </h2>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <h4 className="font-bold text-slate-800 mb-1">Welcome Drinks</h4>
            <p className="text-slate-600">{recommendations.foodMenu.welcomeDrinks.join(' • ')}</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-1">Appetizers & Starters</h4>
            <p className="text-slate-600">{recommendations.foodMenu.appetizers.join(' • ')}</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-1">Main Course Banquet</h4>
            <p className="text-slate-600">{recommendations.foodMenu.mainCourse.join(' • ')}</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-1">Desserts</h4>
            <p className="text-slate-600">{recommendations.foodMenu.desserts.join(' • ')}</p>
          </div>
        </div>
      </div>

      {/* Print Footer */}
      <div className="pt-6 border-t border-slate-200 text-center text-[10px] text-slate-500">
        Designed by EventAura – Intelligent Celebration Architecture • Powered by Google Gemini AI
      </div>
    </div>
  );
};
