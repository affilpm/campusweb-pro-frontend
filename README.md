# 🔐 School Management System - Frontend

A secure, production-ready frontend for the School Management System, built with **Next.js 16 (React 19)**, **Tailwind CSS v4**, and **Zustand 5**.

> Note: This repository contains only the Frontend code. The backend is handled separately via Django/DRF.

## 📋 Table of Contents

- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Security Features](#security-features)
- [Deployment (Vercel)](#deployment-vercel)

## 🏗 Architecture

The frontend is a completely decoupled Next.js application that communicates with a Django REST API backend. It is designed to be hosted serverlessly on **Vercel** (no Docker required).

* **Framework:** Next.js 16 (App Router)
* **Styling:** Tailwind CSS v4
* **State Management:** Zustand 5
* **Animations:** Framer Motion 12
* **HTTP Client:** Axios (with automatic token refresh interceptors)

## 📁 Project Structure

```text
.
└── frontend/                   # Next.js 16 Application Root
    ├── src/
    │   ├── app/                # App Router (Admin & Public)
    │   ├── components/         # Reusable Components
    │   ├── lib/                # API Client & Types
    │   └── stores/             # Zustand Global State
    ├── package.json            # Frontend dependencies
    └── .env.local              # Local environment variables
```

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env.local` file inside the `frontend` directory:
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
3. Import your repository, and ensure the **Root Directory** is set to `frontend`.
4. In the **Environment Variables** section, add the following key-value pairs:
   * `NEXT_PUBLIC_API_URL` = `https://your-backend-api-domain.com`
   * `NEXT_PUBLIC_R2_URL` = `https://your-media-r2-domain.com`
   * `NEXT_PUBLIC_APP_URL` = `https://your-frontend-domain.com`
5. Click **Deploy**. Vercel will build and serve your Next.js application automatically with built-in edge caching and SSL.
