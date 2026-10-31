import React, { useState } from 'react';
import {
  Utensils,
  PartyPopper,
  Music,
  Heart,
  TrendingDown,
  Sparkles,
  RefreshCw,
  Wine,
  Check,
} from 'lucide-react';
import { EventPlan } from '../../types/event';
import { formatINR } from '../../utils/formatters';

interface InspirationTabProps {
  plan: EventPlan;
  onRegenerateSection: (section: string) => Promise<void>;
  onOpenAssistant: () => void;
  isRegeneratingSection: string | null;
}

export const InspirationTab: React.FC<InspirationTabProps> = ({
  plan,
  onRegenerateSection,
  onOpenAssistant,
  isRegeneratingSection,
}) => {
  const { recommendations, formData } = plan;
  const { foodMenu, gamesAndActivities, entertainmentIdeas, guestExperience, costSavingSuggestions } = recommendations;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Food & Culinary Menu */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#E9DFCE] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0E8DC]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0E6] text-xs font-bold text-[#8C6422] mb-2">
              <Utensils className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Gastronomy & Beverage Curation</span>
            </div>
            <h2 className="font-serif-luxury text-3xl font-bold text-[#271E30]">
              Signature Celebration Menu
            </h2>
            <p className="text-xs sm:text-sm text-[#73637C] mt-1">
              Curated for {formData.guestCount} guests matching: <em>"{formData.foodPreferences || 'Standard'}"</em>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onRegenerateSection('foodMenu')}
              disabled={isRegeneratingSection === 'foodMenu'}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-[#D9CEBC] bg-[#FAF7F2] text-[#4A3E56] hover:bg-[#F2ECE1] transition flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegeneratingSection === 'foodMenu' ? 'animate-spin text-[#9F7AEA]' : 'text-[#8C7D96]'}`} />
              <span>{isRegeneratingSection === 'foodMenu' ? 'Regenerating Menu...' : 'Refresh Menu with AI'}</span>
            </button>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-6">
          {/* Welcome Drinks */}
          <div className="p-5 rounded-2xl border border-[#EAE1D2] bg-[#FAF8F5]">
            <div className="flex items-center gap-2 mb-3">
              <Wine className="w-4 h-4 text-[#D97706]" />
              <h4 className="font-serif-luxury text-lg font-bold text-[#271E30]">
                Welcome Drinks
              </h4>
            </div>
            <ul className="space-y-2 text-xs text-[#52445E]">
              {foodMenu.welcomeDrinks.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Appetizers */}
          <div className="p-5 rounded-2xl border border-[#EAE1D2] bg-[#FAF8F5]">
            <div className="flex items-center gap-2 mb-3">
              <Utensils className="w-4 h-4 text-[#10B981]" />
              <h4 className="font-serif-luxury text-lg font-bold text-[#271E30]">
                Appetizers & Starters
              </h4>
            </div>
            <ul className="space-y-2 text-xs text-[#52445E]">
              {foodMenu.appetizers.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Course */}
          <div className="p-5 rounded-2xl border border-[#EAE1D2] bg-[#FAF8F5]">
            <div className="flex items-center gap-2 mb-3">
              <Utensils className="w-4 h-4 text-[#7C3AED]" />
              <h4 className="font-serif-luxury text-lg font-bold text-[#271E30]">
                Main Course Banquet
              </h4>
            </div>
            <ul className="space-y-2 text-xs text-[#52445E]">
              {foodMenu.mainCourse.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Desserts */}
          <div className="p-5 rounded-2xl border border-[#EAE1D2] bg-[#FAF8F5]">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#EC4899]" />
              <h4 className="font-serif-luxury text-lg font-bold text-[#271E30]">
                Artisanal Desserts
              </h4>
            </div>
            <ul className="space-y-2 text-xs text-[#52445E]">
              {foodMenu.desserts.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EC4899] mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Signature Live Station Highlight */}
        {foodMenu.signatureSpecial && (
          <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-[#FAF0E6] via-[#FBF5EC] to-[#F5EFFC] border border-[#E8DEC9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#916723] block">
                Crowd-Favorite Interactive Highlight
              </span>
              <p className="text-sm font-bold text-[#271E30] mt-0.5">
                {foodMenu.signatureSpecial}
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-white border border-[#DFCDB7] text-[#695632] font-semibold self-start sm:self-auto">
              Live Cooking Station
            </span>
          </div>
        )}
      </div>

      {/* 2. Interactive Games & Activities */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#E9DFCE] shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#F0E8DC]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3E8FF] text-xs font-bold text-[#6D28D9] mb-2">
              <PartyPopper className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>Engagement & Icebreakers</span>
            </div>
            <h3 className="font-serif-luxury text-2xl font-bold text-[#271E30]">
              Games & Guest Activities
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {gamesAndActivities.map((game, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-[#EAE1D2] bg-[#FAF8F5] hover:bg-white hover:shadow-xs transition"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#EDE9FE] text-[#6D28D9] mb-2 inline-block">
                {game.targetAudience}
              </span>
              <h4 className="font-serif-luxury text-lg font-bold text-[#271E30]">
                {game.name}
              </h4>
              <p className="text-xs text-[#5D4E67] mt-2 leading-relaxed">
                {game.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Entertainment & Vibe Concepts */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#E9DFCE] shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#F0E8DC]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF3C7] text-xs font-bold text-[#92400E] mb-2">
              <Music className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Atmosphere & Performances</span>
            </div>
            <h3 className="font-serif-luxury text-2xl font-bold text-[#271E30]">
              Entertainment Ideas & Acts
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {entertainmentIdeas.map((act, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-[#EAE1D2] bg-[#FAF8F5] hover:bg-white hover:shadow-xs transition flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FEF3C7] text-[#92400E] mb-2 inline-block">
                  Vibe: {act.vibe}
                </span>
                <h4 className="font-serif-luxury text-lg font-bold text-[#271E30]">
                  {act.title}
                </h4>
                <p className="text-xs text-[#5D4E67] mt-2 leading-relaxed">
                  {act.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Guest Experience Improvements & Cost Savings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Guest Experience Touches */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#E9DFCE] shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#F0E8DC]">
            <Heart className="w-5 h-5 text-[#EC4899]" />
            <h3 className="font-serif-luxury text-xl font-bold text-[#271E30]">
              Guest Experience Touchpoints
            </h3>
          </div>

          <div className="space-y-3.5">
            {guestExperience.map((gx, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EAE1D2]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E4064] block">
                  {gx.touchpoint}
                </span>
                <p className="text-xs text-[#4B3E54] mt-1 leading-relaxed">
                  {gx.idea}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Cost-Saving Suggestions */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#E9DFCE] shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#F0E8DC]">
            <TrendingDown className="w-5 h-5 text-[#16A34A]" />
            <h3 className="font-serif-luxury text-xl font-bold text-[#271E30]">
              Cost-Saving Opportunities
            </h3>
          </div>

          <div className="space-y-3.5">
            {costSavingSuggestions.map((cs, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    {cs.area}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-700 px-2 py-0.5 rounded-md bg-white border border-emerald-200">
                    Save ≈ {formatINR(cs.potentialSavings)}
                  </span>
                </div>
                <p className="text-xs text-[#2F4F38] leading-relaxed">
                  {cs.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
