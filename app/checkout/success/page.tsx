'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="relative min-h-screen py-16 sm:py-20 md:py-24 flex items-center justify-center">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 -z-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center animate-fade-in">
          <div className="inline-block p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full mb-8 animate-bounce">
            <CheckCircle className="w-20 h-20 text-green-600" strokeWidth={2} />
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-green-700 to-gray-900 bg-clip-text text-transparent">
            Order Placed Successfully!
          </h1>
          
          <p className="text-gray-600 mb-8 sm:mb-12 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Thank you for your purchase. We've sent a confirmation email with your order details. 
            Your order will be processed and shipped as soon as possible.
          </p>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl p-8 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">What's Next?</h2>
            </div>
            <p className="text-gray-600 text-sm">
              You'll receive an email confirmation shortly with your order details and tracking information.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
              >
                Continue Shopping
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/orders">
              <Button 
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:bg-white hover:border-blue-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                View Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
