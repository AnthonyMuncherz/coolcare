import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllServices, initializeServicesTable } from '@/lib/db/services';
import { 
  WrenchScrewdriverIcon, 
  SparklesIcon, 
  BeakerIcon, 
  BoltIcon, 
  MagnifyingGlassIcon, 
  HomeModernIcon 
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Services - CoolCare',
  description: 'Professional air conditioning maintenance services offered by CoolCare in Malaysia',
};

const iconMap: { [key: string]: any } = {
  WrenchScrewdriverIcon,
  SparklesIcon,
  BeakerIcon,
  BoltIcon,
  MagnifyingGlassIcon,
  HomeModernIcon,
};

export default async function ServicesPage() {
  // Initialize services table if needed
  await initializeServicesTable();
  
  // Get all services
  const services = await getAllServices();
  
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <div className="bg-blue-600 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Our Services
              </h1>
              <p className="mt-6 text-lg leading-8 text-blue-100">
                Comprehensive air conditioning maintenance solutions tailored to your needs. 
                From regular maintenance to emergency repairs, we keep your air cool and clean.
              </p>
            </div>
          </div>
        </div>
        
        {/* Services List */}
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-600">Professional Care</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Complete AC Maintenance Services
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Every aspect of your air conditioning system deserves professional attention. 
                Our services are designed to provide comprehensive care for all AC types and brands.
              </p>
            </div>
            
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {services.map((service) => {
                  const Icon = iconMap[service.icon];
                  return (
                    <div key={service.id} className="flex flex-col">
                      <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-600">
                          {Icon && <Icon className="h-6 w-6 text-white" aria-hidden="true" />}
                        </div>
                        {service.name}
                      </dt>
                      <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                        <p className="flex-auto">{service.shortDescription}</p>
                        <p className="mt-4">
                          <span className="font-semibold text-blue-600">Starting from RM{service.priceFrom}</span>
                        </p>
                        <p className="mt-6">
                          <Link
                            href={`/services/${service.id}`}
                            className="text-sm font-semibold leading-6 text-blue-600"
                          >
                            Learn more <span aria-hidden="true">→</span>
                          </Link>
                        </p>
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-blue-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Ready to experience premium AC care?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
                Choose a subscription plan that suits your needs and enjoy hassle-free maintenance with priority service.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/pricing"
                  className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  View pricing plans
                </Link>
                <Link
                  href="/contact"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Contact us <span aria-hidden="true">→</span>
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