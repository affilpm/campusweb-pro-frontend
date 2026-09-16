import { Metadata } from "next";
import { SiteSettings, QuickLink } from "@/lib/public-types";

interface FeesItem {
  id: number;
  title: string;
  value: string;
}

interface PageData {
  fees: FeesItem[];
}

async function getPageData(): Promise<PageData | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    // Fetch fees
    const feesRes = await fetch(`${apiUrl}/api/v1/school-info/disclosure/`, {
      cache: "force-cache",
      next: { revalidate: 300 },
    });

    const feesData = feesRes.ok ? await feesRes.json() : {};

    return {
      fees: feesData.fees || [],
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export const metadata: Metadata = {
  title: "Fees | Public Disclosure",
  description: "Information about school fees and payment structure.",
};

export default async function FeesPage() {
  const data = await getPageData();

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const fees = data.fees || [];

  return (
    <main className="overflow-hidden bg-white">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900 pt-32 pb-20 lg:pt-40 lg:pb-28 text-white overflow-hidden">
        {/* Background decorations */}
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
            {/* Breadcrumb */}
            <div className="inline-flex items-center gap-2 text-sm text-blue-200 mb-6">
              <a href="/" className="hover:text-white transition-colors">
                Home
              </a>
              <span>/</span>
              <a
                href="/public-disclosure"
                className="hover:text-white transition-colors"
              >
                Public Disclosure
              </a>
              <span>/</span>
              <span className="text-white">Fees</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight tracking-tight">
              Fees
            </h1>
            <p className="text-lg sm:text-xl text-blue-100/90 max-w-2xl mx-auto">
              Information about school fees and payment structure
            </p>
          </div>
        </div>
      </section>

      {/* Fees Table Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {fees.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl">
                <p className="text-gray-500 text-lg">
                  No fees information available at this time.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-linear-to-r from-rose-500 to-pink-600 text-white">
                        <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider w-24">
                          Sl.No.
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                          Information
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {fees.map((item, index) => (
                        <tr
                          key={item.id}
                          className="hover:bg-pink-50/50 transition-colors"
                        >
                          <td className="py-5 px-6 text-gray-900 font-semibold text-center">
                            {index + 1}
                          </td>
                          <td className="py-5 px-6 text-gray-900 font-medium">
                            {item.title}
                          </td>
                          <td className="py-5 px-6 text-gray-600">
                            {item.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
