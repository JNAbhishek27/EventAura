import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { EventPlan, EventFormData, EventType } from './types/event';
import { SAMPLE_PLANS } from './data/samplePlans';
import { Navbar } from './components/Navbar';
import { HeroLanding } from './components/HeroLanding';
import { EventPlannerModal } from './components/EventPlannerModal';
import { PlanDashboard } from './components/PlanDashboard';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { PrintableReport } from './components/PrintableReport';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [currentPlan, setCurrentPlan] = useState<EventPlan | null>(() => {
    try {
      const saved = localStorage.getItem('eventaura_active_plan');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not restore cached plan', e);
    }
    return null;
  });

  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [plannerCategory, setPlannerCategory] = useState<EventType>('wedding');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegeneratingSection, setIsRegeneratingSection] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      if (currentPlan) {
        localStorage.setItem('eventaura_active_plan', JSON.stringify(currentPlan));
      }
    } catch (e) {
      console.warn('Local storage write error', e);
    }
  }, [currentPlan]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Generate Plan API Handler
  const handleGeneratePlan = async (formData: EventFormData) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`Failed to generate plan: ${res.statusText}`);
      }

      const data = await res.json();
      if (!data.plan) {
        throw new Error('No plan returned from AI planner.');
      }

      setCurrentPlan(data.plan);
      setIsPlannerOpen(false);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#9F7AEA', '#F59E0B', '#E8DEF8'],
        });
      } catch (err) {
        // Safe if canvas-confetti is not rendered
      }

      showToast(
        data.isOfflineFallback
          ? 'Event plan generated with intelligent baseline template!'
          : 'Bespoke event plan successfully crafted with Gemini AI!',
        'success'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error generating event plan:', err);
      showToast(err?.message || 'Error communicating with AI service. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Load sample plan
  const handleLoadSample = (sampleKey: string) => {
    const sample = SAMPLE_PLANS[sampleKey] || SAMPLE_PLANS['wedding'];
    if (sample) {
      setCurrentPlan(sample);
      showToast(`Loaded ${sample.formData.eventName || 'sample plan'}!`, 'info');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Select category from landing page
  const handleSelectCategory = (type: EventType) => {
    setPlannerCategory(type);
    setIsPlannerOpen(true);
  };

  // Regenerate individual section
  const handleRegenerateSection = async (section: string) => {
    if (!currentPlan) return;
    setIsRegeneratingSection(section);
    try {
      const res = await fetch('/api/plan/regenerate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPlan, section }),
      });

      if (!res.ok) throw new Error('Failed to regenerate section');

      const data = await res.json();
      if (data.updatedPlan) {
        setCurrentPlan(data.updatedPlan);
        showToast(`Refreshed ${section} with new ideas!`, 'success');
      }
    } catch (err: any) {
      console.error('Error regenerating section:', err);
      showToast('Could not regenerate section. Please try again.', 'error');
    } finally {
      setIsRegeneratingSection(null);
    }
  };

  // Browser print trigger
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2D2438]">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-bold ${
            toast.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-700'
              : toast.type === 'error'
              ? 'bg-rose-900 text-white border-rose-700'
              : 'bg-slate-900 text-white border-slate-700'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            ) : (
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        currentPlan={currentPlan}
        onOpenPlanner={() => {
          setPlannerCategory('wedding');
          setIsPlannerOpen(true);
        }}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onLoadSample={handleLoadSample}
        onPrint={handlePrint}
        onResetToLanding={() => setCurrentPlan(null)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPlan ? (
          <PlanDashboard
            plan={currentPlan}
            onUpdatePlan={(updated) => {
              setCurrentPlan(updated);
              showToast('Plan updated in real-time!', 'info');
            }}
            onOpenPlanner={() => setIsPlannerOpen(true)}
            onOpenAssistant={() => setIsAssistantOpen(true)}
            onPrint={handlePrint}
            onRegenerateSection={handleRegenerateSection}
            isRegeneratingSection={isRegeneratingSection}
            onResetToLanding={() => setCurrentPlan(null)}
          />
        ) : (
          <HeroLanding
            onSelectCategory={handleSelectCategory}
            onOpenPlanner={() => {
              setPlannerCategory('wedding');
              setIsPlannerOpen(true);
            }}
            onLoadSample={handleLoadSample}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-[#E8DEC9] py-8 bg-[#FAF7F2] text-center text-xs text-[#7A6A83] mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif-luxury font-bold text-base text-[#271E30]">EventAura</span>
            <span className="text-[#A293A9]">•</span>
            <span>Every Celebration Deserves a Perfect Plan</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#867590]">
            <span>Powered by Google Gemini AI</span>
            <span>•</span>
            <span>Strict Budget Control in ₹ INR</span>
            <span>•</span>
            <span>Weddings, Birthdays, Anniversaries, Corporate</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <EventPlannerModal
        isOpen={isPlannerOpen}
        onClose={() => setIsPlannerOpen(false)}
        onSubmit={handleGeneratePlan}
        initialType={plannerCategory}
        isGenerating={isGenerating}
      />

      {currentPlan && (
        <AiAssistantDrawer
          isOpen={isAssistantOpen}
          onClose={() => setIsAssistantOpen(false)}
          currentPlan={currentPlan}
          onUpdatePlan={(updated) => {
            setCurrentPlan(updated);
            showToast('Plan synchronized with AI Assistant!', 'success');
          }}
        />
      )}

      {/* Printable Report Component (shown only in print media) */}
      {currentPlan && <PrintableReport plan={currentPlan} />}
    </div>
  );
}
