# 🔐 Public School Website - Frontend

A secure, production-ready frontend for the Public School Website, built with **Next.js 16 (React 19)**, **Tailwind CSS v4**, and **Zustand 5**.

> Note: This repository section contains only the Frontend code. The backend is handled separately via Django/DRF in the root directory.

## 📋 Table of Contents

- [Architecture](#architecture)
- [Public Pages & Features](#public-pages--features)
- [Secure Admin Dashboard (CMS)](#secure-admin-dashboard-cms)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Security Features](#security-features)
- [Deployment (Vercel)](#deployment-vercel)

## 🏗 Architecture

The frontend is a completely decoupled Next.js application that communicates with a Django REST API backend. It is designed to be hosted serverlessly on **Vercel**.

* **Framework:** Next.js 16 (App Router)
* **Styling:** Tailwind CSS v4
* **State Management:** Zustand 5
* **Animations:** Framer Motion 12
* **HTTP Client:** Axios (with automatic token refresh interceptors)

## 🌐 Public Pages & Features

The public-facing portal provides a comprehensive and responsive experience for students, parents, and visitors.

* **Home (`/`)**: Dynamic landing page featuring hero banners, school statistics, recent notices, and testimonials.
* **About Us (`/about`)**: Information regarding the school's Vision & Mission, and the Principal's Message.
* **Academics (`/academics`)**: Details on the school's curriculum, streams, and academic results.
* **Admissions (`/admissions`)**: Step-by-step admission process, settings, and guidelines.
* **Facilities (`/facilities`)**: Interactive showcase of the school's infrastructure and facilities (with images).
* **Gallery (`/gallery`)**: Categorized photo albums highlighting school events and achievements.
* **Notices (`/notices`)**: Announcements and important updates from the school administration.
* **Contact (`/contact`)**: Contact information and a dynamic form for inquiries and messages.
* **Compliance Pages**: Dedicated pages for `Public Disclosure`, `Privacy Policy`, and `Terms & Conditions`.

## 🛡️ Secure Admin Dashboard (CMS)

Located at `/secure-admin`, the platform includes a fully-featured Content Management System (CMS) for school administrators to manage website data dynamically.

* **Dashboard & Analytics**: Overview of site statistics and recent activity.
* **Content Management**: Manage About content, Hero banners, Principal's message, and Testimonials.
* **Academics & Admissions**: Update curriculum, results, and admission steps.
* **Facilities & Gallery**: Upload and categorize facility images and event galleries.
* **Communication**: Publish and manage Notices and Events.
* **Messages**: View and respond to Contact Form submissions.
* **Site Configuration**: Global Site Settings, SEO management, and Public Disclosure documents.

## 📁 Project Structure

```text
.
└── frontend/                   # Next.js 16 Application Root
    ├── src/
    │   ├── app/                # App Router
    │   │   ├── (public)/       # All public-facing routes
    │   │   └── secure-admin/   # Protected CMS routes
    │   ├── components/         # Reusable UI Components
    │   ├── lib/                # API Client, Interceptors & Types
    │   └── stores/             # Zustand Global State
    ├── package.json            # Frontend dependencies
    └── .env.local              # Local environment variables
```

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at: `http://localhost:3000`

## 🔒 Security Features

Authentication uses HttpOnly cookies managed by the backend, combined with in-memory access tokens to prevent XSS exposure.

| Feature | Implementation |
|---------|---------------|
| Access Token Storage | In-memory (Zustand store) |
| Refresh Token Storage | HTTP-only cookie (handled by backend API) |
| Auto-Refresh | Axios interceptors seamlessly handle 401s and retry requests |

## 🚢 Deployment (Vercel)

This frontend application does **not** use Docker. It is a standard Node/Next.js app and should be deployed to **Vercel** for the best performance and zero-config deployment.

1. Push this code to your GitHub repository.
2. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your repository, and ensure the **Root Directory** is set to `frontend-school/frontend` (or wherever your `package.json` is located).
4. In the **Environment Variables** section, add the following key-value pairs:
   * `NEXT_PUBLIC_API_URL` = `https://your-backend-api-domain.com`
   * `NEXT_PUBLIC_R2_URL` = `https://your-media-r2-domain.com`
   * `NEXT_PUBLIC_APP_URL` = `https://your-frontend-domain.com`
5. Click **Deploy**. Vercel will build and serve your Next.js application automatically with built-in edge caching and SSL.
