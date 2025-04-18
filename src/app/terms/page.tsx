import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service - CoolCare',
  description: 'Terms and conditions for using CoolCare air conditioning maintenance services',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="mx-auto">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-10 text-center">
              Terms of Service
            </h1>
            
            <div className="text-base text-gray-700 space-y-6">
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-800 mt-8 pb-2 border-b border-gray-200">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using CoolCare services, you agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use our services.
                </p>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-800 mt-8 pb-2 border-b border-gray-200">2. Service Description</h2>
                <p>
                  CoolCare provides air conditioning maintenance services through subscription plans. 
                  Services include regular maintenance, cleaning, repairs, and emergency support as specified in your selected plan.
                </p>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-800 mt-8 pb-2 border-b border-gray-200">3. Subscription Plans</h2>
                <p>
                  Our subscription plans are annual by default. Payment is due at the time of subscription and is non-refundable. 
                  You may cancel your subscription at any time, but no partial refunds will be issued for unused services.
                </p>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-800 mt-8 pb-2 border-b border-gray-200">4. Service Scheduling</h2>
                <p>
                  Maintenance visits will be scheduled in advance. You are responsible for ensuring access to your property 
                  at the scheduled time. Missed appointments may count towards your plan's visit allocation.
                </p>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-800 mt-8 pb-2 border-b border-gray-200">5. Warranties and Limitations</h2>
                <p>
                  Our services are provided "as is" without any warranty, either expressed or implied. We do not guarantee 
                  that our services will resolve all air conditioning issues or prevent all potential problems.
                </p>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-800 mt-8 pb-2 border-b border-gray-200">6. Liability Limitation</h2>
                <p>
                  CoolCare shall not be liable for any indirect, incidental, special, or consequential damages resulting 
                  from the use or inability to use our services, even if we have been advised of the possibility of such damages.
                </p>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-800 mt-8 pb-2 border-b border-gray-200">7. Property Access and Safety</h2>
                <p>
                  By scheduling a service, you grant our technicians permission to access the necessary areas of your property. 
                  You are responsible for ensuring a safe working environment for our technicians.
                </p>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-800 mt-8 pb-2 border-b border-gray-200">8. Privacy</h2>
                <p>
                  Your privacy is important to us. Please refer to our <a href="/privacy" className="text-blue-600 hover:text-blue-800">Privacy Policy</a> for 
                  information on how we collect, use, and protect your personal information.
                </p>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-800 mt-8 pb-2 border-b border-gray-200">9. Termination</h2>
                <p>
                  We reserve the right to terminate or suspend your account and access to our services at our sole discretion, 
                  without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
                </p>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-800 mt-8 pb-2 border-b border-gray-200">10. Changes to Terms</h2>
                <p>
                  We may modify these Terms at any time. We will notify you of any significant changes. Your continued use of 
                  our services after such modifications constitutes your acceptance of the updated Terms.
                </p>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-800 mt-8 pb-2 border-b border-gray-200">11. Governing Law</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of Malaysia. Any disputes arising 
                  under these Terms shall be subject to the exclusive jurisdiction of the courts of Malaysia.
                </p>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-800 mt-8 pb-2 border-b border-gray-200">12. Contact Information</h2>
                <p>
                  If you have any questions about these Terms, please contact us at:
                </p>
                <div className="mt-3 pl-4 border-l-4 border-blue-200 py-2">
                  <p>
                    Email: <a href="mailto:legal@coolcare.my" className="text-blue-600">legal@coolcare.my</a><br />
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