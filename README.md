# EventAura – Your Celebration, Intelligently Planned 🎊✨

> **"Every Celebration Deserves a Perfect Plan."**  
> An intelligent, full-stack event planning web application powered by **Google Gemini AI (`gemini-3.8-flash`)**. EventAura architects bespoke concepts, strict budget breakdowns in Indian Rupees (₹ INR), 30-day countdowns, hour-by-hour day schedules, vendor checklists, and curated gastronomy for weddings, milestone birthdays, anniversaries, corporate summits, and community festivals.

---

## 🌟 Live Demo

- **Interactive Applet:** [https://ais-pre-bvwvz2zawby7xvzf6rhezx-1000591823797.asia-southeast1.run.app](https://ais-pre-bvwvz2zawby7xvzf6rhezx-1000591823797.asia-southeast1.run.app)

---

## 🎯 Key Capabilities & Features

### 1. Celebration Landing Page & Category Hub
- **Elegant Aesthetic:** Warm cream (`#FAF7F2`), royal lavender (`#E8DEF8`), and champagne gold (`#D4AF37`) color palette paired with *Cormorant Garamond* and *Plus Jakarta Sans* typography.
- **Dedicated Categories:** Tailored templates for **Weddings**, **Birthday Parties**, **Anniversaries**, **Corporate Summits**, and **Community Festivals**.
- **Interactive Demos:** Built-in royal wedding demo (Udaipur Haveli) and rooftop 30th birthday demo (Bengaluru).

### 2. Smart Event Configuration Form
- **Dynamic Input Validation:** Collects celebration type, event date, host names, city/location, guest headcount, and total budget in ₹ INR.
- **Real-Time Cost-Per-Guest Calculation:** Automatically calculates per-plate / per-guest estimates as budget or guest count sliders shift.
- **Preference Selectors:**
  - **Styles:** *Traditional, Modern, Luxury, Minimalist, Eco-friendly*
  - **Settings:** *Indoor Banquet, Outdoor Lawn/Terrace, Both/Flexible*
  - **Dietary & Vision:** Specific catering preferences (Veg, Non-Veg, Jain, Regional) and bespoke requirements.

### 3. Server-Side Google Gemini AI Architecture
- **Concept & Moodboard:** Generates an evocative theme title, storyline, 4-swatch harmonized hex color palette with usage notes, and focal decor installations.
- **Strict Budget Balancing (₹ INR):** Allocates funds across 8 categories (*Venue, Catering, Decoration, Photography, Entertainment, Invitations, Transportation, Miscellaneous*), mathematically guaranteed not to exceed user spending limits.
- **Dual Timelines:**
  - **Prep Countdown:** Actionable milestones at 30 Days, 15 Days, 7 Days, and 1–2 Days Before.
  - **Run-of-Show:** Exact minute-by-minute day schedule detailing assigned leads.
- **Vendor Procurement Checklist:** Pre-populated deliverables, cost benchmarks, deadlines, and progress completion tracker.
- **Curated Recommendations:** Multi-course menus (welcome drinks, starters, mains, desserts, live stations), guest icebreaker games, entertainment acts, and practical cost-cutting secrets.

### 4. Interactive Dashboard
- **Live Budget Sliders & Auto-Balancing:** Adjust any expense category on the fly; click **"Auto-Balance Budget"** to redistribute remaining funds automatically.
- **Vendor Task Checklists:** Filter by service category, mark tasks as completed, add custom deliverables, or remove items.
- **Inspiration & Menu Regeneration:** Instantly refresh individual components (e.g. food menus, themes) with fresh AI ideas.
- **Export & Print Ready:** One-click full Markdown copy for WhatsApp/notes and browser-optimized PDF print styling.

### 5. Conversational AI Assistant Copilot
- Context-aware chat drawer synced to the active plan.
- Interprets natural language adjustments such as:
  - *"Reduce my decoration budget by ₹5,000."*
  - *"Suggest a vegetarian menu for 100 guests."*
  - *"Make my wedding more traditional."*
  - *"Suggest affordable outdoor venues."*
- Updates the active plan parameters in real time rather than outputting disconnected text.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Canvas Confetti |
| **Backend** | Node.js, Express, tsx |
| **AI / GenAI** | Google Gemini API (`gemini-3.8-flash`) via official `@google/genai` TypeScript SDK |
| **Build & Dev Tooling** | Vite 8, TypeScript 7 |

---

## 📂 Project Directory Structure

```plaintext
├── .env.example              # Template environment variables (no secrets committed)
├── .gitignore                # Comprehensive exclusions for clean commits
├── index.html                # HTML entry point with Cormorant & Plus Jakarta fonts
├── metadata.json             # AI Studio configuration and capabilities
├── package.json              # Dependencies and runnable scripts
├── server.ts                 # Express full-stack server with Gemini API endpoints
├── src/
│   ├── App.tsx               # Main application orchestration & state management
│   ├── main.tsx              # React DOM mounting
│   ├── index.css             # Tailwind CSS imports & print stylesheet rules
│   ├── types/
│   │   └── event.ts          # Complete TypeScript data contracts & schemas
│   ├── data/
│   │   └── samplePlans.ts    # Rich pre-configured wedding and birthday blueprints
│   ├── utils/
│   │   └── formatters.ts     # INR currency, date formatting, and markdown exporter
│   └── components/
│       ├── Navbar.tsx        # Top navigation with sample plan dropdown & action buttons
│       ├── HeroLanding.tsx   # Hero showcase, category cards & feature highlights
│       ├── EventPlannerModal.tsx # Multi-step smart configuration form with sliders
│       ├── PlanDashboard.tsx # Tabbed interactive control center
│       ├── PrintableReport.tsx   # Print-only clean PDF report layout
│       ├── AiAssistantDrawer.tsx # Conversational copilot drawer with live sync
│       └── tabs/
│           ├── OverviewTab.tsx       # Concept, narrative & interactive color swatches
│           ├── BudgetTab.tsx         # Expense breakdown, stacked bars & auto-balance
│           ├── TimelineTab.tsx       # Phased preparation countdown & run-of-show
│           ├── VendorChecklistTab.tsx # Category-filtered vendor checklist & progress
│           └── InspirationTab.tsx    # Menu courses, games, entertainment & savings
├── tsconfig.json             # TypeScript compiler settings
└── vite.config.ts            # Vite bundler configuration
```

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **Google Gemini API Key** (obtainable from [Google AI Studio](https://aistudio.google.com/))

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/eventaura-planner.git
   cd eventaura-planner
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and add your Gemini API key:
   ```env
   GEMINI_API_KEY="your_actual_gemini_api_key_here"
   PORT=3000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🔒 Security & Safe Deployment

- **Zero Client-Side Exposure:** All Gemini API interactions happen exclusively server-side via Express routes (`/api/plan/generate`, `/api/plan/refine`, `/api/plan/regenerate-section`). The API key is never bundled into client JavaScript.
- **Strict `.gitignore`:** Secret configuration files (`.env`, `.env.local`), build artifacts (`dist/`), and dependencies (`node_modules/`) are strictly excluded from git tracking.
- **Realistic Estimates Disclaimer:** Clearly reminds users that budget allocations and vendor charges are market benchmarks and subject to seasonal vendor negotiations.

---

## 📜 License

Distributed under the Apache-2.0 License. See `LICENSE` for details.
