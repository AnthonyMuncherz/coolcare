import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GoogleMapComponent from '@/components/GoogleMap';
import { getAllLocations, initializeLocationsTable } from '@/lib/db/locations';
import Image from 'next/image';
import Link from 'next/link';
import { 
  HomeIcon, 
  UserGroupIcon, 
  TrophyIcon, 
  CheckBadgeIcon,
  HandThumbUpIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'About Us - CoolCare',
  description: 'Learn about CoolCare, Malaysia\'s premier air conditioning maintenance subscription service',
};

const values = [
  {
    name: 'Customer-Centric',
    description: 'We put our customers\' needs first in everything we do, delivering service that exceeds expectations.',
    icon: UserGroupIcon,
  },
  {
    name: 'Excellence',
    description: 'We strive for excellence in all aspects of our service, from the quality of our work to customer communication.',
    icon: TrophyIcon,
  },
  {
    name: 'Integrity',
    description: 'We operate with honesty, transparency, and accountability in all our interactions and business practices.',
    icon: CheckBadgeIcon,
  },
  {
    name: 'Reliability',
    description: 'We deliver on our promises, ensuring consistent and dependable service that our customers can count on.',
    icon: HandThumbUpIcon,
  },
  {
    name: 'Innovation',
    description: 'We continuously seek to improve our services and embrace new technologies to better serve our customers.',
    icon: HomeIcon,
  },
  {
    name: 'Timeliness',
    description: 'We respect our customers\' time by ensuring punctual service and efficient problem resolution.',
    icon: ClockIcon,
  },
];

export default async function AboutPage() {
  // Initialize locations table if needed
  await initializeLocationsTable();
  
  // Get all locations
  const locations = await getAllLocations();
  
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <div className="bg-blue-600 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                About CoolCare
              </h1>
              <p className="mt-6 text-lg leading-8 text-blue-100">
                Malaysia's premier air conditioning maintenance subscription service, committed to keeping your air cool and clean since 2018.
              </p>
            </div>
          </div>
        </div>
        
        {/* Company History */}
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Our Story</h2>
              <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
                <div className="lg:w-full lg:max-w-2xl lg:flex-auto">
                  <p className="text-xl leading-8 text-gray-600">
                    Founded in 2018, CoolCare began with a simple mission: to provide Malaysian homes and businesses with reliable, professional air conditioning maintenance services.
                  </p>
                  <div className="mt-10 max-w-xl text-base leading-7 text-gray-700">
                    <p>
                      What started as a small team of three technicians in Kuala Lumpur has grown into a nationwide service with offices across Malaysia. Our founder, Ahmad Rizal, noticed that most air conditioning problems could be prevented with regular, professional maintenance, but many customers would only call for service when their systems had already failed.
                    </p>
                    <p className="mt-6">
                      This insight led to the development of our subscription-based maintenance model, which ensures regular care for air conditioning systems while providing peace of mind to our customers. Today, CoolCare serves thousands of residential and commercial customers throughout Malaysia, with a team of over 50 certified technicians and support staff.
                    </p>
                    <p className="mt-6">
                      We're proud of our growth, but we're even prouder of the consistent quality we've maintained along the way. Our commitment to excellence, integrity, and customer satisfaction remains as strong today as it was when we serviced our very first customer.
                    </p>
                  </div>
                </div>
                <div className="lg:flex lg:flex-auto lg:justify-center">
                  <div className="relative h-80 w-80 sm:h-96 sm:w-96 lg:h-auto">
                    <div className="absolute -top-6 -left-6 h-80 w-80 rounded-xl bg-blue-600/10 sm:h-96 sm:w-96"></div>
                    <div className="absolute -bottom-6 -right-6 h-80 w-80 rounded-xl bg-blue-400/10 sm:h-96 sm:w-96"></div>
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                      <div className="h-full w-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                        <span className="text-white text-5xl font-extrabold">CoolCare</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mission and Vision */}
        <div className="bg-blue-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Mission</h2>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  To provide exceptional air conditioning maintenance services that enhance comfort, improve air quality, 
                  and extend the lifespan of our customers' systems through reliable, professional care and innovative subscription solutions.
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Vision</h2>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  To be Malaysia's most trusted provider of air conditioning services, recognized for our technical excellence, 
                  customer-focused approach, and contribution to creating more energy-efficient and comfortable indoor environments.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Core Values */}
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Core Values</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                These principles guide our decisions, shape our culture, and define how we serve our customers every day.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {values.map((value) => (
                  <div key={value.name} className="flex flex-col">
                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                      <value.icon className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                      {value.name}
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                      <p className="flex-auto">{value.description}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
        
        {/* Our Locations */}
        <div className="bg-blue-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Locations</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                With branches across Malaysia, we're never far from you. Find your nearest CoolCare service center below.
              </p>
            </div>
            
            <div className="mx-auto mt-16 max-w-7xl rounded-lg overflow-hidden">
              <GoogleMapComponent locations={locations} />
            </div>
            
            <div className="mx-auto mt-16 max-w-7xl">
              <h3 className="text-lg font-semibold mb-6">All Locations</h3>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {locations.map((location) => (
                  <div key={location.id} className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {location.name}
                      {location.isHeadOffice && (
                        <span className="ml-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          Head Office
                        </span>
                      )}
                    </h4>
                    <p className="mt-2 text-sm text-gray-600">{location.address}</p>
                    <p className="mt-4 text-sm text-gray-600">
                      <strong>Phone:</strong> {location.phone}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      <strong>Email:</strong> {location.email}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      <strong>Hours:</strong><br />
                      {location.businessHours}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Ready to experience the CoolCare difference?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
                Join thousands of satisfied customers across Malaysia who trust us with their air conditioning needs.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/pricing"
                  className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  View our plans
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