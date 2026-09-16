import { Metadata } from "next";
import Link from "next/link";

import { getPageSEO } from "@/lib/seo-api";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO("public-disclosure");

  return {
    title: seo?.title || "Public Disclosure | School",
    description:
      seo?.meta_description ||
      "Public disclosure information including general details and mandatory documents.",
    openGraph: {
      title: seo?.title || "Public Disclosure",
      description: seo?.meta_description,
      images: seo?.og_image ? [seo.og_image] : undefined,
    },
  };
}

const disclosureSections = [
  {
    name: "General",
    description:
      "General information like school timings, affiliation, contact details, and more.",
    href: "/public-disclosure/general",
    icon: "📋",
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "Documents",
    description:
      "Download mandatory documents, certificates, and official files.",
    href: "/public-disclosure/documents",
    icon: "📄",
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "Results & Academics",
    description: "Download academic results, reports, and related documents.",
    href: "/public-disclosure/results-academics",
    icon: "📊",
    color: "from-emerald-500 to-teal-600",
  },
  {
    name: "Infrastructure",
    description: "Information about our school infrastructure and facilities.",
    href: "/public-disclosure/infrastructure",
    icon: "🏗️",
    color: "from-violet-500 to-purple-600",
  },
  {
    name: "Fees",
    description: "Information about school fees and payment structure.",
    href: "/public-disclosure/fees",
    icon: "💰",
    color: "from-rose-500 to-pink-600",
  },
];

export default function PublicDisclosurePage() {
  return (
    <main className="overflow-hidden bg-white">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900 pt-32 pb-20 lg:pt-40 lg:pb-28 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          />
          <div
            className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-sm text-blue-200 mb-6">
              <a href="/" className="hover:text-white transition-colors">
                Home
              </a>
              <span>/</span>
              <span className="text-white">Public Disclosure</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight tracking-tight">
              Public Disclosure
            </h1>
            <p className="text-lg sm:text-xl text-blue-100/90 max-w-2xl mx-auto">
              Transparency and accountability through public information
            </p>
          </div>
        </div>


      </section>

      {/* Sections Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-6">
              {disclosureSections.map((section) => (
                <Link
                  key={section.name}
                  href={section.href}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-blue-200 p-8 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 bg-linear-to-br ${section.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <span className="text-3xl">{section.icon}</span>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {section.name}
                  </h2>

                  <p className="text-gray-600 leading-relaxed">
                    {section.description}
                  </p>

                  {/* Arrow */}
                  <div className="mt-6 flex items-center text-blue-600 font-semibold">
                    <span>View Details</span>
                    <svg
                      className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
