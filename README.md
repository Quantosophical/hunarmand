# Hunarmand Marketplace MVP

Hunarmand is an investor-ready, full-stack artisan marketplace designed to bridge the gap between traditional craftsmen and modern consumers. The platform empowers local artisans by giving them direct access to a global digital market without intermediaries, helping preserve cultural heritage while ensuring fair compensation.

## 🌟 Key Features

- **Role-Based Authentication:** Robust systems for Buyers, Artisans, and Admins via **NextAuth v4**.
- **Artisan Ecosystem:** Dedicated dashboards and profiles for Artisans, including a KYC/Verification process (Aadhar, Bank Details) to ensure trust.
- **E-Commerce Essentials:** Seamless dynamic global state cart management with **Zustand**, secure checkout powered by **Razorpay**, product wishlist, reviews, and detailed product attributes (including GI tagging and shipping weights).
- **Communication & Engagement:** Built-in messaging systems between buyers and artisans, and instant notifications.
- **Media Management:** Optimized and lightning-fast image delivery via **Cloudinary**.
- **Admin Governance:** Comprehensive dashboard to verify artisan applications, manage categories, and oversee marketplace activities.
- **Fluid UI/UX:** Stunning, modern, dynamic interfaces featuring **Framer Motion** animations, **Tailwind CSS v4** styling, and smooth transitions.

## 💻 Tech Stack

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://reactjs.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)

### Backend & Database
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** SQLite (Development) / Easily translatable to PostgreSQL/MySQL
- **Authentication:** NextAuth (Credentials Provider)

### Integrations
- **Payments:** Razorpay
- **Image Hosting:** Cloudinary
- **Emails:** Resend (for transaction emails and notifications)
- **PDF Generation:** React-PDF Renderer (Invoices / Shipping Labels)

## 📁 Project Structure

```text
hunarmand/
├── prisma/             # Prisma schema, database rules, and seed scripts
├── public/             # Static assets
└── src/
    ├── app/            # Next.js App Router (Contains all pages & API routes)
    │   ├── account/
    │   ├── admin/
    │   ├── artisan/
    │   ├── browse/
    │   ├── cart/
    │   ├── checkout/
    │   ├── dashboard/
    │   ├── join-as-artisan/
    │   ├── login/
    │   ├── product/
    │   ├── register/
    │   └── verify/
    ├── components/     # Reusable React components (UI, layout, features)
    ├── lib/            # Utility functions, instances, & configurations
    └── types/          # TypeScript definitions
```

## 🚀 Getting Started

First, clone the repository and install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Environment Variables

Create a `.env` file in the root directory and configure the necessary variables. Ensure you include credentials for your database, NextAuth, Cloudinary, Razorpay, and Resend.

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID="your-razorpay-key"
RAZORPAY_KEY_SECRET="your-razorpay-secret"

# Resend
RESEND_API_KEY="your-resend-key"
```

### Database Setup

Run the following commands to initialize the database and push the schema:

```bash
npx prisma db push
```

If you wish to seed the database with initial master-data:

```bash
npm run prisma db seed
```

### Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the live application.
