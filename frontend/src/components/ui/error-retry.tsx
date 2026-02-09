"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MaintenanceView from "./maintenance-view";

interface ErrorRetryProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  autoRetry?: boolean;
}

export default function ErrorRetry({
  title = "Unable to Load Content",
  message = "Please check your internet connection and try again.",
  onRetry,
  autoRetry = false,
}: ErrorRetryProps) {
  const [retryCount, setRetryCount] = useState(0);
  const [countdown, setCountdown] = useState(5);
  const [showMaintenance, setShowMaintenance] = useState(false);

  useEffect(() => {
    // Load retry count from session storage on mount
    const savedCount = sessionStorage.getItem("retry_count");
    if (savedCount) {
      setRetryCount(parseInt(savedCount, 10));
    }
  }, []);

  const handleRetry = () => {
    const newCount = retryCount + 1;
    setRetryCount(newCount);
    sessionStorage.setItem("retry_count", newCount.toString());

    // If we've retried 3 times without success, switch to maintenance view
    if (newCount >= 3) {
      setShowMaintenance(true);
      // Clear count after showing maintenance comfortably?
      // Or keep it so they stay in maintenance until session ends.
      // Let's keep it.
      return;
    }

    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoRetry && countdown > 0 && !showMaintenance) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (autoRetry && countdown === 0 && !showMaintenance) {
      handleRetry();
    }
    return () => clearInterval(timer);
  }, [autoRetry, countdown, showMaintenance]);

  // Escalation: Show Maintenance View if retries fail
  if (showMaintenance) {
    return <MaintenanceView />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-100"
      >
        <div className="mb-6 bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-10 h-10 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          {message}
          {autoRetry && (
            <span className="block mt-2 text-sm font-medium text-blue-600">
              Retrying in {countdown}s...
            </span>
          )}
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleRetry}
          className="w-full py-3.5 px-6 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {autoRetry ? "Retry Now" : "Try Again"}
        </motion.button>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400">Attempt {retryCount + 1} of 3</p>
        </div>
      </motion.div>
    </div>
  );
}
