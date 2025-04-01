"use client";

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link href="/privacy" className="text-gray-300 hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-gray-300 hover:text-white">
            Terms of Service
          </Link>
          <Link href="/contact" className="text-gray-300 hover:text-white">
            Contact Us
          </Link>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <div className="flex items-center justify-center md:justify-start">
            <div className="text-xl font-bold text-white">
              Cool<span className="text-cyan-400">Care</span>
            </div>
          </div>
          <p className="mt-2 text-center text-xs leading-5 text-gray-300 md:text-left">
            &copy; {new Date().getFullYear()} CoolCare. All rights reserved. <br />
            Premium air conditioning maintenance services in Malaysia.
          </p>
          <div className="mt-4 text-center text-xs leading-5 text-gray-300 md:text-left">
            <p>Email: info@coolcare.my</p>
            <p>Phone: +60 3-1234 5678</p>
            <p>Address: Jalan Ampang, Kuala Lumpur, Malaysia</p>
          </div>
        </div>
      </div>
    </footer>
  );
} 