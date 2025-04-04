"use client";

import { 
  ClockIcon, 
  ShieldCheckIcon, 
  WrenchScrewdriverIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Regular Maintenance',
    description:
      'Scheduled professional cleaning, inspection, and servicing of your air conditioning units to ensure optimal performance and longevity.',
    icon: WrenchScrewdriverIcon,
  },
  {
    name: '24/7 Emergency Support',
    description:
      'Round-the-clock assistance for any unexpected air conditioning emergencies, with priority service for subscribers.',
    icon: ClockIcon,
  },
  {
    name: 'Extended Warranty',
    description:
      'Enjoy longer protection for your air conditioning units with our exclusive extended warranty coverage for subscribers.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Premium Service',
    description:
      'Experience top-tier service from certified technicians using the latest tools and genuine parts for all maintenance work.',
    icon: TrophyIcon,
  },
];

export default function Features() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Better Comfort</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for worry-free AC care
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our comprehensive subscription plans are designed to keep your air conditioning system working flawlessly year-round, saving you money and extending the life of your equipment.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
} 