'use client';

import { Target, Award, Users, Heart } from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      Icon: Target,
      title: 'Our Mission',
      description: 'To provide customers with an unparalleled shopping experience through high-quality products and exceptional service.',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      Icon: Award,
      title: 'Quality First',
      description: 'We carefully curate every product to ensure it meets our high standards for quality, durability, and value.',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      Icon: Users,
      title: 'Customer Focus',
      description: 'Your satisfaction is our priority. We go above and beyond to ensure you have the best shopping experience.',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      Icon: Heart,
      title: 'Our Values',
      description: 'We believe in transparency, integrity, and building lasting relationships with our customers.',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
    },
  ];

  return (
    <div className="relative min-h-screen py-12 sm:py-16 md:py-20">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 -z-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 rounded-full text-sm font-semibold border border-blue-100">
              About Us
            </span>
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-blue-700 to-gray-900 bg-clip-text text-transparent">
            About ENEXT
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Welcome to ENEXT, your trusted destination for quality products and exceptional shopping experiences.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl p-8 sm:p-12 mb-8 animate-fade-in">
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-6">
              Founded with a vision to revolutionize online shopping, ENEXT brings you a curated selection of
              products that combine quality, style, and value. We believe that everyone deserves access to
              great products at fair prices.
            </p>
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
              Our mission is to provide customers with an unparalleled shopping experience through:
            </p>
            <ul className="mt-6 space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>High-quality products at competitive prices</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Fast and reliable shipping</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Exceptional customer service</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Secure and easy checkout process</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const IconComponent = feature.Icon;
            return (
              <div
                key={feature.title}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 p-6 sm:p-8 animate-fade-in group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <IconComponent className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
