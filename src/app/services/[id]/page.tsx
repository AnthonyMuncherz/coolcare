import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getServiceById } from '@/lib/db/services';
import Link from 'next/link';
import { 
  WrenchScrewdriverIcon, 
  SparklesIcon, 
  BeakerIcon, 
  BoltIcon, 
  MagnifyingGlassIcon, 
  HomeModernIcon 
} from '@heroicons/react/24/outline';

const iconMap: { [key: string]: any } = {
  WrenchScrewdriverIcon,
  SparklesIcon,
  BeakerIcon,
  BoltIcon,
  MagnifyingGlassIcon,
  HomeModernIcon,
};

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getServiceById(parseInt(params.id));
  
  if (!service) {
    return {
      title: 'Service Not Found - CoolCare',
    };
  }
  
  return {
    title: `${service.name} - CoolCare Services`,
    description: service.shortDescription,
  };
}

export default async function ServicePage({ params }: Props) {
  const serviceId = parseInt(params.id);
  const service = await getServiceById(serviceId);
  
  if (!service) {
    notFound();
  }
  
  const Icon = iconMap[service.icon];
  
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <div className="bg-blue-600 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-8">
                {Icon && <Icon className="h-8 w-8 text-white" aria-hidden="true" />}
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                {service.name}
              </h1>
              <p className="mt-6 text-lg leading-8 text-blue-100">
                {service.shortDescription}
              </p>
              <div className="mt-10 inline-block rounded-md bg-white/10 px-4 py-2 text-white">
                Starting from <span className="font-bold">RM{service.priceFrom}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Service Details */}
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Service Details
              </h2>
              <div className="mt-10 text-lg leading-8 text-gray-600 space-y-8">
                <p>{service.description}</p>
                
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Choose Our {service.name} Service?</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Certified and experienced technicians</li>
                    <li>Use of high-quality parts and materials</li>
                    <li>Comprehensive service with attention to detail</li>
                    <li>Transparent pricing with no hidden fees</li>
                    <li>Convenient scheduling options</li>
                    <li>90-day service guarantee</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommended Frequency</h3>
                  <p>
                    Our {service.name} service is typically recommended 
                    {service.name === 'Regular Maintenance' && ' every 3-6 months'}
                    {service.name === 'Deep Cleaning' && ' once a year'}
                    {service.name === 'System Inspection & Assessment' && ' annually or when performance issues arise'}
                    {service.name === 'Refrigerant Recharge' && ' when cooling performance decreases'}
                    {service.name === 'Emergency Repairs' && ' as needed when urgent issues occur'}
                    {service.name === 'Installation & Setup' && ' when purchasing a new system'} 
                    to maintain optimal performance of your air conditioning system.
                  </p>
                </div>
              </div>
              
              <div className="mt-16 flex items-center justify-center gap-x-6">
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
                  Schedule a service <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Services */}
        <div className="bg-blue-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Explore Other Services
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Browse our complete range of air conditioning services to keep your system running at its best.
              </p>
              <div className="mt-10">
                <Link
                  href="/services"
                  className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  View all services
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