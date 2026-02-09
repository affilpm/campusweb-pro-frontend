"use client";

import { ResultsAcademicsDocument } from "@/lib/public-types";

interface ResultsAcademicsSectionProps {
  documents: ResultsAcademicsDocument[];
}

export default function ResultsAcademicsSection({
  documents,
}: ResultsAcademicsSectionProps) {
  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Results & Academics
          </h2>
          <div className="w-20 h-1 bg-linear-to-r from-emerald-500 to-teal-500 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Latest academic results and reports
          </p>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-emerald-200 p-6 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {doc.title}
                  </h3>
                  {doc.value && (
                    <p className="text-sm text-gray-500 mb-3">{doc.value}</p>
                  )}
                  {doc.file && (
                    <a
                      href={doc.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700"
                    >
                      <span>Download</span>
                      <svg
                        className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
