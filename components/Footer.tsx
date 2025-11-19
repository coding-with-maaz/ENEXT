'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

interface FooterLink {
  id: string;
  label: string;
  href: string;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

interface FooterSettings {
  companyName: string;
  companyLogo: string;
  companyDescription: string;
  copyrightText: string;
  quickLinks: FooterLink[];
  customerServiceLinks: FooterLink[];
  socialLinks: SocialLink[];
  newsletterEnabled: boolean;
  newsletterTitle: string;
  newsletterDescription: string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
}

const defaultSettings: FooterSettings = {
  companyName: 'ENEXT',
  companyLogo: 'E',
  companyDescription: 'Your trusted destination for quality products. We\'re committed to providing the best shopping experience.',
  copyrightText: `© ${new Date().getFullYear()} ENEXT. All rights reserved.`,
  quickLinks: [
    { id: '1', label: 'Shop', href: '/shop' },
    { id: '2', label: 'About Us', href: '/about' },
    { id: '3', label: 'Contact', href: '/contact' },
    { id: '4', label: 'Shopping Cart', href: '/cart' },
  ],
  customerServiceLinks: [
    { id: '1', label: 'Shipping Info', href: '#' },
    { id: '2', label: 'Returns', href: '#' },
    { id: '3', label: 'FAQ', href: '#' },
    { id: '4', label: 'Privacy Policy', href: '#' },
  ],
  socialLinks: [
    { id: '1', platform: 'Facebook', url: '#', icon: 'facebook' },
    { id: '2', platform: 'Twitter', url: '#', icon: 'twitter' },
    { id: '3', platform: 'Instagram', url: '#', icon: 'instagram' },
  ],
  newsletterEnabled: true,
  newsletterTitle: 'Newsletter',
  newsletterDescription: 'Subscribe to get special offers and updates',
  contactInfo: {
    email: 'support@enext.com',
    phone: '+1 (555) 123-4567',
    address: '123 Commerce Street, Business City, BC 12345, United States',
  },
};

const getSocialIcon = (icon: string) => {
  switch (icon.toLowerCase()) {
    case 'facebook':
      return Facebook;
    case 'twitter':
      return Twitter;
    case 'instagram':
      return Instagram;
    case 'linkedin':
      return Linkedin;
    default:
      return Facebook;
  }
};

export default function Footer() {
  const [settings, setSettings] = useState<FooterSettings>(defaultSettings);

  useEffect(() => {
    // Load footer settings from localStorage
    try {
      const saved = localStorage.getItem('footerSettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
      }
    } catch (error) {
      console.error('Error loading footer settings:', error);
    }
  }, []);

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-12">
          {/* Company Info */}
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {settings.companyLogo}
              </div>
              <span className="text-2xl font-bold text-white">
                {settings.companyName}
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 text-sm sm:text-base">
              {settings.companyDescription}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 mb-6">
              {settings.contactInfo.email && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${settings.contactInfo.email}`} className="hover:text-white transition-colors">
                    {settings.contactInfo.email}
                  </a>
                </div>
              )}
              {settings.contactInfo.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${settings.contactInfo.phone}`} className="hover:text-white transition-colors">
                    {settings.contactInfo.phone}
                  </a>
                </div>
              )}
              {settings.contactInfo.address && (
                <div className="flex items-start gap-2 text-sm text-gray-400">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>{settings.contactInfo.address}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {settings.socialLinks.map((social) => {
                const IconComponent = getSocialIcon(social.icon);
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-blue-600 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    aria-label={social.platform}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h3 className="text-white font-bold mb-6 text-lg">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {settings.quickLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h3 className="text-white font-bold mb-6 text-lg">
              Customer Service
            </h3>
            <ul className="space-y-3">
              {settings.customerServiceLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          {settings.newsletterEnabled && (
            <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
              <h3 className="text-white font-bold mb-6 text-lg">
                {settings.newsletterTitle}
              </h3>
              <p className="text-gray-400 mb-4 text-sm">
                {settings.newsletterDescription}
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Subscribe
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="border-t border-gray-700 pt-8 mt-8 text-center">
          <p className="text-gray-400 text-sm">
            {settings.copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}
