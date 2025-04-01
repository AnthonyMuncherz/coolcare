"use client";

import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:py-40 lg:px-8">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <div className="inline-flex space-x-6">
              <span className="rounded-full bg-blue-600/10 px-3 py-1 text-sm font-semibold leading-6 text-blue-600 ring-1 ring-inset ring-blue-600/10">
                New Service
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
                <span>Just launched in Kuala Lumpur</span>
              </span>
            </div>
          </div>
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Keep Your Air Cool & Clean with CoolCare
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Subscribe to Malaysia's premier air conditioning maintenance service. Enjoy worry-free comfort with our professional maintenance, 24/7 emergency support, and exclusive benefits.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link
              href="/signup"
              className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Get started
            </Link>
            <Link href="/services" className="text-sm font-semibold leading-6 text-gray-900">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="relative w-[45rem] h-[25rem] rounded-xl shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center p-8">
                  <div className="text-5xl font-bold mb-4">Professional AC Care</div>
                  <p className="text-xl">For a cooler, healthier home environment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 