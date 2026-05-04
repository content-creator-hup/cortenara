import { motion } from "framer-motion";

export default function TermsOfServicePage() {
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-10">
            <a href="/" className="flex items-center gap-2 text-violet-400 hover:text-violet-300 text-sm transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Back to CreatorFlow
            </a>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-violet-400 font-medium">CreatorFlow</span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-zinc-500 text-sm mb-12">Last updated: {today}</p>

          <div className="space-y-10">

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p className="text-zinc-400 leading-relaxed">
                By accessing or using CreatorFlow ("the Service"), you agree to be bound by these Terms of
                Service. If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
              <p className="text-zinc-400 leading-relaxed">
                CreatorFlow is a content creation management platform that allows users to write and organize
                scripts, manage media files via Google Drive, and view YouTube analytics. The Service
                integrates with Google APIs to provide these features.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. User Accounts</h2>
              <p className="text-zinc-400 leading-relaxed mb-3">
                To use CreatorFlow, you must sign in with a valid Google account. You are responsible for:
              </p>
              <ul className="space-y-2 text-zinc-400">
                {[
                  "Maintaining the security of your Google account credentials",
                  "All activities that occur under your account",
                  "Ensuring your use of the Service complies with applicable laws and regulations",
                  "Any content you create, upload, or store through the Service",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Acceptable Use</h2>
              <p className="text-zinc-400 leading-relaxed mb-3">You agree not to use the Service to:</p>
              <ul className="space-y-2 text-zinc-400">
                {[
                  "Violate any applicable local, national, or international law or regulation",
                  "Upload, store, or transmit any content that is illegal, harmful, or infringes on third-party rights",
                  "Attempt to gain unauthorized access to any part of the Service or its related systems",
                  "Use the Service for any commercial purpose other than your own content creation business",
                  "Circumvent, disable, or otherwise interfere with security features of the Service",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Google API Integration</h2>
              <p className="text-zinc-400 leading-relaxed">
                CreatorFlow integrates with Google Drive and YouTube APIs. Your use of these integrations
                is also subject to{" "}
                <a
                  href="https://policies.google.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400 hover:text-violet-300 underline"
                >
                  Google's Terms of Service
                </a>
                . We access only the minimum data necessary to provide the requested features. We operate
                in compliance with the{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400 hover:text-violet-300 underline"
                >
                  Google API Services User Data Policy
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Intellectual Property</h2>
              <p className="text-zinc-400 leading-relaxed">
                You retain full ownership of all content you create using CreatorFlow (scripts, notes,
                project data). By using the Service, you grant us a limited, non-exclusive license to
                store and process your content solely to provide the Service to you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Disclaimer of Warranties</h2>
              <p className="text-zinc-400 leading-relaxed">
                The Service is provided "as is" without warranties of any kind, either express or implied.
                We do not warrant that the Service will be uninterrupted, error-free, or that defects will
                be corrected. Your use of the Service is at your sole risk.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">8. Limitation of Liability</h2>
              <p className="text-zinc-400 leading-relaxed">
                To the maximum extent permitted by law, CreatorFlow shall not be liable for any indirect,
                incidental, special, or consequential damages arising out of or related to your use of the
                Service, including loss of data or content stored through the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">9. Termination</h2>
              <p className="text-zinc-400 leading-relaxed">
                We reserve the right to suspend or terminate your access to the Service at any time for
                violation of these Terms. You may stop using the Service at any time and request deletion
                of your data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">10. Changes to Terms</h2>
              <p className="text-zinc-400 leading-relaxed">
                We may update these Terms from time to time. We will notify you of significant changes by
                posting the new Terms with an updated date. Continued use of the Service after changes
                constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">11. Contact</h2>
              <p className="text-zinc-400 leading-relaxed">
                For questions about these Terms, contact us at:{" "}
                <a href="mailto:legal@creatorflow.app" className="text-violet-400 hover:text-violet-300">
                  legal@creatorflow.app
                </a>
              </p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
