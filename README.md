# ARTELLIUM - Pan-African & Global Fine Art Marketplace

ARTELLIUM is an elite fine art e-commerce platform and auction house designed to unite rich African creative heritage with global luxury art market standards. Built with Next.js (App Router), Tailwind CSS, JavaScript, and Supabase integration.

---

## 🌟 Brand Aesthetics & Key Features

### 1. Brand Color System
- **Gold (`#D4AF37`)**: Primary luxury accent, gold leaf borders, pricing, badges.
- **Deep Black (`#07080A`)**: Rich dark mode canvas and glassmorphic card overlays.
- **Dark Emerald Green (`#062319`)**: Heritage accent for verified exhibitions and badges.
- **Royal Crimson Red (`#8B0000`)**: Live auction alerts, countdown timers, and bid triggers.

### 2. Core Requirements Implemented
- **Structure**: Modeled after intuitive e-commerce powerhouses (Jumia-style layout combined with fine art curation).
- **Search & Cart Input**: Header instant search with category selectors and slide-over cart drawer with price calculations (₦ NGN & $ USD).
- **Artist Video Spotlight Section**: Situated right down the page **above the footer** with interactive video pop-up player and **Admin Upload Management**.
- **Artist/Seller Registration**: Self-service onboarding with brief bio, artwork upload console, and tier selections:
  - **Standard Category**: ₦30,000 monthly, ₦200,000 yearly (discounted)
  - **Premium Category**: ₦50,000 monthly, ₦350,000 yearly (discounted)
- **Zero-Hindrance Artwork Upload Console**: Instant publishing to live marketplace catalogue with title, medium, dimensions, price, and provenance story.
- **Buyer Registration & Account Portal**: Convenient account tracking, order ledgers, and verified settlement status.
- **Live Auction Facility**: Bidding arena with real-time countdown timer, minimum bid increments, and live bidder feeds.
- **Virtual Exhibition Facility**: Curated 3D-styled gallery rooms with artwork preview overlays.
- **Customer Reviews & Feedback**: Star rating system and review submission on artwork detail pages.
- **Admin Control Dashboard**: Executive view for monitoring volume, managing subscription tiers, approving listings, and publishing artist video features.

---

## 📁 Project Folder Structure

```
ARTELLIUM AFRICA /
├── app/
│   ├── layout.js              # Root layout with StoreProvider, Navbar, VideoModal & Footer
│   ├── page.js                # Jumia-inspired luxury home page (Auctions, New, Sold, Exhibitions)
│   ├── globals.css            # Custom brand theme variables, glassmorphism & typography
│   ├── explore/page.js        # Catalogue explorer with multi-filter search
│   ├── artwork/[id]/page.js   # Detailed artwork view, provenance & customer reviews
│   ├── auctions/page.js       # Live auction bidding facility & timers
│   ├── exhibitions/page.js    # Virtual exhibition gallery rooms
│   ├── artist/
│   │   ├── register/page.js   # Artist registration & subscription tiers (Standard vs Premium)
│   │   └── dashboard/page.js  # Zero-hindrance self-service upload console
│   ├── buyer/
│   │   └── account/page.js    # Buyer profile, order tracking & certificates
│   └── admin/
│       └── dashboard/page.js  # Admin panel (video spotlights manager, metrics & listing control)
├── components/
│   ├── Navbar.js              # Header with logo, Jumia search box, cart badge & demo role switcher
│   ├── Footer.js              # Footer with authenticity guarantee & heritage trust badges
│   ├── ArtistVideoModal.js    # Pop-up video player section (above footer) + Admin video upload
│   ├── ArtworkCard.js         # Product card with price in ₦ and $, badges, rating & quick add
│   ├── AuctionCard.js         # Live auction card with countdown clock & bid placement modal
│   ├── CartDrawer.js          # Slide-over cart drawer with price total & checkout link
│   ├── CheckoutModal.js        # Checkout simulation with address & Paystack/card payment options
│   ├── HeroBanner.js          # Hero banner showcasing African heritage & global fine art
│   └── CategoryBar.js        # Jumia-style category filter bar
├── context/
│   └── store-context.js       # Global React state (Cart, User Roles, Artworks, Videos, Bids)
├── lib/
│   ├── supabase.js            # Supabase database & auth client setup
│   └── mock-data.js           # Initial dataset (Artworks, Auctions, Videos, Exhibitions, Reviews)
├── supabase/
│   └── schema.sql             # Full production PostgreSQL schema & RLS policies
├── tailwind.config.js         # Custom brand colors (Gold, Emerald Green, Black, Crimson)
└── package.json               # Dependencies (Next.js, React, Tailwind, Lucide Icons, Supabase)
```

---

## ⚡ Quick Setup & Installation Instructions

### 1. Prerequisites
- Node.js 18.0 or higher
- npm or yarn

### 2. Installation
Open your terminal in the workspace directory and execute:
```bash
# Navigate to project folder (if not already there)
cd "c:\Users\USER\Desktop\ARTELLIUM AFRICA"

# Install all required npm packages
npm install
```

### 3. Environment Setup (Optional for Supabase Integration)
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```
*(Note: If no Supabase environment keys are provided, ARTELLIUM automatically runs on its built-in interactive mock state layer for zero-config local testing).*

### 4. Database Setup (Supabase PostgreSQL)
1. Log into your [Supabase Dashboard](https://supabase.com).
2. Go to **SQL Editor** -> **New Query**.
3. Copy the full contents of `supabase/schema.sql` into the SQL Editor and click **Run**.

### 5. Running the Application locally
```bash
npm run dev
```
Open your browser at **`http://localhost:3000`** to view ARTELLIUM live.

---

## 🧪 Testing User Roles & Workflows

ARTELLIUM comes equipped with an instant **Demo Role Switcher** located in the top navigation bar header:
- **Buyer Mode (Dr. Evelyn Carter)**: Explore catalogue, place auction bids, submit artwork reviews, add items to cart, and execute checkout.
- **Artist Mode (Kofi Mensah)**: View subscription tier (Standard ₦30k vs Premium ₦50k), access the zero-hindrance upload console, and publish new paintings/sculptures instantly.
- **Admin Mode (Executive)**: Access the Admin Dashboard to add pop-up videos of artists speaking about their work, manage platform volume, and oversee listings.
