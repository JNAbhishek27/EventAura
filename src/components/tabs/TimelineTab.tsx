import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  UserCheck,
  Sparkles,
  MapPin,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { EventPlan, ScheduleItem } from '../../types/event';

interface TimelineTabProps {
  plan: EventPlan;
  onUpdatePlan: (updatedPlan: EventPlan) => void;
  onOpenAssistant: () => void;
}

export const TimelineTab: React.FC<TimelineTabProps> = ({
  plan,
  onUpdatePlan,
  onOpenAssistant,
}) => {
  const { timeline, formData } = plan;

  // Track completed prep tasks in state/plan
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [newScheduleTime, setNewScheduleTime] = useState('06:00 PM');
  const [newScheduleTitle, setNewScheduleTitle] = useState('');
  const [newScheduleActivity, setNewScheduleActivity] = useState('');
  const [newScheduleResponsible, setNewScheduleResponsible] = useState('Emcee / Coordinator');

  const toggleTask = (taskKey: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskKey]: !prev[taskKey],
    }));
  };

  const handleAddScheduleItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScheduleTitle.trim()) return;

    const newItem: ScheduleItem = {
      time: newScheduleTime.trim(),
      title: newScheduleTitle.trim(),
      activity: newScheduleActivity.trim() || newScheduleTitle.trim(),
      responsible: newScheduleResponsible.trim(),
    };

    onUpdatePlan({
      ...plan,
      timeline: {
        ...timeline,
        daySchedule: [...timeline.daySchedule, newItem],
      },
    });

    setNewScheduleTitle('');
    setNewScheduleActivity('');
    setShowAddScheduleModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Preparation Roadmap Header */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#E9DFCE] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0E8DC]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3E8FF] text-xs font-bold text-[#6D28D9] mb-2">
              <CalendarDays className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>Milestone Preparation Roadmap</span>
            </div>
            <h2 className="font-serif-luxury text-3xl font-bold text-[#271E30]">
              Planning Countdown: Step-by-Step
            </h2>
            <p className="text-xs sm:text-sm text-[#73637C] mt-1">
              Phased action checkpoints leading up to your celebration date.
            </p>
          </div>

          <button
            onClick={onOpenAssistant}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#D9CEBC] bg-white text-[#4D3F57] hover:bg-[#FAF4EB] transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#9F7AEA]" />
            <span>Customize Timeline with AI</span>
          </button>
        </div>

        {/* Preparation Phases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6">
          {timeline.prepTimeline.map((phase, pIndex) => (
            <div
              key={pIndex}
              className="p-5 rounded-2xl border border-[#EAE1D2] bg-[#FAF8F5] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#EFE3CF] text-[#7A5314]">
                    {phase.phase}
                  </span>
                  <span className="text-[11px] text-[#8E8097]">
                    {phase.tasks.filter((t, idx) => completedTasks[`${pIndex}-${idx}`]).length}/{phase.tasks.length} Done
                  </span>
                </div>

                <div className="space-y-2.5">
                  {phase.tasks.map((task, tIndex) => {
                    const taskKey = `${pIndex}-${tIndex}`;
                    const isDone = !!completedTasks[taskKey];
                    return (
                      <div
                        key={tIndex}
                        onClick={() => toggleTask(taskKey)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-start gap-2.5 ${
                          isDone
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800 line-through opacity-75'
                            : 'bg-white border-[#E5DAC8] text-[#3D3147] hover:bg-[#FDF9F2]'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-4 h-4 text-[#C1B2A1] shrink-0 mt-0.5" />
                        )}
                        <span className="leading-relaxed">{task}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Hour-by-Hour Day-Of Schedule */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#E9DFCE] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF3C7] text-xs font-bold text-[#92400E] mb-2">
              <Clock className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Day-Of Run of Show</span>
            </div>
            <h3 className="font-serif-luxury text-3xl font-bold text-[#271E30]">
              Hour-by-Hour Event Day Schedule
            </h3>
            <p className="text-xs sm:text-sm text-[#73637C] mt-1">
              Synchronized sequence of events to keep hosts, coordinators, and vendors on schedule.
            </p>
          </div>

          <button
            onClick={() => setShowAddScheduleModal(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B78628] text-white shadow-xs hover:brightness-105 transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Schedule Item</span>
          </button>
        </div>

        {/* Timeline list */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-[#EADFCF] space-y-6 my-4">
          {timeline.daySchedule.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Dot on Timeline */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#D4AF37] border-2 border-white shadow-xs group-hover:scale-125 transition" />

              <div className="p-4 rounded-2xl border border-[#E8DEC9] bg-[#FAF8F5] group-hover:bg-white group-hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[#FAF0E6] text-[#7A561C] border border-[#E8DFC9]">
                      {item.time}
                    </span>
                    <h4 className="font-serif-luxury text-lg font-bold text-[#271E30]">
                      {item.title}
                    </h4>
                  </div>

                  <div className="inline-flex items-center gap-1.5 text-xs text-[#7A6B84] px-2.5 py-0.5 rounded-full bg-white border border-[#E2D6C4]">
                    <UserCheck className="w-3.5 h-3.5 text-[#9F7AEA]" />
                    <span>Lead: <strong>{item.responsible}</strong></span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#5B4B67] leading-relaxed">
                  {item.activity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Custom Schedule Item Modal */}
      {showAddScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FAF7F2] rounded-3xl p-6 max-w-md w-full border border-[#E5DAC8] shadow-2xl">
            <h3 className="font-serif-luxury text-2xl font-bold text-[#271E30] mb-3">
              Add Schedule Milestone
            </h3>
            <form onSubmit={handleAddScheduleItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#564860] mb-1">Time</label>
                <input
                  type="text"
                  value={newScheduleTime}
                  onChange={(e) => setNewScheduleTime(e.target.value)}
                  placeholder="e.g. 07:15 PM"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9CDBA] bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#564860] mb-1">Title</label>
                <input
                  type="text"
                  value={newScheduleTitle}
                  onChange={(e) => setNewScheduleTitle(e.target.value)}
                  placeholder="e.g. Couple Grand Dance Entry"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9CDBA] bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#564860] mb-1">Activity Detail</label>
                <textarea
                  value={newScheduleActivity}
                  onChange={(e) => setNewScheduleActivity(e.target.value)}
                  placeholder="Detailed description of what happens during this time..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9CDBA] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#564860] mb-1">Responsible Lead</label>
                <input
                  type="text"
                  value={newScheduleResponsible}
                  onChange={(e) => setNewScheduleResponsible(e.target.value)}
                  placeholder="e.g. Wedding Planner / Sister / DJ"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D9CDBA] bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddScheduleModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#D9CDBA] bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-[#D4AF37] text-white hover:brightness-105"
                >
                  Save to Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
