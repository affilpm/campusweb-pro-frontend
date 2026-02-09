"use client";

import { motion } from "framer-motion";

export default function MaintenanceView() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center bg-white rounded-2xl shadow-xl p-8 border border-slate-100"
      >
        <div className="mb-6 bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-10 h-10 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-3">
          System Maintenance
        </h1>

        <p className="text-slate-600 mb-8 leading-relaxed">
          We are currently performing scheduled maintenance to improve our
          services. Please check back shortly.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-colors"
          >
            Refresh Page
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-50">
          <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">
            Service Status: Offline
          </p>
        </div>
      </motion.div>
    </div>
  );
}
