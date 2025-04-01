import { Metadata } from 'next';
import { CheckIcon } from '@heroicons/react/20/solid';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllPlans, initializePlansTable } from '@/lib/db/plans';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing - CoolCare',
  description: 'Flexible subscription plans for air conditioning maintenance services by CoolCare',
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default async function PricingPage() {
  // Initialize plans table if needed
  await initializePlansTable();
  
  // Get all plans
  const plans = await getAllPlans();
  
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Pricing Section */}
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-base font-semibold leading-7 text-blue-600">Pricing</h1>
              <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Simple, Transparent Pricing
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Choose the subscription plan that works best for your needs.
                All plans include professional service from certified technicians.
              </p>
            </div>
            
            {/* Pricing Table */}
            <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={classNames(
                    plan.popular ? 'ring-2 ring-blue-600' : 'ring-1 ring-gray-200',
                    'rounded-3xl p-8'
                  )}
                >
                  <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
                  <p className="mt-4 text-sm leading-6 text-gray-600">{plan.description}</p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight text-gray-900">RM{plan.price}</span>
                    <span className="text-sm font-semibold leading-6 text-gray-600">/{plan.billingCycle}</span>
                  </p>
                  <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex gap-x-3">
                        <CheckIcon className="h-6 w-5 flex-none text-blue-600" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/signup"
                    className={classNames(
                      plan.popular
                        ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-500'
                        : 'text-blue-600 ring-1 ring-inset ring-blue-200 hover:ring-blue-300',
                      'mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                    )}
                  >
                    {plan.popular ? 'Get started today' : 'Subscribe now'}
                  </Link>
                </div>
              ))}
            </div>
            
            {/* FAQs */}
            <div className="mx-auto max-w-4xl mt-32">
              <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
                Frequently asked questions
              </h2>
              <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
                <div className="pt-6">
                  <dt className="text-lg font-semibold leading-7 text-gray-900">
                    What's included in the regular maintenance service?
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Our regular maintenance service includes cleaning of filters and coils, checking refrigerant levels, 
                    performance testing, minor adjustments, and recommendations for optimal system operation.
                  </dd>
                </div>
                <div className="pt-6">
                  <dt className="text-lg font-semibold leading-7 text-gray-900">
                    How often should I service my air conditioner?
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    In Malaysia's tropical climate, we recommend servicing your AC units every 3-6 months to maintain 
                    optimal performance, prevent breakdowns, and ensure healthy air quality.
                  </dd>
                </div>
                <div className="pt-6">
                  <dt className="text-lg font-semibold leading-7 text-gray-900">
                    Can I upgrade or downgrade my plan?
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Yes, you can upgrade or downgrade your subscription plan at any time. Changes will be applied at your 
                    next billing cycle, and any price differences will be prorated.
                  </dd>
                </div>
                <div className="pt-6">
                  <dt className="text-lg font-semibold leading-7 text-gray-900">
                    Are there any long-term contracts?
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Our subscription plans are annual, but there's no long-term commitment beyond that. You can cancel 
                    anytime before your renewal date without penalty.
                  </dd>
                </div>
                <div className="pt-6">
                  <dt className="text-lg font-semibold leading-7 text-gray-900">
                    What areas do you service in Malaysia?
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    We currently service Kuala Lumpur, Petaling Jaya, Shah Alam, Subang Jaya, Puchong, Cyberjaya, 
                    Putrajaya, and Klang. We're expanding to other cities soon.
                  </dd>
                </div>
              </dl>
            </div>
            
            {/* CTA Section */}
            <div className="mx-auto max-w-4xl mt-32 rounded-3xl bg-blue-50 px-8 py-20 text-center sm:px-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Still have questions?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
                Contact our team for more information about our services or to create a custom maintenance plan for your specific needs.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/contact"
                  className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Contact us
                </Link>
                <Link href="/services" className="text-sm font-semibold leading-6 text-gray-900">
                  Learn more about our services <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 