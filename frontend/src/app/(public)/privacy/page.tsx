import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Novel International School',
  description: 'Privacy Policy and data protection guidelines for Novel International School.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Privacy Policy</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            We are committed to protecting your personal information and your right to privacy.
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy & Data Collection</h2>
            <p className="text-gray-700">
              We respect your privacy. The only personal information we collect is what you voluntarily provide to us via our <strong>Contact Us</strong> or <strong>Admissions</strong> forms (such as your Name, Email, Phone Number, and Message).
            </p>
            <p className="text-gray-700 mt-4">
              We use this information solely to respond to your inquiries and process your requests. We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties.
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
