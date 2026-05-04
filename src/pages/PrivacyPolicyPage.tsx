import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
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

          <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-zinc-500 text-sm mb-12">Last updated: {today}</p>

          <div className="prose prose-invert max-w-none space-y-10">

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
              <p className="text-zinc-400 leading-relaxed">
                Welcome to CreatorFlow ("we", "us", or "our"). We are committed to protecting your personal
                information and your right to privacy. This Privacy Policy explains how we collect, use, and
                safeguard your information when you use our platform at creatorflow.app.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                We collect information you provide directly to us when you sign in and use our services:
              </p>
              <ul className="space-y-2 text-zinc-400">
                {[
                  "Google Account information (name, email address, profile picture) obtained through Google OAuth 2.0",
                  "Project data you create within the platform (scripts, notes, project names)",
                  "Google Drive file metadata (file names, IDs, thumbnails) for files within CreatorFlow-managed folders only",
                  "YouTube channel analytics data (view counts, watch time, audience demographics) for channels you choose to connect",
                  "Usage data such as feature interactions and session duration",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Google User Data</h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                CreatorFlow uses Google APIs to provide the following features. We only request the minimum
                permissions needed for each feature:
              </p>
              <div className="space-y-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                    </svg>
                    Google Drive (drive.file scope)
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Used exclusively to create and manage a dedicated folder named "[CreatorFlow] - Project Name"
                    in your Google Drive. We only access files within folders that CreatorFlow creates — we never
                    read, modify, or access any other files in your Drive.
                  </p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                    </svg>
                    YouTube Analytics (read-only scope)
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Used to display analytics data (views, watch time, audience retention) for videos you link
                    to your projects. This is strictly read-only — we never post, upload, modify, or delete any
                    YouTube content on your behalf.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Data Storage & Security</h2>
              <p className="text-zinc-400 leading-relaxed">
                Your project data is stored securely in Google Firestore. Google OAuth tokens are held in
                memory only during your active session and are never written to our databases or logs.
                We use Firebase Authentication which is SOC 2 Type II certified. All data is encrypted in
                transit (TLS 1.2+) and at rest.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Data Sharing</h2>
              <p className="text-zinc-400 leading-relaxed">
                We do not sell, trade, or rent your personal data to third parties. We do not share your
                Google user data with any third-party services. Your data is used solely to provide
                CreatorFlow's features to you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Data Retention & Deletion</h2>
              <p className="text-zinc-400 leading-relaxed">
                You may delete your account and all associated data at any time from your account settings.
                Upon deletion, all project data stored in Firestore is permanently removed within 30 days.
                Google Drive files you uploaded remain in your own Drive — we only remove our folder references.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Google API Services User Data Policy</h2>
              <p className="text-zinc-400 leading-relaxed">
                CreatorFlow's use and transfer to any other app of information received from Google APIs
                will adhere to the{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400 hover:text-violet-300 underline"
                >
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">8. Children's Privacy</h2>
              <p className="text-zinc-400 leading-relaxed">
                CreatorFlow is not directed to children under the age of 13. We do not knowingly collect
                personal information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">9. Contact Us</h2>
              <p className="text-zinc-400 leading-relaxed">
                If you have questions or concerns about this Privacy Policy, please contact us at:{" "}
                <a href="mailto:privacy@creatorflow.app" className="text-violet-400 hover:text-violet-300">
                  privacy@creatorflow.app
                </a>
              </p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
