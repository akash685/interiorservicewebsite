'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, Phone } from './Icons';

export default function Navbar({ settings }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const siteName = settings?.siteName || 'Gupta Furniture';
  const phoneNumber = settings?.businessPhone || '+919511641912';
  const phoneLink = `tel:${phoneNumber.replace(/\s+/g, '')}`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-gray-900 hover:text-pink-600 transition-colors">
          {settings?.logo ? (
            <Image 
              src={settings.logo} 
              alt={siteName} 
              width={48}
              height={48}
              className="h-12 w-auto object-contain"
              priority
              quality={90}
            />
          ) : (
            <Image 
              src="/logo.png" 
              alt={siteName} 
              width={48}
              height={48}
              className="h-12 w-auto object-contain"
              priority
              quality={90}
            />
          )}
          <span className="font-bold text-xl tracking-tight">{siteName}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">Home</Link>
          <Link href="/services" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">Services</Link>
          <Link href="/locations" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">Locations</Link>
          <Link href="/blog" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">Blog</Link>
          <Link href="/contact" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">Contact</Link>
          <a 
            href={phoneLink}
            className="flex items-center gap-2 text-white px-5 py-2 font-medium transition-colors border hover:opacity-90"
            style={{ backgroundColor: 'var(--primary)', borderColor: 'var(--primary)' }}
          >
            <Phone className="w-4 h-4" />
            Call Now
          </a>
        </nav>

        {/* Mobile Actions */}
        <div className="flex items-center gap-3 md:hidden">
          <a 
            href={phoneLink}
            className="p-2 hover:bg-gray-50 transition-colors"
            style={{ color: 'var(--primary)' }}
            aria-label="Call Now"
          >
            <Phone className="w-5 h-5" />
          </a>
          
          <button 
            className="p-2 text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div 
          className={`md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 transition-all duration-200 ${
            isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          <nav className="px-6 py-4 space-y-1">
            <Link 
              href="/" 
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-pink-600 font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/services" 
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-pink-600 font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link 
              href="/locations" 
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-pink-600 font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Locations
            </Link>
            <Link 
              href="/blog" 
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-pink-600 font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
            <Link 
              href="/contact" 
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-pink-600 font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}