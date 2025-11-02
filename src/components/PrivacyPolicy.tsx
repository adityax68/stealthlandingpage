import React, { useEffect } from 'react'
import { Mail, Shield } from 'lucide-react'
import Header from './Header'
import Footer from './Footer'
import { useAuth } from '../contexts/AuthContext'

const PrivacyPolicy: React.FC = () => {
  const { isAuthenticated } = useAuth()

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <Header isAuthenticated={isAuthenticated} />
      
      {/* Main Content */}
      <div className="relative pt-24 pb-16">
        {/* Background Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-primary-start/10 to-primary-end/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-10 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-secondary-start/10 to-secondary-end/10 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-start to-primary-end rounded-2xl mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600 text-lg">
              India-First Data Protection
            </p>
          </div>

          {/* Privacy Policy Content */}
          <div className="bg-white/80 backdrop-blur-sm border border-primary-start/20 rounded-2xl p-6 md:p-8 lg:p-12 shadow-xl">
            {/* Section 1 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1) Who we are</h2>
              <p className="text-gray-600 leading-relaxed">
                Thymos IT solution Pvt. Ltd. ("product is called MindAcuity" under Thymos IT solution private limited). 
                Contact: <a href="mailto:business@thymositsolution.com" className="text-primary-start hover:underline">business@thymositsolution.com</a>
              </p>
            </section>

            {/* Section 2 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2) Scope</h2>
              <p className="text-gray-600 leading-relaxed">
                This policy applies to the website, mobile app, clinician portal, and customer support channels. 
                It explains how we handle personal data under the Digital Personal Data Protection Act, 2023 (DPDPA) 
                and other applicable Indian laws.
              </p>
            </section>

            {/* Section 3 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3) What we collect</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p><strong>Account & identity:</strong> name/alias, email/phone, country.</p>
                <p><strong>App data (you choose to provide):</strong> mood check-ins, journal entries, wellness goals, AI chat content, exercise usage.</p>
                <p><strong>Tele-consult data (optional):</strong> medical history you share, prescriptions/notes from clinicians, appointment metadata.</p>
                <p><strong>Device data:</strong> app version, OS, crash logs; limited analytics/cookies for performance and security.</p>
                <p><strong>Payments:</strong> handled by PCI-compliant processors; we store tokenized references only. We practice data minimisation and collect only what's necessary for stated purposes.</p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4) Why we process your data (purposes & lawful basis)</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p><strong>Provide the service:</strong> set up your account; deliver AI coaching; personalise exercises.</p>
                <p><strong>Tele-consults:</strong> connect you with RMPs, maintain consultation records per Telemedicine Guidelines.</p>
                <p><strong>Safety:</strong> triage flags (e.g., crisis cues) to surface helplines/SOS.</p>
                <p><strong>Product improvement & security:</strong> quality assurance, bug fixing, fraud/abuse prevention.</p>
                <p><strong>Legal obligations:</strong> security incident reporting to CERT-In; responding to lawful requests.</p>
                <p className="mt-4">Legal basis: your consent (Section 6 DPDPA) and limited legitimate uses permitted by law (e.g., compliance). You can withdraw consent at any time, as easily as it was given.</p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5) Children & teens</h2>
              <p className="text-gray-600 leading-relaxed">
                We do not knowingly allow independent accounts for persons under 18. For any teen use via a parent/guardian, 
                we require verifiable parental consent and do not conduct tracking/profiling/targeted ads for children.
              </p>
            </section>

            {/* Section 6 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6) Sharing of data</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p><strong>Clinicians:</strong> if you book a consult, the clinician sees only what's needed (e.g., relevant history/notes).</p>
                <p><strong>Service providers:</strong> cloud, analytics, notification, identity verification, and payment partners under contracts with confidentiality and security obligations.</p>
                <p><strong>Employers/Institutions (B2B):</strong> aggregated, anonymised insights only—no individual-level content without your explicit consent.</p>
                <p><strong>Legal:</strong> to comply with law, prevent harm, protect rights, or respond to lawful requests. We do not sell personal data.</p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7) Cross-border transfers</h2>
              <p className="text-gray-600 leading-relaxed">
                We may process/store data outside India in jurisdictions not restricted by the Government of India under 
                Section 16 DPDPA and subject to contractual safeguards. If restrictions are notified, we will align transfers accordingly.
              </p>
            </section>

            {/* Section 8 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8) Security</h2>
              <p className="text-gray-600 leading-relaxed">
                We use encryption in transit and at rest, access controls, logging, and regular security testing. 
                If a cybersecurity incident occurs, we will notify CERT-In within 6 hours and affected users as required. 
                We retain security logs for 180 days in India per CERT-In Directions.
              </p>
            </section>

            {/* Section 9 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">9) Retention</h2>
              <p className="text-gray-600 leading-relaxed">
                We retain personal data only as long as needed for the purposes above or as required by law 
                (e.g., telemedicine records). After that, we delete or irreversibly anonymise it.
              </p>
            </section>

            {/* Section 10 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">10) Your rights (DPDPA)</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 leading-relaxed">
                <li>Access & portability (where feasible)</li>
                <li>Correction & updating</li>
                <li>Erasure (subject to legal retention)</li>
                <li>Withdraw consent at any time</li>
                <li>Grievance redressal and escalation to the Data Protection Board of India</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-3">
                You'll find an in-app panel to exercise these rights and a Consent Manager route if you prefer.
              </p>
            </section>

            {/* Section 11 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">11) Cookies & analytics</h2>
              <p className="text-gray-600 leading-relaxed">
                We use essential cookies for security and session management. For non-essential analytics/marketing cookies, 
                we seek your consent and provide controls to change preferences anytime.
              </p>
            </section>

            {/* Section 12 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">12) Tele-consult specifics (India)</h2>
              <p className="text-gray-600 leading-relaxed">
                RMPs must identify themselves (name, registration no.), obtain explicit patient consent, and maintain 
                appropriate records; video may be required for certain prescriptions. We provide informed-consent prompts 
                and store consent logs with time stamps.
              </p>
            </section>

            {/* Section 13 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">13) Mental health confidentiality</h2>
              <p className="text-gray-600 leading-relaxed">
                We honour the Mental Healthcare Act, 2017 confidentiality mandate. Limited exceptions apply 
                (e.g., risk of serious harm, court orders, public health, or as otherwise permitted by law).
              </p>
            </section>

            {/* Section 14 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">14) Changes</h2>
              <p className="text-gray-600 leading-relaxed">
                We'll post updates here and (where material) notify you in-app or by email.
              </p>
            </section>

            {/* Section 15 - Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">15) Contact</h2>
              <div className="bg-gradient-to-r from-primary-start/10 to-primary-end/10 rounded-xl p-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-6 h-6 text-primary-start flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">Email:</p>
                    <a 
                      href="mailto:business@thymositsolution.com" 
                      className="text-primary-start hover:underline"
                    >
                      business@thymositsolution.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-primary-start flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">Escalation:</p>
                    <p className="text-gray-600">
                      Data Protection Board of India (per DPDPA notice rights)
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Last Updated */}
         
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default PrivacyPolicy

