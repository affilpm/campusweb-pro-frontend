import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use | Novel International School',
  description: 'Terms and conditions for using the Novel International School website.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Terms of Use</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Please read these terms and conditions carefully before using our website.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 prose prose-lg hover:prose-a:text-blue-600">
          <p className="lead text-gray-600 mb-8">
            Last updated: {new Date().getFullYear()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Website Usage</h2>
            <p className="text-gray-700">
              Welcome to Novel International School's website. By accessing this site, you agree to use it responsibly and for its intended purpose—to learn about our school, our curriculum, and our admissions process.
            </p>
            <p className="text-gray-700 mt-4">
              All content on this website, including text, images, and logos, is the property of Novel International School. Please do not misuse our contact forms or attempt to access restricted areas of the site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact</h2>
            <p className="text-gray-700">
              If you have any questions, please contact us via our <a href="/contact">Contact Page</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
