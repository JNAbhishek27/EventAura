import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  Circle,
  Plus,
  IndianRupee,
  Calendar,
  Filter,
  Sparkles,
  Clock,
  Trash2,
} from 'lucide-react';
import { EventPlan, VendorChecklistItem } from '../../types/event';
import { formatINR } from '../../utils/formatters';

interface VendorChecklistTabProps {
  plan: EventPlan;
  onUpdatePlan: (updatedPlan: EventPlan) => void;
  onOpenAssistant: () => void;
}

export const VendorChecklistTab: React.FC<VendorChecklistTabProps> = ({
  plan,
  onUpdatePlan,
  onOpenAssistant,
}) => {
  const { vendorChecklist } = plan;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form state
  const [newTaskCategory, setNewTaskCategory] = useState<VendorChecklistItem['category']>('Decoration');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCost, setNewTaskCost] = useState<number>(15000);
  const [newTaskDeadline, setNewTaskDeadline] = useState('10 Days Before');
  const [newTaskNotes, setNewTaskNotes] = useState('');

  const completedCount = vendorChecklist.filter((v) => v.completed).length;
  const completionPercentage = Math.round((completedCount / (vendorChecklist.length || 1)) * 100);

  const categories = ['All', 'Venue', 'Catering', 'Decoration', 'Photography', 'Entertainment', 'Stylist & Makeup', 'Logistics'];

  const filteredItems = selectedCategory === 'All'
    ? vendorChecklist
    : vendorChecklist.filter((v) => v.category === selectedCategory);

  const handleToggleCompleted = (id: string) => {
    const updated = vendorChecklist.map((item) => {
      if (item.id === id) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });

    onUpdatePlan({
      ...plan,
      vendorChecklist: updated,
    });
  };

  const handleDeleteItem = (id: string) => {
    const updated = vendorChecklist.filter((item) => item.id !== id);
    onUpdatePlan({
      ...plan,
      vendorChecklist: updated,
    });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newItem: VendorChecklistItem = {
      id: `v_${Date.now()}`,
      category: newTaskCategory,
      task: newTaskTitle.trim(),
      estimatedCost: Number(newTaskCost) || 0,
      deadline: newTaskDeadline.trim(),
      completed: false,
      notes: newTaskNotes.trim() || undefined,
    };

    onUpdatePlan({
      ...plan,
      vendorChecklist: [...vendorChecklist, newItem],
    });

    setNewTaskTitle('');
    setNewTaskNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#E9DFCE] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#F0E8DC]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCFCE7] text-xs font-bold text-[#15803D] mb-2">
              <Layers className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Vendor Procurement & Execution</span>
            </div>
            <h2 className="font-serif-luxury text-3xl font-bold text-[#271E30]">
              Vendor Coordination Checklist
            </h2>
            <p className="text-xs sm:text-sm text-[#73637C] mt-1">
              Deliverables, milestone contract dates, and approximate budgets for each service provider.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B78628] text-white shadow-xs hover:brightness-105 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Task</span>
            </button>

            <button
              onClick={onOpenAssistant}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#D9CEBC] bg-white text-[#4D3F57] hover:bg-[#FAF4EB] transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#9F7AEA]" />
              <span>Find Vendor Ideas</span>
            </button>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="pt-6">
          <div className="flex items-center justify-between text-xs font-bold text-[#54465E] mb-2">
            <span>Overall Readiness Progress</span>
            <span className="text-[#16A34A]">
              {completedCount} of {vendorChecklist.length} Items Done ({completionPercentage}%)
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-[#EAE2D5] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#059669] transition-all duration-500 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-[#271E30] text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-[#695A73] border border-[#E5DAC8] hover:bg-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Checklist Items List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 rounded-3xl bg-white border border-[#E9DFCE] text-[#7A6A83] text-sm">
            No vendor checklist items found for category "{selectedCategory}".
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                item.completed
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : 'bg-white border-[#E9DFCE] hover:shadow-xs'
              }`}
            >
              {/* Left Checkbox & Info */}
              <div className="flex items-start gap-3.5 flex-1">
                <button
                  type="button"
                  onClick={() => handleToggleCompleted(item.id)}
                  className="mt-0.5 text-slate-400 hover:text-emerald-600 transition shrink-0"
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#C8BBAA] hover:text-[#7C3AED]" />
                  )}
                </button>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FAF0E6] text-[#7B571B] border border-[#EAE0D1]">
                      {item.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#7A6B84]">
                      <Clock className="w-3 h-3 text-[#9F7AEA]" />
                      <span>Deadline: {item.deadline}</span>
                    </span>
                  </div>

                  <h4 className={`text-sm sm:text-base font-bold ${item.completed ? 'text-slate-500 line-through' : 'text-[#271E30]'}`}>
                    {item.task}
                  </h4>

                  {item.notes && (
                    <p className="text-xs text-[#6B5A76] mt-1 leading-relaxed">
                      💡 {item.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Estimated Cost & Delete */}
              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0E8DC]">
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#93839D] block">Est. Cost</span>
                  <span className="text-sm font-extrabold text-[#B78628]">
                    {formatINR(item.estimatedCost)}
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteItem(item.id)}
                  title="Remove task"
                  className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FAF7F2] rounded-3xl p-6 max-w-md w-full border border-[#E5DAC8] shadow-2xl">
            <h3 className="font-serif-luxury text-2xl font-bold text-[#271E30] mb-3">
              Add Vendor Deliverable
            </h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#564860] mb-1">Category</label>
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9CDBA] bg-white"
                >
                  <option value="Venue">Venue</option>
                  <option value="Catering">Catering</option>
                  <option value="Decoration">Decoration</option>
                  <option value="Photography">Photography</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Stylist & Makeup">Stylist & Makeup</option>
                  <option value="Invitations & Favors">Invitations & Favors</option>
                  <option value="Logistics">Logistics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#564860] mb-1">Task Description</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Confirm acoustic sound curfew permit"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9CDBA] bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#564860] mb-1">Estimated Cost (₹)</label>
                  <input
                    type="number"
                    value={newTaskCost}
                    onChange={(e) => setNewTaskCost(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9CDBA] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#564860] mb-1">Target Deadline</label>
                  <input
                    type="text"
                    value={newTaskDeadline}
                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                    placeholder="e.g. 15 Days Before"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9CDBA] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#564860] mb-1">Notes / Requirements</label>
                <input
                  type="text"
                  value={newTaskNotes}
                  onChange={(e) => setNewTaskNotes(e.target.value)}
                  placeholder="e.g. Check power cable extension availability"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9CDBA] bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#D9CDBA] bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-[#D4AF37] text-white hover:brightness-105"
                >
                  Add to Checklist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
