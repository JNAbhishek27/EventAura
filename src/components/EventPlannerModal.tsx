import React, { useState } from 'react';
import {
  X,
  Sparkles,
  HeartHandshake,
  Cake,
  GlassWater,
  Briefcase,
  Users,
  Compass,
  MapPin,
  Calendar,
  IndianRupee,
  Utensils,
  SunMedium,
  Check,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { EventFormData, EventType, EventStyle, IndoorOutdoorPreference } from '../types/event';
import { formatINR } from '../utils/formatters';

interface EventPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: EventFormData) => Promise<void>;
  initialType?: EventType;
  isGenerating: boolean;
}

const EVENT_STYLES: { id: EventStyle; label: string; desc: string }[] = [
  { id: 'Traditional', label: 'Traditional', desc: 'Cultural richness, heritage rituals, festive florals' },
  { id: 'Modern', label: 'Modern', desc: 'Contemporary chic, clean lines, ambient bistro lighting' },
  { id: 'Luxury', label: 'Luxury', desc: 'Opulent detailing, gold accents, gourmet multi-course' },
  { id: 'Minimalist', label: 'Minimalist', desc: 'Understated elegance, uncluttered spaces, thoughtful accents' },
  { id: 'Eco-friendly', label: 'Eco-friendly', desc: 'Zero-waste, potted flora, sustainable handcrafted elements' },
];

const SETTING_PREFERENCES: { id: IndoorOutdoorPreference; label: string; desc: string }[] = [
  { id: 'Indoor', label: 'Indoor', desc: 'AC Banquet Hall, Ballroom, or Glasshouse' },
  { id: 'Outdoor', label: 'Outdoor', desc: 'Manicured Lawn, Beach, Rooftop, or Poolside' },
  { id: 'Both / Flexible', label: 'Both / Flexible', desc: 'Indoor banquet + adjoining open-air terrace' },
];

export const EventPlannerModal: React.FC<EventPlannerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialType = 'wedding',
  isGenerating,
}) => {
  const [eventType, setEventType] = useState<EventType>(initialType);
  const [customEventType, setCustomEventType] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState(() => {
    // Default to ~60 days from now
    const d = new Date();
    d.setDate(d.getDate() + 60);
    return d.toISOString().split('T')[0];
  });
  const [eventLocation, setEventLocation] = useState('Udaipur, Rajasthan');
  const [guestCount, setGuestCount] = useState<number>(150);
  const [totalBudget, setTotalBudget] = useState<number>(600000);
  const [eventStyle, setEventStyle] = useState<EventStyle>('Luxury');
  const [indoorOutdoor, setIndoorOutdoor] = useState<IndoorOutdoorPreference>('Both / Flexible');
  const [foodPreferences, setFoodPreferences] = useState('Royal Multi-cuisine, Pure Veg & Non-Veg with Live Chaat counters');
  const [additionalRequirements, setAdditionalRequirements] = useState('Drone photography, vintage car entry, cold spark fireworks for couple welcome');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync initial type if changed
  React.useEffect(() => {
    if (initialType) {
      setEventType(initialType);
      if (initialType === 'wedding') {
        setEventLocation('Udaipur, Rajasthan');
        setGuestCount(200);
        setTotalBudget(1200000);
        setEventStyle('Luxury');
        setFoodPreferences('Pure Vegetarian Royal Rajasthani & Awadhi with Live Chaat & Sweet Counters');
        setEventName('Our Royal Wedding & Sangeet');
      } else if (initialType === 'birthday') {
        setEventLocation('Bengaluru, Karnataka');
        setGuestCount(50);
        setTotalBudget(150000);
        setEventStyle('Modern');
        setFoodPreferences('Gourmet Sliders, Wood-fired Pizzas, Tapas & Mocktail Alchemy');
        setEventName('Milestone 30th Rooftop Soirée');
      } else if (initialType === 'corporate') {
        setEventLocation('Mumbai, Maharashtra');
        setGuestCount(120);
        setTotalBudget(500000);
        setEventStyle('Modern');
        setFoodPreferences('Continental & Pan-Asian Buffet with Live Wok Station');
        setEventName('Annual Innovation Summit & Gala Dinner');
      } else if (initialType === 'anniversary') {
        setEventLocation('Goa');
        setGuestCount(75);
        setTotalBudget(350000);
        setEventStyle('Luxury');
        setFoodPreferences('Coastal Seafood & Continental Delicacies with Candlelit Dining');
        setEventName('Silver 25th Wedding Anniversary');
      } else if (initialType === 'community') {
        setEventLocation('Delhi NCR');
        setGuestCount(300);
        setTotalBudget(400000);
        setEventStyle('Traditional');
        setFoodPreferences('Festive Pure Veg Thali, Sweets & Live Jalebi Counter');
        setEventName('Grand Diwali & Cultural Society Festival');
      }
    }
  }, [initialType]);

  if (!isOpen) return null;

  const handleQuickBudget = (amount: number) => {
    setTotalBudget(amount);
  };

  const handleAdjustBudget = (delta: number) => {
    setTotalBudget((prev) => Math.max(20000, prev + delta));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!eventLocation.trim()) {
      setErrorMsg('Please specify an event location or city.');
      return;
    }
    if (guestCount < 1) {
      setErrorMsg('Guest count must be at least 1.');
      return;
    }
    if (totalBudget < 10000) {
      setErrorMsg('Budget must be at least ₹10,000 INR.');
      return;
    }

    const payload: EventFormData = {
      eventType,
      customEventType: eventType === 'other' ? customEventType : undefined,
      eventName: eventName.trim() || undefined,
      eventDate,
      eventLocation: eventLocation.trim(),
      guestCount,
      totalBudget,
      eventStyle,
      indoorOutdoor,
      foodPreferences: foodPreferences.trim(),
      additionalRequirements: additionalRequirements.trim(),
    };

    await onSubmit(payload);
  };

  const perGuestBudget = Math.round(totalBudget / (guestCount || 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto backdrop-blur-md bg-black/45 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E5DAC8] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#FAF0E6] via-[#FAF7F2] to-[#F5EEF9] border-b border-[#E8DFC9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9F7AEA] to-[#D4AF37] p-0.5 flex items-center justify-center shadow-xs">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#B78628]" />
              </div>
            </div>
            <div>
              <h2 className="font-serif-luxury text-2xl font-bold text-[#271E30]">
                Design Your Celebration
              </h2>
              <p className="text-xs text-[#73637C]">
                Tell EventAura your preferences and budget. Gemini AI generates a complete plan.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="w-9 h-9 rounded-full bg-white border border-[#E0D5C3] text-[#73637C] hover:text-[#271E30] hover:bg-[#F3ECE1] flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-[#2D2438]">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Event Type Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5C74] mb-2.5">
              1. Event Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { type: 'wedding' as EventType, label: 'Wedding', icon: HeartHandshake },
                { type: 'birthday' as EventType, label: 'Birthday', icon: Cake },
                { type: 'anniversary' as EventType, label: 'Anniversary', icon: GlassWater },
                { type: 'corporate' as EventType, label: 'Corporate', icon: Briefcase },
                { type: 'community' as EventType, label: 'Community', icon: Users },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = eventType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setEventType(item.type)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition ${
                      isSelected
                        ? 'border-[#B78628] bg-[#FDF9EE] text-[#785412] shadow-xs font-bold ring-2 ring-[#D4AF37]/30'
                        : 'border-[#E2D8C7] bg-white text-[#564960] hover:bg-[#FAF4EB]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-[#B78628]' : 'text-[#8F7E9B]'}`} />
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Event Title & Date & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#54465E] mb-1">
                Event Name / Host(s)
              </label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="e.g. Vikram & Maya’s Wedding"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#D9CEBC] bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#54465E] mb-1">
                Event Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#D9CEBC] bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#54465E] mb-1">
                City / Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="e.g. Udaipur / Mumbai / Delhi"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#D9CEBC] bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition"
                />
                <MapPin className="w-4 h-4 text-[#9F7AEA] absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Guest Count & Budget Slider */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 rounded-2xl bg-[#F6EFE3] border border-[#E8DEC9]">
            {/* Guest Count */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#4B3E55]">
                  Number of Guests
                </label>
                <span className="text-sm font-extrabold text-[#7C3AED] px-2.5 py-0.5 rounded-lg bg-white border border-[#E0D5C3]">
                  {guestCount} Guests
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full accent-[#7C3AED] cursor-pointer"
              />
              <div className="flex gap-1.5 mt-2">
                {[30, 75, 150, 300, 500].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setGuestCount(count)}
                    className={`flex-1 py-1 text-[11px] font-semibold rounded-lg border transition ${
                      guestCount === count
                        ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                        : 'bg-white text-[#5C4D68] border-[#DECFC0] hover:bg-[#FAF4EB]'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Budget in INR */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#4B3E55] flex items-center gap-1">
                  <span>Total Budget (₹ INR)</span>
                </label>
                <span className="text-sm font-extrabold text-[#B78628] px-2.5 py-0.5 rounded-lg bg-white border border-[#E0D5C3]">
                  {formatINR(totalBudget)}
                </span>
              </div>
              <input
                type="range"
                min="30000"
                max="5000000"
                step="25000"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] font-medium text-[#7D6E87] mt-1.5">
                <span>≈ {formatINR(perGuestBudget)} / guest</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleAdjustBudget(50000)}
                    className="px-2 py-0.5 rounded bg-white border border-[#D9CDBA] text-[10px] font-bold text-[#4B3E55] hover:bg-[#FAF4EB]"
                  >
                    +₹50K
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdjustBudget(100000)}
                    className="px-2 py-0.5 rounded bg-white border border-[#D9CDBA] text-[10px] font-bold text-[#4B3E55] hover:bg-[#FAF4EB]"
                  >
                    +₹1 Lakh
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Event Style */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5C74] mb-2">
              Preferred Celebration Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {EVENT_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setEventStyle(style.id)}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    eventStyle === style.id
                      ? 'border-[#B78628] bg-[#FDF9EE] ring-2 ring-[#D4AF37]/30 shadow-xs'
                      : 'border-[#E2D8C7] bg-white hover:bg-[#FAF5ED]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2E2437]">{style.label}</span>
                    {eventStyle === style.id && <Check className="w-3.5 h-3.5 text-[#B78628]" />}
                  </div>
                  <span className="text-[10px] text-[#7A6B84] mt-1 leading-tight">{style.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Setting Preference */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5C74] mb-2">
              Venue Preference
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SETTING_PREFERENCES.map((pref) => (
                <button
                  key={pref.id}
                  type="button"
                  onClick={() => setIndoorOutdoor(pref.id)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    indoorOutdoor === pref.id
                      ? 'border-[#7C3AED] bg-[#F7F2FE] ring-2 ring-[#7C3AED]/20 shadow-xs'
                      : 'border-[#E2D8C7] bg-white hover:bg-[#FAF5ED]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2E2437]">{pref.label}</span>
                    {indoorOutdoor === pref.id && <Check className="w-3.5 h-3.5 text-[#7C3AED]" />}
                  </div>
                  <span className="text-[10px] text-[#7A6B84] mt-0.5 block">{pref.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Food Preferences & Additional Requirements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#54465E] mb-1">
                Food & Catering Preferences
              </label>
              <input
                type="text"
                value={foodPreferences}
                onChange={(e) => setFoodPreferences(e.target.value)}
                placeholder="e.g. Pure Veg, Live Chaat Counter, Jain counters, Multi-cuisine"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#D9CEBC] bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition"
              />
              <span className="text-[10px] text-[#867690] mt-1 block">
                Specify dietary requirements (Veg, Non-Veg, Jain, Continental, Regional).
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#54465E] mb-1">
                Special Vision & Requirements
              </label>
              <input
                type="text"
                value={additionalRequirements}
                onChange={(e) => setAdditionalRequirements(e.target.value)}
                placeholder="e.g. Sangeet dance floor, vintage car, elderly comfort seating"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#D9CEBC] bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition"
              />
              <span className="text-[10px] text-[#867690] mt-1 block">
                Any specific traditions, music styles, entertainment or logistics.
              </span>
            </div>
          </div>

          {/* Submit Action Area */}
          <div className="pt-2 border-t border-[#E8DFC9] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-[#7A6A83] text-center sm:text-left">
              <span>* Estimates are realistic guidelines calibrated to Indian market averages.</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={isGenerating}
                className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold rounded-xl border border-[#D9CDBA] bg-white text-[#564960] hover:bg-[#FAF4EB]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isGenerating}
                className="flex-1 sm:flex-none px-6 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E2C359] to-[#C09623] text-white shadow-lg shadow-[#D4AF37]/35 hover:brightness-105 active:scale-98 transition flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Architecting Plan with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Event Plan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
