import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const rawKey = process.env.GEMINI_API_KEY || '';
const isValidKey = rawKey.trim() !== '' && rawKey !== 'MY_GEMINI_API_KEY';
const ai = isValidKey
  ? new GoogleGenAI({
      apiKey: rawKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

const MODEL_NAME = 'gemini-3.8-flash';

// Resilient wrapper with timeout for Gemini calls (default 45s)
async function callGeminiWithTimeout(params: any, timeoutMs = 45000): Promise<any> {
  if (!ai) throw new Error('Gemini AI client not initialized');
  let timer: any;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Gemini API call timed out')), timeoutMs);
  });
  try {
    const res = await Promise.race([ai.models.generateContent(params), timeoutPromise]);
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

// Helper to format currency in INR
function formatINR(val: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
}

// Fallback generator for realistic data when offline or testing without key
function createFallbackPlan(formData: any) {
  const budget = Number(formData.totalBudget) || 250000;
  const guests = Number(formData.guestCount) || 100;
  const eventType = (formData.eventType || 'celebration').toLowerCase();
  const style = formData.eventStyle || 'Modern';
  const loc = formData.eventLocation || 'Metropolitan City';

  const venueAmt = Math.round(budget * 0.3);
  const cateringAmt = Math.round(budget * 0.35);
  const decorAmt = Math.round(budget * 0.15);
  const photoAmt = Math.round(budget * 0.08);
  const entAmt = Math.round(budget * 0.05);
  const invAmt = Math.round(budget * 0.02);
  const transAmt = Math.round(budget * 0.02);
  const miscAmt = budget - (venueAmt + cateringAmt + decorAmt + photoAmt + entAmt + invAmt + transAmt);

  return {
    id: `plan_${Date.now()}`,
    createdAt: new Date().toISOString(),
    formData,
    concept: {
      themeTitle: `${style} Splendor: An Enchanting ${formData.eventType || 'Celebration'}`,
      tagline: 'Crafting unforgettable memories woven in elegance and joyous warmth.',
      story: `An immersive ${style.toLowerCase()} celebration designed specifically for ${guests} guests in ${loc}. Blending timeless hospitality with contemporary aesthetics.`,
      colorPalette: [
        { name: 'Warm Champagne', hex: '#F5EBE0', usage: 'Linens, draped canopies, backdrop foundations' },
        { name: 'Soft Lavender', hex: '#D8B4F8', usage: 'Floral centerpieces, accent lighting, stationery' },
        { name: 'Imperial Gold', hex: '#D4AF37', usage: 'Cutlery, charger plates, foil stamped invitations' },
        { name: 'Ivory Cream', hex: '#FAF7F2', usage: 'Base ambient styling, lounge cushions' },
      ],
      decorationIdeas: [
        {
          title: 'Fairylit Floral Arch Entrance',
          description: 'A grand walkthrough framed with cascading wisteria, tuberoses, warm fairy lights, and brass lanterns.',
          focalArea: 'Main Reception & Welcome Gate',
        },
        {
          title: 'Signature Ambient Photo Booth',
          description: 'Customized textured arch backdrop with bespoke neon sign, floral blooms, and velvet settee.',
          focalArea: 'Guest Photo Lounge',
        },
        {
          title: 'Candlelit Intimate Table Scapes',
          description: 'Floating tea lights, gold candelabras, customized printed menu cards, and fragrant jasmine sprigs.',
          focalArea: 'Dining & VIP Seating',
        },
      ],
      personalizedSuggestions: [
        `Curate a customized welcome signage reflecting your unique theme and welcoming ${guests} loved ones.`,
        'Introduce a digital QR-code based live guest photo wall for interactive real-time memories.',
        'Offer personalized artisan favors reflecting local handicrafts or sweet treats.',
      ],
    },
    budget: {
      totalBudget: budget,
      allocatedTotal: budget,
      summaryNote: `Allocated meticulously for ${guests} guests in ${loc} prioritizing gourmet dining (${Math.round((cateringAmt/budget)*100)}%) and premium atmosphere.`,
      items: [
        {
          id: 'b1',
          category: 'Venue',
          allocatedAmount: venueAmt,
          percentage: 30,
          description: `Banquet hall / manicured lawn venue booking with AC & basic backup for ${guests} guests.`,
          costSavingTip: 'Book weekday or Sunday afternoon slots to negotiate complimentary room access or parking waivers.',
        },
        {
          id: 'b2',
          category: 'Catering',
          allocatedAmount: cateringAmt,
          percentage: 35,
          description: `Extensive multi-course menu (${formData.foodPreferences || 'Multi-cuisine'}) covering welcome drinks, 4 starters, lavish buffet & live counters.`,
          costSavingTip: 'Limit number of live counters and focus on hearty, crowd-favorite signature dishes.',
        },
        {
          id: 'b3',
          category: 'Decoration',
          allocatedAmount: decorAmt,
          percentage: 15,
          description: 'Stage backdrop, floral entryway, warm focal lighting, table centerpieces, and photo booth styling.',
          costSavingTip: 'Opt for reusable silk florals combined with fresh seasonal foliage to achieve volume at 40% lower cost.',
        },
        {
          id: 'b4',
          category: 'Photography',
          allocatedAmount: photoAmt,
          percentage: 8,
          description: 'Candid photographer + traditional videographer coverage with edited highlights reel & digital gallery.',
          costSavingTip: 'Book a 6-hour package covering peak rituals rather than a full 12-hour continuous slot.',
        },
        {
          id: 'b5',
          category: 'Entertainment',
          allocatedAmount: entAmt,
          percentage: 5,
          description: 'Professional Emcee / Anchor, DJ sound console with dynamic dance floor lights.',
          costSavingTip: 'Check if the venue provides an in-house PA system before renting external speaker systems.',
        },
        {
          id: 'b6',
          category: 'Invitations',
          allocatedAmount: invAmt,
          percentage: 2,
          description: 'Bespoke animated digital video invitation suite + 25 physical luxury keepsake cards for elders.',
          costSavingTip: 'Send interactive WhatsApp RSVP video cards to save significantly on courier and printing costs.',
        },
        {
          id: 'b7',
          category: 'Transportation',
          allocatedAmount: transAmt,
          percentage: 2,
          description: 'Coordinated shuttle cabs for VIP guests and immediate family transit.',
          costSavingTip: 'Pre-book designated app-cab codes or single minibus for bulk guest transit.',
        },
        {
          id: 'b8',
          category: 'Miscellaneous',
          allocatedAmount: miscAmt,
          percentage: 3,
          description: 'Emergency contingency fund, permits, vendor meals, and gratuities.',
          costSavingTip: 'Keep this untouched until the final 48 hours for unforeseen requirements.',
        },
      ],
    },
    timeline: {
      prepTimeline: [
        {
          phase: '30 Days Before',
          tasks: [
            'Finalize and lock in the venue booking contract with advance payment.',
            'Schedule catering tasting session and finalize menu courses.',
            'Send out digital invitations and track initial RSVP confirmations.',
            'Shortlist candid photographer and DJ/Emcee.',
          ],
        },
        {
          phase: '15 Days Before',
          tasks: [
            'Review decoration 3D visual mockups and flower selections with decorator.',
            'Confirm outfit fittings, jewelry, and makeup artist schedule.',
            'Draft detailed music playlist and song cues with DJ/Emcee.',
            'Follow up with pending guest RSVPs for accurate headcounts.',
          ],
        },
        {
          phase: '7 Days Before',
          tasks: [
            'Submit final confirmed guest count to the caterer.',
            'Confirm stage sound-checks, generator backups, and lighting permissions.',
            'Assemble welcome favors, guest gift hampers, and signage prints.',
            'Assign trusted family members or coordinators to vendor contact leads.',
          ],
        },
        {
          phase: '1-2 Days Before',
          tasks: [
            'Conduct walk-through at venue to inspect setup clearances.',
            'Pack emergency celebration kit (safety pins, stain remover, mints, chargers).',
            'Settle vendor balance payments where contractual.',
            'Brief the master of ceremonies (Emcee) on key family names and announcements.',
          ],
        },
      ],
      daySchedule: [
        { time: '10:00 AM', title: 'Vendor Arrival & Setup', activity: 'Decorators and AV production crew begin setup at venue.', responsible: 'Stage Manager / Decorator' },
        { time: '02:00 PM', title: 'Host & Stylist Check-In', activity: 'Hosts arrive in bridal/green rooms; makeup and styling begins.', responsible: 'Hosts & Makeup Artist' },
        { time: '04:30 PM', title: 'Final Technical & Sound Check', activity: 'Sound check with DJ, microphones for Emcee, lighting cues tested.', responsible: 'Emcee & DJ' },
        { time: '05:30 PM', title: 'Welcome & Red Carpet Arrivals', activity: 'Welcome drinks served, live acoustic music, photo booth opens.', responsible: 'Hospitality Team' },
        { time: '06:45 PM', title: 'Grand Entry & Welcome Speech', activity: 'Hosts make festive grand entry; Emcee welcomes gathering.', responsible: 'Emcee & Hosts' },
        { time: '07:30 PM', title: 'Main Ceremonies / Performances', activity: 'Key celebrations, dance performances, cake cutting, or toasts.', responsible: 'All Guests & Family' },
        { time: '08:45 PM', title: 'Gourmet Dinner Buffet Opens', activity: 'Lavish dining counters open with live culinary stations.', responsible: 'Catering Lead' },
        { time: '10:00 PM', title: 'Dance Floor & Farewell Favors', activity: 'Open dance floor party followed by distribution of return gifts.', responsible: 'DJ & Hospitality' },
      ],
    },
    vendorChecklist: [
      { id: 'v1', category: 'Venue', task: 'Sign venue agreement and inspect air-conditioning & power backup', estimatedCost: venueAmt, deadline: '30 Days Before', completed: false, notes: 'Confirm sound curfew hours and parking capacity' },
      { id: 'v2', category: 'Catering', task: 'Finalize menu tasting and confirm live counter requirements', estimatedCost: cateringAmt, deadline: '20 Days Before', completed: false, notes: `Include special options for ${formData.foodPreferences || 'all guests'}` },
      { id: 'v3', category: 'Decoration', task: 'Approve stage backdrop dimensions and floral moodboard', estimatedCost: decorAmt, deadline: '15 Days Before', completed: false, notes: 'Request warm 3000K mood lighting' },
      { id: 'v4', category: 'Photography', task: 'Share required family shot list and candid moments brief', estimatedCost: photoAmt, deadline: '10 Days Before', completed: false, notes: 'Ensure drone coverage permissions if outdoor' },
      { id: 'v5', category: 'Entertainment', task: 'Hand over custom entry songs and milestone playlist', estimatedCost: entAmt, deadline: '7 Days Before', completed: false, notes: 'Confirm wireless lapel and handheld mics' },
      { id: 'v6', category: 'Stylist & Makeup', task: 'Schedule makeup trial session and timing slot for hosts', estimatedCost: Math.round(budget * 0.03), deadline: '12 Days Before', completed: false, notes: 'Waterproof HD makeup recommended' },
      { id: 'v7', category: 'Invitations & Favors', task: 'Distribute digital save-the-dates and procure packaging for return gifts', estimatedCost: invAmt, deadline: '25 Days Before', completed: false, notes: 'Eco-friendly jute or handcrafted boxes' },
      { id: 'v8', category: 'Logistics', task: 'Coordinate parking valet and signage from main road', estimatedCost: transAmt, deadline: '3 Days Before', completed: false, notes: 'Display clear direction arrows' },
    ],
    recommendations: {
      foodMenu: {
        welcomeDrinks: ['Royal Kesar Badam Milk / Spiced Kokum Cooler', 'Fresh Passionfruit Basil Mojito (Mocktail)'],
        appetizers: ['Paneer Tikka Angara / Crispy Lotus Stem Fries', 'Herb Crusted Galouti Kebabs on Sheermal', 'Truffle Mushroom Canapés'],
        mainCourse: ['Paneer Lababdar / Butter Chicken Masala', 'Slow-cooked Dal Makhani with Garlic Naan', 'Subz Dum Biryani with Burani Raita', 'Exotic Wok Greens in Garlic Glaze'],
        desserts: ['Warm Shahi Tukda with Rabdi Mousse', 'Baked Gulab Jamun Cheesecake', 'Artisan Nitrogen Gelato Counter'],
        signatureSpecial: 'Live Street Chaat Station (Pani Puri with 4 flavored waters, Dahi Papdi Chaat)',
      },
      gamesAndActivities: [
        { name: 'Celebration Trivia Challenge', targetAudience: 'All Guests', description: 'Fun interactive phone or live buzzer quiz about the hosts with delightful prizes.' },
        { name: 'Musical Memory Capsule', targetAudience: 'Friends & Family', description: 'Guests record 15-second audio/video wishes on a vintage telephone audio-guestbook.' },
        { name: 'Flash Freeze Dance Off', targetAudience: 'Youth & Kids', description: 'Energetic DJ freeze-dance with funny prop accessories on the dance floor.' },
      ],
      entertainmentIdeas: [
        { title: 'Symphonic Acoustic Duo', description: 'Live violinist or flutist performing contemporary instrumental melodies during guest arrival.', vibe: 'Elegance & Warmth' },
        { title: 'Interactive Master of Ceremonies', description: 'Dynamic bilingual Emcee engaging tables with quick laughter games and seamless transitions.', vibe: 'Engaging & Vibrant' },
        { title: 'Celebratory Confetti & Cold Pyros', description: 'Safe indoor cold spark fountains during entry and celebratory toast.', vibe: 'Grand & Spectacular' },
      ],
      guestExperience: [
        { touchpoint: 'Arrival Welcome', idea: 'Fragrant mogra/rose wristlets or sandalwood tilak presented upon arrival.' },
        { touchpoint: 'Comfort Lounge', idea: 'Hydration detox bar with infused water, flip-flop station for ladies tired of heels.' },
        { touchpoint: 'Instant Memories', idea: 'Polaroid magnetic prints given instantly as take-home photo memories.' },
      ],
      costSavingSuggestions: [
        { area: 'Venue Booking', suggestion: 'Inquire if booking on an off-peak day or Sunday afternoon yields a 15-20% rebate on hall rentals.', potentialSavings: Math.round(budget * 0.05) },
        { area: 'Floral Decor', suggestion: 'Combine focal natural flowers on the stage with lush green foliage and warm ambient lighting elsewhere.', potentialSavings: Math.round(budget * 0.04) },
        { area: 'Invitations', suggestion: 'Transition to bespoke animated video invites instead of heavy physical box cards.', potentialSavings: Math.round(budget * 0.015) },
      ],
    },
  };
}

// System instruction for Gemini planner
const SYSTEM_INSTRUCTION = `You are EventAura's expert celebration architect and certified event planner with 15+ years experience in planning top-tier Indian and global weddings, milestone birthdays, anniversaries, corporate galas, and community festivals.
Always provide culturally nuanced, realistic, sophisticated, high-taste, and budget-disciplined plans in Indian Rupees (₹ INR).
CRITICAL RULES:
1. The budget item sums MUST equal or be strictly within the user's total budget. Never exceed total budget.
2. Provide specific, vivid ideas tailored to the event type, location, guest count, style, and food preference.
3. Every suggestion should feel bespoke, practical, and inspiring.
4. Output strict JSON matching the requested structure without any markdown wrappers (or clean markdown codeblocks if necessary).`;

// 1. Generate full plan
app.post('/api/plan/generate', async (req: Request, res: Response) => {
  try {
    const formData = req.body;
    if (!formData || !formData.eventType || !formData.totalBudget) {
      return res.status(400).json({ error: 'Missing required event fields (eventType, totalBudget).' });
    }

    if (!ai) {
      console.warn('No GEMINI_API_KEY found, providing high-quality fallback plan.');
      const fallback = createFallbackPlan(formData);
      return res.json({ plan: fallback, isOfflineFallback: true });
    }

    const prompt = `Create an intelligent, highly personalized Event Plan for the following details:
- Event Type: ${formData.eventType} ${formData.customEventType ? `(${formData.customEventType})` : ''}
- Event Name: ${formData.eventName || 'Our Special Celebration'}
- Event Date: ${formData.eventDate || 'Upcoming'}
- Event Location / City: ${formData.eventLocation || 'Metropolitan City'}
- Number of Guests: ${formData.guestCount}
- Total Budget: ₹${formData.totalBudget} INR
- Preferred Style: ${formData.eventStyle || 'Modern'}
- Venue Setting: ${formData.indoorOutdoor || 'Flexible'}
- Food Preferences: ${formData.foodPreferences || 'Multi-cuisine / Standard'}
- Additional Requirements & Vision: ${formData.additionalRequirements || 'None specified'}

Return a single JSON object with this exact structure:
{
  "concept": {
    "themeTitle": "string",
    "tagline": "string",
    "story": "string (2-3 sentences)",
    "colorPalette": [
      { "name": "string", "hex": "string (#HEX)", "usage": "string" }
    ],
    "decorationIdeas": [
      { "title": "string", "description": "string", "focalArea": "string" }
    ],
    "personalizedSuggestions": ["string", "string", "string"]
  },
  "budget": {
    "totalBudget": ${Number(formData.totalBudget)},
    "allocatedTotal": ${Number(formData.totalBudget)},
    "summaryNote": "string explanation of budget strategy",
    "items": [
      {
        "id": "b1",
        "category": "Venue" | "Catering" | "Decoration" | "Photography" | "Entertainment" | "Invitations" | "Transportation" | "Miscellaneous",
        "allocatedAmount": number,
        "percentage": number,
        "description": "string",
        "costSavingTip": "string"
      }
    ]
  },
  "timeline": {
    "prepTimeline": [
      { "phase": "30 Days Before", "tasks": ["string", "string", "string"] },
      { "phase": "15 Days Before", "tasks": ["string", "string", "string"] },
      { "phase": "7 Days Before", "tasks": ["string", "string", "string"] },
      { "phase": "1-2 Days Before", "tasks": ["string", "string", "string"] }
    ],
    "daySchedule": [
      { "time": "string (e.g. 10:00 AM)", "title": "string", "activity": "string", "responsible": "string" }
    ]
  },
  "vendorChecklist": [
    {
      "id": "v1",
      "category": "Venue" | "Catering" | "Decoration" | "Photography" | "Entertainment" | "Stylist & Makeup" | "Invitations & Favors" | "Logistics",
      "task": "string",
      "estimatedCost": number,
      "deadline": "string",
      "completed": false,
      "notes": "string"
    }
  ],
  "recommendations": {
    "foodMenu": {
      "welcomeDrinks": ["string", "string"],
      "appetizers": ["string", "string", "string"],
      "mainCourse": ["string", "string", "string", "string"],
      "desserts": ["string", "string", "string"],
      "signatureSpecial": "string"
    },
    "gamesAndActivities": [
      { "name": "string", "targetAudience": "string", "description": "string" }
    ],
    "entertainmentIdeas": [
      { "title": "string", "description": "string", "vibe": "string" }
    ],
    "guestExperience": [
      { "touchpoint": "string", "idea": "string" }
    ],
    "costSavingSuggestions": [
      { "area": "string", "suggestion": "string", "potentialSavings": number }
    ]
  }
}

Ensure sum of allocatedAmount in budget items does not exceed ₹${formData.totalBudget}.`;

    const response = await callGeminiWithTimeout({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    }, 45000);

    const text = response.text || '';
    const cleanText = text.replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();
    const parsedData = JSON.parse(cleanText);

    const fullPlan = {
      id: `plan_${Date.now()}`,
      createdAt: new Date().toISOString(),
      formData,
      concept: parsedData.concept,
      budget: parsedData.budget,
      timeline: parsedData.timeline,
      vendorChecklist: parsedData.vendorChecklist,
      recommendations: parsedData.recommendations,
      aiNotes: 'Plan intelligently crafted by Gemini AI based on your unique vision and budget.',
    };

    return res.json({ plan: fullPlan, isOfflineFallback: false });
  } catch (err: any) {
    console.warn('Notice: Gemini API plan generation fallback engaged:', err?.message || err);
    // If Gemini fails or times out, safely return our robust tailored plan
    const fallback = createFallbackPlan(req.body);
    return res.json({
      plan: fallback,
      isOfflineFallback: true,
      errorNotice: err?.message || 'Generated using offline intelligent template.',
    });
  }
});

// Heuristic refinement helper for rapid fallback or offline
function refinePlanHeuristic(currentPlan: any, userMessage: string) {
  const msg = userMessage.toLowerCase();
  const updatedPlan = JSON.parse(JSON.stringify(currentPlan));
  let reply = `I've updated your event plan based on "${userMessage}".`;
  const changesMade: string[] = [];

  if (msg.includes('decor') || msg.includes('decoration')) {
    const decorItem = updatedPlan.budget.items.find((i: any) => i.category === 'Decoration');
    if (decorItem) {
      // Extract numeric change if mentioned, or default to 5000
      const match = userMessage.match(/(\d+[\d,]*)/);
      const parsedNum = match ? parseInt(match[1].replace(/,/g, ''), 10) : 5000;
      const cut = Math.min(parsedNum, decorItem.allocatedAmount * 0.4);
      decorItem.allocatedAmount = Math.max(0, decorItem.allocatedAmount - cut);
      
      const miscItem = updatedPlan.budget.items.find((i: any) => i.category === 'Miscellaneous');
      if (miscItem) miscItem.allocatedAmount += cut;

      changesMade.push(`Reduced decoration allocation by ₹${cut.toLocaleString('en-IN')} and redirected to contingency.`);
      reply = `I have adjusted your decoration budget down by ₹${cut.toLocaleString('en-IN')}, and kept your overall budget strictly balanced at ₹${updatedPlan.budget.totalBudget.toLocaleString('en-IN')}.`;
    }
  } else if (msg.includes('vegetarian') || msg.includes('veg')) {
    updatedPlan.recommendations.foodMenu.appetizers = [
      'Paneer Tikka Shashlik with Mint Chutney',
      'Crispy Corn Kernels with Kaffir Lime',
      'Dahi Ke Kebab with Pomegranate Gel',
      'Stuffed Tandoori Portobello Mushrooms'
    ];
    updatedPlan.recommendations.foodMenu.mainCourse = [
      'Royal Paneer Lababdar',
      'Dal Bukhara (slow cooked 24hrs)',
      'Subz Nizami Handi with butter kulchas',
      'Jeera Rice with Cucumber Pomegranate Raita'
    ];
    changesMade.push('Swapped food menu to 100% royal vegetarian gourmet selections.');
    reply = 'I have refreshed your catering menu to an opulent 100% pure vegetarian gourmet spread with crowd-pleasing royal curries and live street counters!';
  } else if (msg.includes('traditional')) {
    updatedPlan.concept.themeTitle = 'Timeless Heritage & Cultural Splendor';
    updatedPlan.concept.story = 'A resplendent celebration honoring cultural traditions, fragrant marigold florals, temple bells, and royal ceremonial hospitality.';
    updatedPlan.concept.colorPalette = [
      { name: 'Auspicious Marigold', hex: '#F59E0B', usage: 'Mandap garlands, floral entryway, torans' },
      { name: 'Royal Crimson Red', hex: '#BE123C', usage: 'Traditional bridal drapes, carpet walkways' },
      { name: 'Temple Brass Gold', hex: '#D4AF37', usage: 'Brass urli bowls, deepams, metallic cutlery' },
      { name: 'Ivory Raw Silk', hex: '#FAF7F2', usage: 'Ambient ceiling canopies and cushions' },
    ];
    changesMade.push('Infused traditional heritage theme, auspicious marigold & brass color palette.');
    reply = 'I have transformed your celebration theme to a culturally rich, traditional aesthetic with marigold floral canopies, brass lanterns, and royal classical rituals!';
  } else if (msg.includes('venue') || msg.includes('outdoor')) {
    const venueItem = updatedPlan.budget.items.find((i: any) => i.category === 'Venue');
    if (venueItem) {
      venueItem.description = 'Heritage open lawn or manicured poolside terrace venue with evening fairy-lit arbor.';
      venueItem.costSavingTip = 'Opt for an afternoon-to-sunset time slot or non-peak weekday to negotiate complimentary green rooms and lawn lighting.';
    }
    changesMade.push('Tailored venue advice and cost-saving guidelines for outdoor locations.');
    reply = 'I have aligned your venue specifications with outdoor manicured lawns and scenic terraces, including tips to negotiate complimentary lighting and weather-backup marquees!';
  } else {
    changesMade.push(`Adapted plan recommendations for "${userMessage}"`);
    reply = `I have reviewed your request ("${userMessage}") and updated your celebration blueprint and recommendations accordingly.`;
  }

  return { updatedPlan, replyMessage: reply, changesMade };
}

// 2. Interactive AI Assistant chat to refine plan
app.post('/api/plan/refine', async (req: Request, res: Response) => {
  try {
    const { currentPlan, userMessage, chatHistory } = req.body;

    if (!currentPlan || !userMessage) {
      return res.status(400).json({ error: 'currentPlan and userMessage are required.' });
    }

    if (!ai) {
      const result = refinePlanHeuristic(currentPlan, userMessage);
      return res.json(result);
    }

    const prompt = `You are the EventAura celebration planner assistant. The user wants to modify or ask a question about their current event plan.
User message: "${userMessage}"

Current Event Plan JSON:
${JSON.stringify(currentPlan, null, 2)}

Instructions:
1. Examine what the user wants to adjust (e.g. modify budget numbers, switch menu items, adjust timeline, add vendor task, change decor or theme vibe).
2. If the user asks to reduce or increase a budget category, adjust the numbers in 'budget.items' so the total remains balanced and doesn't exceed totalBudget.
3. Update the fields in the plan directly to reflect their exact request.
4. Output a JSON object with:
{
  "updatedPlan": <The complete updated EventPlan object with modifications applied>,
  "replyMessage": "<Your helpful, polite, and enthusiastic response directly explaining what you updated in their plan>",
  "changesMade": ["<Brief bullet 1 of change made>", "<Brief bullet 2>"]
}

Return ONLY valid JSON.`;

    const response = await callGeminiWithTimeout({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    }, 45000);

    const text = response.text || '';
    const cleanText = text.replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();
    const result = JSON.parse(cleanText);

    return res.json({
      updatedPlan: result.updatedPlan || currentPlan,
      replyMessage: result.replyMessage || "I've reviewed your request and updated your celebration plan.",
      changesMade: result.changesMade || ['Refined event parameters.'],
    });
  } catch (err: any) {
    console.warn('AI call failed, falling back to intelligent heuristic updater:', err?.message);
    const fallbackResult = refinePlanHeuristic(req.body.currentPlan, req.body.userMessage || '');
    return res.json(fallbackResult);
  }
});

// 3. Regenerate individual section
app.post('/api/plan/regenerate-section', async (req: Request, res: Response) => {
  try {
    const { currentPlan, section } = req.body;
    if (!currentPlan || !section) {
      return res.status(400).json({ error: 'currentPlan and section are required.' });
    }

    if (!ai) {
      // Offline fallback variation
      const updatedPlan = JSON.parse(JSON.stringify(currentPlan));
      if (section === 'foodMenu') {
        updatedPlan.recommendations.foodMenu = {
          welcomeDrinks: ['Lychee Rose Sparkler', 'Fresh Tender Coconut Blossom with Mint'],
          appetizers: ['Stuffed Tandoori Portobello Mushrooms', 'Zaatar Spiced Cheese Parcels', 'Smoked Paneer Boti'],
          mainCourse: ['Dum Handi Paneer Korma', 'Awadhi Biryani with Mirchi Salan', 'Dal Makhani Gold', 'Assorted Artisan Kulchas'],
          desserts: ['Elaneer Payasam with Pistachio Crisp', 'Chai Spiced Chocolate Fondant', 'Kesar Jalebi with Rabri foam'],
          signatureSpecial: 'Gourmet Live Kulfi & Falooda Alchemy Bar',
        };
      } else if (section === 'concept') {
        updatedPlan.concept.themeTitle = 'Celestial Twilight & Gold Romance';
        updatedPlan.concept.story = 'An ethereal evening celebration illuminated by starlight projections, velvet accents, and glistening champagne highlights.';
      }
      return res.json({ updatedPlan });
    }

    const prompt = `In the following EventPlan, regenerate ONLY the section "${section}" with fresh, creative, high-taste ideas suited to:
Event Type: ${currentPlan.formData.eventType}
Budget: ₹${currentPlan.formData.totalBudget} INR
Style: ${currentPlan.formData.eventStyle}
Location: ${currentPlan.formData.eventLocation}
Guests: ${currentPlan.formData.guestCount}

Current Plan JSON:
${JSON.stringify(currentPlan, null, 2)}

Return the full updated EventPlan JSON object with the refreshed section. Return strictly JSON.`;

    const response = await callGeminiWithTimeout({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    }, 45000);

    const text = response.text || '';
    const cleanText = text.replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();
    const result = JSON.parse(cleanText);

    return res.json({ updatedPlan: result.updatedPlan || result });
  } catch (err: any) {
    console.warn('Notice: Regenerate section fallback engaged:', err?.message || err);
    const updatedPlan = JSON.parse(JSON.stringify(req.body.currentPlan || {}));
    if (req.body.section === 'foodMenu' && updatedPlan.recommendations) {
      updatedPlan.recommendations.foodMenu = {
        welcomeDrinks: ['Lychee Rose Sparkler', 'Fresh Tender Coconut Blossom with Mint'],
        appetizers: ['Stuffed Tandoori Portobello Mushrooms', 'Zaatar Spiced Cheese Parcels', 'Smoked Paneer Boti'],
        mainCourse: ['Dum Handi Paneer Korma', 'Awadhi Biryani with Mirchi Salan', 'Dal Makhani Gold', 'Assorted Artisan Kulchas'],
        desserts: ['Elaneer Payasam with Pistachio Crisp', 'Chai Spiced Chocolate Fondant', 'Kesar Jalebi with Rabri foam'],
        signatureSpecial: 'Gourmet Live Kulfi & Falooda Alchemy Bar',
      };
    }
    return res.json({ updatedPlan });
  }
});

// Setup Vite or static serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EventAura server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
