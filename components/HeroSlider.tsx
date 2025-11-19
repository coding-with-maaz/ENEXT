'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './ui/Button';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  buttonText: string;
  buttonLink: string;
  gradient: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'New Collection',
    subtitle: 'Spring 2024',
    description: 'Discover the latest trends in fashion and style',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba3e6829?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    gradient: 'from-pink-500 via-purple-500 to-indigo-600',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
  },
  {
    id: 2,
    title: 'Summer Sale',
    subtitle: 'Up to 50% Off',
    description: 'Get amazing deals on your favorite products',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    gradient: 'from-blue-500 via-cyan-500 to-teal-600',
    buttonText: 'Explore Deals',
    buttonLink: '/shop',
  },
  {
    id: 3,
    title: 'Premium Quality',
    subtitle: 'Luxury Collection',
    description: 'Experience elegance and sophistication',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    gradient: 'from-amber-500 via-orange-500 to-red-600',
    buttonText: 'View Collection',
    buttonLink: '/shop',
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in pixels)
  const minSwipeDistance = 50;

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <div 
      className="relative h-[500px] sm:h-[550px] md:h-[650px] lg:h-[750px] xl:h-[800px] overflow-hidden touch-manipulation"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide
              ? 'opacity-100 z-10 scale-100'
              : 'opacity-0 z-0 scale-105'
          }`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} overflow-hidden`}>
            {/* Background Image */}
            {slide.image && (
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover opacity-30 sm:opacity-40"
                  priority={index === 0}
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent"></div>
              </div>
            )}
            
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10 sm:opacity-20">
              <div className="absolute top-0 left-0 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob" />
              <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  {/* Text Content */}
                  <div
                    className={`max-w-full sm:max-w-xl md:max-w-2xl text-white transform transition-all duration-1000 delay-300 ${
                      index === currentSlide
                        ? 'translate-x-0 opacity-100'
                        : 'translate-x-10 opacity-0'
                    }`}
                  >
                  <div className="mb-4 sm:mb-6">
                    <span className="inline-block px-4 py-2 sm:px-6 sm:py-3 bg-white/20 backdrop-blur-md rounded-full text-xs sm:text-sm font-bold mb-4 sm:mb-6 shadow-lg border border-white/30">
                      {slide.subtitle}
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-10 opacity-95 leading-relaxed">
                    {slide.description}
                  </p>
                  <div>
                    <Link href={slide.buttonLink}>
                      <Button
                        size="lg"
                        variant="secondary"
                        className="bg-white text-gray-900 hover:bg-gray-100 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold w-full sm:w-auto"
                      >
                        {slide.buttonText}
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
                
                {/* Product Image */}
                {slide.image && (
                  <div
                    className={`flex items-center justify-center transform transition-all duration-1000 delay-500 ${
                      index === currentSlide
                        ? 'translate-x-0 opacity-100 scale-100'
                        : 'translate-x-10 opacity-0 scale-95'
                    }`}
                  >
                    <div className="relative w-full max-w-md lg:max-w-lg">
                      <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-3xl transform rotate-6"></div>
                      <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl">
                        <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl">
                          <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-cover"
                            priority={index === 0}
                            unoptimized
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 md:p-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 active:bg-white/40 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg border border-white/30 group touch-manipulation"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 group-hover:-translate-x-1 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 md:p-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 active:bg-white/40 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg border border-white/30 group touch-manipulation"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-3 items-center">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-500 rounded-full touch-manipulation ${
              index === currentSlide
                ? 'w-8 sm:w-10 h-2 sm:h-3 bg-white shadow-lg'
                : 'w-2 sm:w-3 h-2 sm:h-3 bg-white/50 hover:bg-white/75 active:bg-white/90 hover:scale-125 active:scale-110'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      {isAutoPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-white/20 z-20">
          <div
            key={currentSlide}
            className="h-full bg-white animate-progress"
          />
        </div>
      )}

      {/* Swipe Indicator for Mobile */}
      <div className="md:hidden absolute top-4 right-4 z-20 flex items-center gap-2 text-white/70 text-xs">
        <span>Swipe</span>
        <ChevronLeft className="w-4 h-4 animate-pulse" />
        <ChevronRight className="w-4 h-4 animate-pulse" />
      </div>

    </div>
  );
}

