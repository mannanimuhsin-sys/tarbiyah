# Tarbiyah – Islamic Education Platform 🕌

> **Learn Quran. Build Character. Grow in Faith.**

A premium full-stack Islamic education platform built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

## ✨ Features

- 🔐 **Authentication** – Student (mobile/password) + Admin (admin/4321) with JWT
- 📋 **Student Registration** – Unique mobile, pending approval system
- 🛡️ **Super Admin Dashboard** – Approve/reject students, manage teachers, mark attendance
- 📖 **Interactive Quran Module** – Tilawah reader, Qaida Nooraniyah, Tajweed rules, 30-Juz Hifz tracker
- 🎥 **Live Classes** – Zoom & Google Meet integration with reminders
- 📺 **Recorded Classes** – Cloudflare R2 video vault with filters
- 🏆 **Programs & Musabaqa** – Competition and event management
- 📜 **Certificates** – Auto-generated with QR verification codes
- 📊 **Reports** – Printable PDF progress reports with teacher remarks
- 🌐 **Bilingual** – English and Malayalam (മലയാളം) support
- 🌙 **Dark Mode** – Full dark/light theme toggle
- 📱 **PWA Ready** – Installable on mobile devices

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔑 Demo Credentials

| Role | Credentials |
|------|-------------|
| **Super Admin** | `admin` / `4321` |
| **Student (Approved)** | Mobile: `9876543210` / Password: `password123` |
| **Student (Pending)** | Mobile: `9876543230` (tests pending approval rule) |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React 18 |
| Language | TypeScript |
| Styling | Tailwind CSS, Custom Islamic design system |
| Auth | JWT via `jose`, HttpOnly cookies |
| Database | JSON (dev) → Supabase PostgreSQL (prod) |
| Video CDN | Cloudflare R2 |
| PWA | Web App Manifest |

## 🗄️ Database Setup (Supabase)

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run `src/database/schema.sql` in the Supabase SQL editor
3. Add environment variables:

```env
JWT_SECRET=your_strong_secret_here
DATABASE_URL=your_supabase_connection_string
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/              # All REST API routes
│   ├── admin/            # Super Admin dashboard
│   ├── dashboard/        # Student dashboard
│   ├── quran-module/     # Quran learning module
│   ├── live-classes/     # Zoom & Meet classes
│   ├── recorded-classes/ # Video vault
│   ├── programs/         # Musabaqa & events
│   ├── certificates/     # Certificate system
│   └── reports/          # Progress reports
├── components/
│   ├── common/           # IslamicMotif, BismillahBanner
│   └── layout/           # Navbar, Footer
├── context/              # Auth, Theme, Language contexts
├── database/             # schema.sql (Supabase)
└── lib/                  # types.ts, db.ts, auth.ts, translations.ts
```

## 📜 License

MIT License – Built for Islamic education excellence.
