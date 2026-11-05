# 🧵 Tales by Threads — Admin Suite Architecture & Implementation Plan

> **Goal:** Build an elite, production-grade Studio Management & CRM Suite for the handcrafted Aari & Maggam Work business with modern SaaS standards, mobile responsiveness, delivery management, repeat customer intelligence, and full gallery content editing.

---

## 🧭 System Overview & Layout Architecture

```
+-----------------------------------------------------------------------------------------------+
| TOPBAR: Studio Brand | Search Bar | Quick Actions | Notification Count | Admin Profile / Logout|
+-------------------+---------------------------------------------------------------------------+
| SIDEBAR (Left)    | MAIN WORKSPACE (Right - Fully Responsive Mobile & Desktop)                |
|                   |                                                                           |
| 📊 Dashboard       | • Desktop: Fixed Sleek Burgundy/Gold Sidebar + Clean Card Workspace       |
| 📦 Orders & Ops   | • Mobile: Top Header with Hamburger Drawer / Slide-Over Sheet             |
| 👥 Customer CRM   | • Dynamic Tab Switching without full page reloads                         |
| 🖼️ Live Gallery   | • Live Database Reflection + Local Fallback Sync                          |
| 💰 Revenue & Stats|                                                                           |
+-------------------+---------------------------------------------------------------------------+
```

---

## 📌 Implementation Roadmap (Step-by-Step)

### [x] Step 1: Database Schema Extension & Gallery Edit API
- **DB Schema (`src/db/schema.ts`):**
  - Added to `enquiries`: `orderAmount`, `advanceAmount`, `deliveryDate`, `orderSource`, `measurements`.
  - Added to `galleryImages`: `price`, `tags`.
- **API Updates:**
  - Implemented `PATCH /api/gallery` with title, category, description, price, and tags editing (both DB and local storage support).
  - Extended `PATCH /api/enquiry` with amounts, delivery dates, measurements, and status.
  - Updated `src/lib/local-storage.ts` with local fallback support.

---

### [x] Step 2: Responsive Admin Shell (Left Sidebar Menu + Topbar)
- Implemented **Left Sidebar** with Luxury Theme (`#3A2025` Burgundy & `#B08A57` Gold).
- Implemented **Mobile Navigation**: Hamburger trigger with slide-over drawer and backdrop blur.
- Implemented **Multi-tab Switching**: Dashboard, Orders, Customers CRM, Live Gallery Studio, and Revenue Analytics.
- Built live synchronized operational metric cards with immediate notification indicators.

---

### [x] Step 3: Executive Dashboard & Delivery Alert Center
- **Top Metrics Live:** Total billed revenue, collected advance, deliveries due today, active in-frame orders, and repeat customer percentage.
- **Urgent Delivery Tracker:** Integrated priority pipeline with color-coded badges (DUE TODAY alert vs upcoming deadlines) and quick order view.
- **Synchronized Website Reflection:** Public homepage gallery updated to reflect live items and prices set via Admin.

---

### [ ] Step 4: Orders & Operations Hub

---

### [x] Step 4: Orders & Operations Hub
- Built full Order lifecycle tracker (`New Lead`, `Contacted`, `Advance Paid`, `In Wooden Frame`, `Trial Fixed`, `Delivered`).
- Created **Walk-in / Direct Studio Order Creation Modal** (`➕ New Walk-in Order`).
- Built Order Detail & Measurements Drawer with payment calculation (Total, Advance, Balance).
- Added One-tap WhatsApp status message triggers with bridal templates tailored to each stage.

---

### [ ] Step 5: Customer CRM & Repeat Bride Intelligence

---

### [x] Step 5: Customer CRM & Repeat Bride Intelligence
- Grouped customer profiles automatically by mobile number.
- Automatic badges: **👑 Repeat Bride** (2+ orders) vs **🌟 New Bride**.
- Built **Customer Order History Modal (`📜 History`)**: Lifetime spend, list of past orders placed, status, and direct jump to order detail.
- One-touch direct WhatsApp and Phone Call actions for each client.

---

### [x] Step 6: Live Gallery Studio Enhancement & Price Reflection
- Full editing capability for live gallery items: Title, Category, Description, Price Tag, and Tags.
- Seamless dual-storage: Saves to PostgreSQL Database if connected, or graceful local fallback without breaking UI.
- Immediate dynamic reflection on public customer gallery (cards + lightbox zoom modal).

---

### [ ] Step 7: Verification, Mobile Polish & Client Handover
- End-to-end testing across mobile, tablet, and desktop screens.
- Verify TypeScript types, Next.js build, and data persistence.
- Client walkthrough documentation.
