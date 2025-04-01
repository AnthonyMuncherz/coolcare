import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { getAllLocations, initializeLocationsTable } from '@/lib/db/locations';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Contact Us - CoolCare',
  description: 'Get in touch with CoolCare for air conditioning maintenance services in Malaysia',
};

export default async function ContactPage() {
  // Initialize locations table if needed
  await initializeLocationsTable();
  
  // Get all locations
  const locations = await getAllLocations();
  
  // Find head office
  const headOffice = locations.find(loc => loc.isHeadOffice);
  
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <div className="bg-blue-600 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Contact Us
              </h1>
              <p className="mt-6 text-lg leading-8 text-blue-100">
                Get in touch with our team for inquiries, service scheduling, or support.
                We're here to help keep your air cool and clean.
              </p>
            </div>
          </div>
        </div>
        
        {/* Contact Information and Form */}
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Get in Touch</h2>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Whether you have questions about our services, need to schedule maintenance, or want to provide feedback, 
                  we'd love to hear from you. Fill out the form, and our team will get back to you as soon as possible.
                </p>
                
                {headOffice && (
                  <div className="mt-10 space-y-8">
                    <div className="flex gap-x-4">
                      <div className="flex-none">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                          <EnvelopeIcon className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold leading-7 text-gray-900">Email Us</h3>
                        <p className="mt-2 text-base leading-7 text-gray-600">
                          {headOffice.email}<br />
                          <span className="text-sm text-gray-500">For general inquiries</span>
                        </p>
                        <p className="mt-2 text-base leading-7 text-gray-600">
                          support@coolcare.my<br />
                          <span className="text-sm text-gray-500">For customer support</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-x-4">
                      <div className="flex-none">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                          <PhoneIcon className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold leading-7 text-gray-900">Call Us</h3>
                        <p className="mt-2 text-base leading-7 text-gray-600">
                          {headOffice.phone}<br />
                          <span className="text-sm text-gray-500">Main Office</span>
                        </p>
                        <p className="mt-2 text-base leading-7 text-gray-600">
                          +60 3-1234 5679<br />
                          <span className="text-sm text-gray-500">24/7 Emergency Service (subscribers only)</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-x-4">
                      <div className="flex-none">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                          <ClockIcon className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold leading-7 text-gray-900">Business Hours</h3>
                        <p className="mt-2 text-base leading-7 text-gray-600">
                          {headOffice.businessHours}
                        </p>
                        <p className="mt-2 text-base leading-7 text-gray-600">
                          <span className="text-sm text-gray-500">
                            Emergency service is available 24/7 for subscribers.
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
        
        {/* Offices Section */}
        <div className="bg-blue-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Offices</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Visit one of our service centers across Malaysia for in-person assistance.
              </p>
            </div>
            
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3">
              {locations.map((location) => (
                <div key={location.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg">
                  <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-600">
                        {location.isHeadOffice ? 'Head Office' : 'Branch Office'}
                      </p>
                      <div className="mt-2 block">
                        <h3 className="text-xl font-semibold text-gray-900">{location.name}</h3>
                        <p className="mt-3 text-base text-gray-500">{location.address}</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <div className="text-sm text-gray-500">
                        <p><strong>Phone:</strong> {location.phone}</p>
                        <p><strong>Email:</strong> {location.email}</p>
                        <p><strong>Hours:</strong> {location.businessHours}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 