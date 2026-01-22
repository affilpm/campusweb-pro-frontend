import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use | Novel International School',
  description: 'Terms and conditions for using the Novel International School website.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 py-20 px-4">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700">
              By accessing our website, you agree to be bound by these Terms of Use and to comply with all applicable laws and regulations. 
              If you do not agree with these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Intellectual Property Rights</h2>
            <p className="text-gray-700 mb-4">
              Other than the content you own, key identifiers, logos, and images, Novel International School and/or its licensors own all the intellectual property rights and materials contained in this website.
            </p>
            <p className="text-gray-700">
              You are granted limited license only for purposes of viewing the material contained on this website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Restrictions</h2>
            <p className="text-gray-700 mb-4">
              You are specifically restricted from all of the following:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Publishing any website material in any other media without prior consent.</li>
              <li>Selling, sublicensing and/or otherwise commercializing any website material.</li>
              <li>Using this website in any way that is or may be damaging to this website.</li>
              <li>Using this website in any way that impacts user access to this website.</li>
              <li>Using this website contrary to applicable laws and regulations, or in any way may cause harm to the website, or to any person or business entity.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Content Liability</h2>
            <p className="text-gray-700">
              We shall not be held responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. 
              No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Privacy</h2>
            <p className="text-gray-700">
              Please read our <a href="/privacy">Privacy Policy</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Governing Law</h2>
            <p className="text-gray-700">
              Any claim related to Novel International School's website shall be governed by the laws of our operating jurisdiction without regards to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about these Terms of Use, please contact us via our <a href="/contact">Contact Page</a>.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
