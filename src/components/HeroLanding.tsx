import React from 'react';
import {
  Sparkles,
  HeartHandshake,
  Cake,
  GlassWater,
  Briefcase,
  Users,
  Compass,
  CheckCircle2,
  CalendarDays,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  Palette,
  Clock,
  Coins,
} from 'lucide-react';
import { EventType } from '../types/event';

interface HeroLandingProps {
  onSelectCategory: (type: EventType) => void;
  onOpenPlanner: () => void;
  onLoadSample: (key: string) => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onSelectCategory,
  onOpenPlanner,
  onLoadSample,
}) => {
  const categories = [
    {
      type: 'wedding' as EventType,
      title: 'Weddings',
      subtitle: 'Royal mandaps, pheras, lavish banquets & sangeet nights',
      icon: HeartHandshake,
      badge: 'Most Popular',
      accent: 'from-[#FAF0E6] to-[#FCE7F3]',
      border: 'border-[#F472B6]/30',
      iconColor: 'text-[#DB2777]',
      budgetHint: 'Typical: ₹5L - ₹50L+',
    },
    {
      type: 'birthday' as EventType,
      title: 'Birthday Parties',
      subtitle: 'Milestone 1st, 18th, 30th & 50th rooftop & theme soirées',
      icon: Cake,
      badge: 'High Energy',
      accent: 'from-[#F3E8FF] to-[#EDE9FE]',
      border: 'border-[#A855F7]/30',
      iconColor: 'text-[#9333EA]',
      budgetHint: 'Typical: ₹30K - ₹5L',
    },
    {
      type: 'anniversary' as EventType,
      title: 'Anniversaries',
      subtitle: 'Silver, golden & ruby jubilees with intimate nostalgia',
      icon: GlassWater,
      badge: 'Timeless Romance',
      accent: 'from-[#FEF3C7] to-[#FDE68A]/40',
      border: 'border-[#F59E0B]/30',
      iconColor: 'text-[#D97706]',
      budgetHint: 'Typical: ₹1L - ₹10L',
    },
    {
      type: 'corporate' as EventType,
      title: 'Corporate Events',
      subtitle: 'Annual summits, product launches, galas & award ceremonies',
      icon: Briefcase,
      badge: 'Executive Class',
      accent: 'from-[#E0F2FE] to-[#EFF6FF]',
      border: 'border-[#38BDF8]/30',
      iconColor: 'text-[#0284C7]',
      budgetHint: 'Typical: ₹2L - ₹25L+',
    },
    {
      type: 'community' as EventType,
      title: 'Community & Festivals',
      subtitle: 'Diwali, Dandiya, Christmas, cultural galas & society meets',
      icon: Users,
      badge: 'Grand Celebrations',
      accent: 'from-[#DCFCE7] to-[#F0FDF4]',
      border: 'border-[#4ADE80]/30',
      iconColor: 'text-[#16A34A]',
      budgetHint: 'Typical: ₹1L - ₹15L',
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-[#E8DEF8]/50 via-[#FDF3D8]/60 to-[#FCE7F3]/40 blur-3xl -z-10 rounded-full pointer-events-none" />

      {/* Hero Content Section */}
      <section className="pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Floating Pill Tagline */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF0E6] border border-[#E9D9C3] shadow-xs mb-6 text-xs sm:text-sm font-semibold text-[#6B4F20] animate-in fade-in duration-500">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>Every Celebration Deserves a Perfect Plan.</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif-luxury text-4xl sm:text-6xl lg:text-7xl font-bold text-[#271E30] tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Intelligent Event Planning,{' '}
          <span className="bg-gradient-to-r from-[#9F7AEA] via-[#D4AF37] to-[#C99E25] bg-clip-text text-transparent">
            Crafted for Perfection.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-[#62536B] max-w-2xl mx-auto font-normal leading-relaxed">
          From royal weddings and milestone birthdays to corporate galas. EventAura harnesses Google Gemini AI to architect bespoke themes, strict budget allocations in ₹ INR, day schedules, and vendor checklists in seconds.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenPlanner}
            className="w-full sm:w-auto px-8 py-4 text-base sm:text-lg font-bold rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#E2C359] to-[#C09623] text-white shadow-xl shadow-[#D4AF37]/35 hover:shadow-2xl hover:brightness-105 active:scale-[0.99] transition flex items-center justify-center gap-3 group"
          >
            <span>Plan My Event</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </button>

          <button
            onClick={() => onLoadSample('wedding')}
            className="w-full sm:w-auto px-6 py-4 text-sm sm:text-base font-semibold rounded-2xl bg-white/80 backdrop-blur-xs border border-[#D9D0C1] text-[#3E3349] hover:bg-white hover:border-[#BFA97D] shadow-sm hover:shadow-md transition flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-[#9F7AEA]" />
            <span>Explore Royal Wedding Demo</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-medium text-[#7A6B82]">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-[#D4AF37]" />
            <span>Strict Budget Control in ₹ INR</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#9F7AEA]" />
            <span>Hour-by-Hour Day Timelines</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>Actionable Vendor Checklists</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#EC4899]" />
            <span>Conversational AI Assistant</span>
          </div>
        </div>
      </section>

      {/* Celebration Category Cards Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#271E30]">
            Select Your Celebration
          </h2>
          <p className="text-sm sm:text-base text-[#6B5C74] mt-2">
            Choose an event type to start with tailored templates, budget formulas, and curated concepts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.type}
                onClick={() => onSelectCategory(cat.type)}
                className={`group cursor-pointer rounded-2xl p-5 border ${cat.border} bg-white hover:bg-gradient-to-b ${cat.accent} shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-white shadow-xs border border-slate-100 flex items-center justify-center ${cat.iconColor} group-hover:scale-110 transition`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100/90 text-slate-600 group-hover:bg-white group-hover:text-slate-800 transition">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="font-serif-luxury text-xl font-bold text-[#271E30] group-hover:text-[#181121] transition">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#6B5C74] mt-2 leading-relaxed">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-medium text-[#8F7F98]">
                    {cat.budgetHint}
                  </span>
                  <span className="font-bold text-[#7C3AED] group-hover:translate-x-1 transition flex items-center gap-0.5">
                    Plan <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-br from-[#FAF3EA] via-white to-[#F4EFFC] p-8 sm:p-12 border border-[#E8DFC9] shadow-sm">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B78628]">
              Comprehensive Intelligence
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#271E30] mt-2">
              Everything Needed for a Flawless Celebration
            </h2>
            <p className="text-sm sm:text-base text-[#6B5C74] mt-3">
              EventAura doesn’t just give vague tips. You get a rigorous, editable, full-scope blueprint with realistic figures and actionable workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-6 border border-[#E9E0D2] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#FAF0E6] flex items-center justify-center text-[#B78628] mb-4">
                <Palette className="w-5 h-5" />
              </div>
              <h4 className="font-serif-luxury text-lg font-bold text-[#271E30]">
                A. Concept & Moodboard
              </h4>
              <p className="text-xs sm:text-sm text-[#6B5C74] mt-2 leading-relaxed">
                Unique narrative theme, harmonized 4-shade hex color palettes, and focal entryway, mandap, or stage decoration blueprints.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-6 border border-[#E9E0D2] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] flex items-center justify-center text-[#7C3AED] mb-4">
                <Coins className="w-5 h-5" />
              </div>
              <h4 className="font-serif-luxury text-lg font-bold text-[#271E30]">
                B. Balanced Budget in ₹ INR
              </h4>
              <p className="text-xs sm:text-sm text-[#6B5C74] mt-2 leading-relaxed">
                Meticulous venue, catering, decor, and photography breakdown that guarantees the sum never exceeds your stipulated spending ceiling.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-6 border border-[#E9E0D2] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center text-[#D97706] mb-4">
                <CalendarDays className="w-5 h-5" />
              </div>
              <h4 className="font-serif-luxury text-lg font-bold text-[#271E30]">
                C. Timelines & Day Schedule
              </h4>
              <p className="text-xs sm:text-sm text-[#6B5C74] mt-2 leading-relaxed">
                30-day, 15-day, 7-day preparation milestones paired with an exact minute-by-minute day schedule detailing responsibilities.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-6 border border-[#E9E0D2] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#16A34A] mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="font-serif-luxury text-lg font-bold text-[#271E30]">
                D. Interactive Vendor Checklist
              </h4>
              <p className="text-xs sm:text-sm text-[#6B5C74] mt-2 leading-relaxed">
                Pre-populated tasks across caterers, sound, decorators, photographers, and makeup artists with progress tracking and custom additions.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-6 border border-[#E9E0D2] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] flex items-center justify-center text-[#0284C7] mb-4">
                <TrendingDown className="w-5 h-5" />
              </div>
              <h4 className="font-serif-luxury text-lg font-bold text-[#271E30]">
                E. Food, Games & Savings
              </h4>
              <p className="text-xs sm:text-sm text-[#6B5C74] mt-2 leading-relaxed">
                Signature menus (welcome drinks to desserts), icebreaker games, guest hospitality touches, and smart cost-cutting suggestions.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-6 border border-[#E9E0D2] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9F7AEA] to-[#D4AF37] flex items-center justify-center text-white mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-serif-luxury text-lg font-bold text-[#271E30]">
                Live Conversational Copilot
              </h4>
              <p className="text-xs sm:text-sm text-[#6B5C74] mt-2 leading-relaxed">
                Ask in plain English: "Reduce decor by ₹10,000" or "Make the menu pure vegetarian" and watch your live plan update immediately!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
