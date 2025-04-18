import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy - CoolCare',
  description: 'Privacy policy for CoolCare air conditioning maintenance services',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="mx-auto">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-10 text-center">
              Privacy Policy
            </h1>
            
            <div className="text-base text-gray-700 space-y-6">
              <p className="text-lg font-medium leading-7 text-gray-900">
                At CoolCare, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
                and safeguard your information when you use our services.
              </p>
              
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-800 mt-8 pb-2 border-b border-gray-200">1. Information We Collect</h2>
                <p>
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc pl-8 space-y-2">
                  <li>Personal identification information (name, email address, phone number, etc.)</li>
                  <li>Billing information (credit card details, billing address)</li>
                  <li>Property information (address, air conditioning system details)</li>
                  <li>Service history and preferences</li>
                  <li>Communications with our customer service team</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-800 mt-8 pb-2 border-b border-gray-200">2. How We Use Your Information</h2>
                <p>
                  We may use the information we collect for various purposes, including:
                </p>
                <ul className="list-disc pl-8 space-y-2">
                  <li>Providing, maintaining, and improving our services</li>
                  <li>Processing and completing transactions</li>
                  <li>Sending appointment confirmations and service reminders</li>
                  <li>Communicating with you about products, services, and promotions</li>
                  <li>Addressing customer service issues and technical problems</li>
                  <li>Monitoring and analyzing usage patterns and trends</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-800 mt-8 pb-2 border-b border-gray-200">3. Information Sharing and Disclosure</h2>
                <p>
                  We do not sell or rent your personal information to third parties. We may share your information in the following circumstances:
                </p>
                <ul className="list-disc pl-8 space-y-2">
                  <li>With service technicians who need access to perform maintenance at your property</li>
                  <li>With third-party service providers who assist in operating our business</li>
                  <li>To comply with legal obligations or protect our rights</li>
                  <li>In connection with a business transfer or acquisition</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-800 mt-8 pb-2 border-b border-gray-200">4. Data Security</h2>
                <p>
                  We implement appropriate security measures to protect your personal information. However, 
                  no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-800 mt-8 pb-2 border-b border-gray-200">5. Data Retention</h2>
                <p>
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
                  unless a longer retention period is required by law.
                </p>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-800 mt-8 pb-2 border-b border-gray-200">6. Your Rights</h2>
                <p>
                  You have the right to:
                </p>
                <ul className="list-disc pl-8 space-y-2">
                  <li>Access, update, or delete your personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Object to the processing of your personal information</li>
                  <li>Request a copy of your personal data</li>
                </ul>
                <p className="mt-3">
                  To exercise these rights, please contact us using the information provided at the end of this policy.
                </p>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-800 mt-8 pb-2 border-b border-gray-200">7. Cookies and Tracking Technologies</h2>
                <p>
                  Our website uses cookies and similar tracking technologies to collect information about your browsing activities. 
                  You can manage your cookie preferences through your browser settings.
                </p>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-800 mt-8 pb-2 border-b border-gray-200">8. Children's Privacy</h2>
                <p>
                  Our services are not intended for children under 18 years of age, and we do not knowingly collect personal 
                  information from children.
                </p>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-800 mt-8 pb-2 border-b border-gray-200">9. Changes to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. The updated version will be indicated by the "Last Updated" date 
                  at the bottom of this policy.
                </p>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-800 mt-8 pb-2 border-b border-gray-200">10. Contact Us</h2>
                <p>
                  If you have any questions or concerns about this Privacy Policy, please contact us at:
                </p>
                <div className="mt-3 pl-4 border-l-4 border-blue-200 py-2">
                  <p>
                    Email: <a href="mailto:privacy@coolcare.my" className="text-blue-600">privacy@coolcare.my</a><br />
                    Phone: +60 3-1234 5678<br />
                    Address: Jalan Ampang, Kuala Lumpur, Malaysia
                  </p>
                </div>
              </div>
              
              <div className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500 text-center">
                Last updated: {new Date().toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 