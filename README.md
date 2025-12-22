# School Admin Portal & Frontend

A modern, responsive school management portal built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. This application serves as the public-facing website and includes a secure admin panel for content management.

## 🚀 Features

*   **Public Website:** Beautiful, responsive pages for Home, About, Academics, Admissions, and more.
*   **Secure Admin Portal:** Protected route (`/secure-admin`) for managing school data.
*   **Media Gallery:** Optimized image serving using **Cloudflare R2**.
*   **Dynamic Content:** Fetches data from a Django backend.
*   **Modern UI:** Built with Tailwind CSS, Framer Motion animations, and specific UI components.

## 🛠️ Tech Stack

*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **HTTP Client:** [Axios](https://axios-http.com/)
*   **Formatting:** Prettier & ESLint

## 🏁 Getting Started

### Prerequisites

*   Node.js 18.17 or later
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/affilpm/school-frontend.git
    cd school-frontend/frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  Configure Environment Variables:
    Create a `.env.local` file in the `frontend` directory:
    ```env
    NEXT_PUBLIC_API_URL=https://api.affils.site
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```bash
frontend/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── secure-admin/    # Protected Admin Routes
│   │   └── ...              # Public Routes
│   ├── components/          # Reusable UI components
│   ├── contexts/            # React Context (Auth, etc.)
│   ├── lib/                 # Utilities and API clients
│   └── styles/              # Global styles
├── public/                  # Static assets (images, fonts)
└── next.config.ts           # Next.js configuration
```

## 🚀 Deployment

This project is optimized for deployment on **Vercel**.

1.  Push your code to GitHub.
2.  Import the project into Vercel.
3.  Set the Root Directory to `frontend`.
4.  Add the Environment Variable `NEXT_PUBLIC_API_URL`.
5.  Deploy!

## 🔐 Authentication & Cookies

The Admin Portal uses **HttpOnly Cookies** for secure authentication.
*   **Local Development:** Ensure your browser accepts third-party cookies from `localhost` if your backend is hosted remotely.
*   **Production:** The frontend and backend communicate securely over HTTPS.

## 📄 License

This project is private and proprietary.
