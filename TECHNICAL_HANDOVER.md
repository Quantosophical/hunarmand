# Hunarmand: Technical Handover & Action Plan

**To:** Kafeel (Co-founder)
**From:** Engineering Team
**Date:** April 2026
**Project Phase:** Trust & Identity Protocol

---

## 1. Context & Master State

Welcome to the **Hunarmand** codebase! Thus far, the platform has evolved from a basic UI prototype into a functional marketplace MVP with local database persistence, role-based dashboards, and complete e-commerce mechanisms. 

Before diving in, please ensure you review `Project_History.md`. It holds the comprehensive development saga, explaining the architectural whys and hows of NextAuth implementations, state management with Zustand, and Cloudinary media uploading.

### Technology Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4, Framer Motion, Vanilla CSS (index.css)
- **Database:** MongoDB (via Prisma ORM)
- **State Management:** Zustand (Client-side optimizations)

---

## 2. Your Mission: The "Trust & Identity Protocol"

The goal of this phase is to establish absolute provenance, transparency, and deep connections across the Hunarmand platform. The database schema in `prisma/schema.prisma` has already been pre-configured to support these upcoming features. I have opened up the necessary initial files. 

Here is exactly what needs to be completed:

### A. AI-Powered D2A (Direct-to-Artisan) Translation Chat 
**Status:** Scaffolded. 
**Relevant Files:** `src/components/chat/D2AChat.tsx`, `src/lib/translationMock.ts`
**Database Support:** The `Conversation` and `Message` models exist. Notice `Message.translatedText` is ready for the dual-language payload.
**Your Tasks:**
- Connect the frontend `D2AChat.tsx` component to an actual AI endpoint (or fortify the `/api/chat/translate` route using `translationMock.ts` logic).
- Implement robust polling or integrate WebSockets so the artisan and the buyer receive real-time semantic translation (English <-> Kashmiri/Urdu).

### B. Pehchan API (Digital Legacy Verification System)
**Status:** Database ready.
**Relevant Files:** Needed in Artisan Dashboard and Admin Dashboard.
**Database Support:** `ArtisanProfile` model contains `pehchanId`, `isPehchanVerified`, and encrypted fields (`aadharEncrypted`, `bankAccountEncrypted`).
**Your Tasks:**
- Construct an API layer that pings the government/Pehchan endpoints (or a mock service) to validate an artisan's `pehchanId`.
- Update the KYC flow to immediately flip `isPehchanVerified` to `true` upon success. 

### C. Biometric-Linked Payout Transparency Widget
**Status:** Database ready.
**Relevant Files:** Requires a new component, likely `src/components/dashboard/PayoutWidget.tsx`.
**Database Support:** `PayoutRequest` model (with PENDING, APPROVED, PAID statuses).
**Your Tasks:**
- Construct a dedicated dashboard widget for artisans to track their finances and request payouts. 
- You need to ensure the UI feels highly transparent and trustworthy. Consider adding a mock "biometric/2FA auth" step before finalizing the payout creation.

### D. Soulbound Certification Page (Proof-of-Work)
**Status:** Initial QR mechanism discussed, needs refinement. 
**Relevant Files:** `src/app/verify/[id]/page.tsx`
**Your Tasks:**
- We need the QR verifiable link to act as a localized "soulbound token." 
- When a buyer scans the QR on a delivered item, they should land on a beautifully designed page demonstrating the exact timeline and geography of the product (making use of `gpsCoordinates` and `isGITagged` fields on the `Product` model). 

### E. WebXR "Portal to Kashmir" (Immersive Workshops)
**Status:** Conceptual.
**Your Tasks:**
- Implement an immersive view on the master artisan profiles. 
- We want a component that utilizes basic WebGL/Three.js or standard WebXR to show a 360-degree panorama of their real workshop. 

---

## 3. General Rules & Best Practices

1. **Maintain the Aesthetic:** Hunarmand is a *luxury* crafts platform. Do not use generic component styles. Rely on the "glassmorphism", dark modes, and subtle gold accents defined in the current configuration. Use micro-animations.
2. **Server/Client Boundaries:** We are using Next.js App Router. Keep `use client` components leaf-level where possible, especially anything relying on `zustand`. 
3. **Database Mutations:** Never mutate Prisma from a Client Component context. Always route through secure Next.js Server Actions or protected API boundaries checking `getServerSession(authOptions)`.

Good luck! You're building the bridge between ancient craftsmanship and the modern digital economy.
