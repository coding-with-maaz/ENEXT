'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Button from '@/components/ui/Button';
import { 
  CheckCircle2, 
  CreditCard, 
  MapPin, 
  User, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  Package,
  Truck,
  Shield,
  Check,
  X
} from 'lucide-react';
import { API_ENDPOINTS } from '@/lib/client-constants';
import { getProductImage } from '@/lib/product-images';

interface FormData {
  // Billing
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Shipping
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  shippingCountry: string;
  sameAsBilling: boolean;
  
  // Billing Address (if different)
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZipCode: string;
  billingCountry: string;
  
  // Payment
  paymentMethod: 'card' | 'paypal' | 'apple-pay';
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  
  // Shipping Method
  shippingMethod: 'standard' | 'express' | 'overnight';
}

const SHIPPING_METHODS = {
  standard: { name: 'Standard Shipping', price: 0, days: '5-7 business days' },
  express: { name: 'Express Shipping', price: 9.99, days: '2-3 business days' },
  overnight: { name: 'Overnight Shipping', price: 24.99, days: '1 business day' },
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderId, setOrderId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZipCode: '',
    shippingCountry: 'United States',
    sameAsBilling: true,
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    billingCountry: 'United States',
    paymentMethod: 'card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    shippingMethod: 'standard',
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems, router]);

  if (cartItems.length === 0) {
    return null;
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    }

    if (step === 2) {
      if (!formData.shippingAddress.trim()) newErrors.shippingAddress = 'Address is required';
      if (!formData.shippingCity.trim()) newErrors.shippingCity = 'City is required';
      if (!formData.shippingState.trim()) newErrors.shippingState = 'State is required';
      if (!formData.shippingZipCode.trim()) newErrors.shippingZipCode = 'ZIP code is required';
      
      if (!formData.sameAsBilling) {
        if (!formData.billingAddress.trim()) newErrors.billingAddress = 'Billing address is required';
        if (!formData.billingCity.trim()) newErrors.billingCity = 'Billing city is required';
        if (!formData.billingState.trim()) newErrors.billingState = 'Billing state is required';
        if (!formData.billingZipCode.trim()) newErrors.billingZipCode = 'Billing ZIP code is required';
      }
    }

    if (step === 3) {
      if (formData.paymentMethod === 'card') {
        if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
        else if (formData.cardNumber.replace(/\s/g, '').length < 13) {
          newErrors.cardNumber = 'Invalid card number';
        }
        if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
        if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
        if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
        else if (formData.cvv.length < 3) newErrors.cvv = 'Invalid CVV';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      setFormData({ ...formData, [name]: formatCardNumber(value) });
    } else if (name === 'expiryDate') {
      setFormData({ ...formData, [name]: formatExpiryDate(value) });
    } else if (name === 'cvv') {
      setFormData({ ...formData, [name]: value.replace(/\D/g, '').substring(0, 4) });
    } else if (name === 'sameAsBilling') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Create order data
      const orderData = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        shipping: {
          address: formData.shippingAddress,
          city: formData.shippingCity,
          state: formData.shippingState,
          zipCode: formData.shippingZipCode,
          country: formData.shippingCountry,
        },
        billing: formData.sameAsBilling ? null : {
          address: formData.billingAddress,
          city: formData.billingCity,
          state: formData.billingState,
          zipCode: formData.billingZipCode,
          country: formData.billingCountry,
        },
        payment: {
          method: formData.paymentMethod,
          // In production, never send actual card details to your server
          // Use a payment processor like Stripe, PayPal, etc.
        },
        shippingMethod: formData.shippingMethod,
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };

      // Create a temporary user or use guest checkout
      // For now, we'll use a guest user ID (1) - in production, use actual user authentication
      const response = await fetch(API_ENDPOINTS.ORDERS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1, // Guest user - in production, get from auth
          items: orderData.items,
          customer_info: orderData.customer,
          shipping_info: orderData.shipping,
          billing_info: orderData.billing,
          shipping_method: orderData.shippingMethod,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOrderId(data.data.id.toString());
        clearCart();
        // Store order ID in sessionStorage for success page
        sessionStorage.setItem('lastOrderId', data.data.id.toString());
        router.push(`/checkout/success?orderId=${data.data.id}`);
      } else {
        setErrors({ submit: data.message || 'Failed to place order. Please try again.' });
      }
    } catch (error: any) {
      setErrors({ submit: error.message || 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getTotalPrice();
  const shippingCost = SHIPPING_METHODS[formData.shippingMethod].price;
  const tax = (subtotal + shippingCost) * 0.1;
  const total = subtotal + shippingCost + tax;

  const steps = [
    { id: 1, name: 'Billing Info', icon: User },
    { id: 2, name: 'Shipping', icon: MapPin },
    { id: 3, name: 'Payment', icon: CreditCard },
  ];

  return (
    <div className="relative min-h-screen py-12 sm:py-16 md:py-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 -z-10"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-200/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-200/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-gray-900 via-blue-700 to-gray-900 bg-clip-text text-transparent">
            Checkout
          </h1>
          <p className="text-gray-600">Complete your purchase in 3 easy steps</p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8 sm:mb-12 animate-fade-in">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-blue-600 text-white scale-110'
                          : isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <IconComponent className="w-6 h-6" />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs sm:text-sm font-semibold hidden sm:block ${
                        isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 sm:mx-4 transition-all duration-300 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Billing Information */}
              {currentStep === 1 && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl p-6 sm:p-8 animate-fade-in">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      <User className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Billing Information</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.firstName
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                            : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                        }`}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.lastName
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                            : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                        }`}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.email
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                            : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.phone
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                            : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                        }`}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                    >
                      Continue to Shipping
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping Information */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Shipping Address</h2>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.shippingAddress
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                            : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                        }`}
                      />
                      {errors.shippingAddress && (
                        <p className="mt-1 text-sm text-red-600">{errors.shippingAddress}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="shippingCity"
                          value={formData.shippingCity}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                            errors.shippingCity
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                          }`}
                        />
                        {errors.shippingCity && (
                          <p className="mt-1 text-sm text-red-600">{errors.shippingCity}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="shippingState"
                          value={formData.shippingState}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                            errors.shippingState
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                          }`}
                        />
                        {errors.shippingState && (
                          <p className="mt-1 text-sm text-red-600">{errors.shippingState}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          name="shippingZipCode"
                          value={formData.shippingZipCode}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                            errors.shippingZipCode
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                          }`}
                        />
                        {errors.shippingZipCode && (
                          <p className="mt-1 text-sm text-red-600">{errors.shippingZipCode}</p>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Country *
                      </label>
                      <select
                        name="shippingCountry"
                        value={formData.shippingCountry}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>

                    <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="sameAsBilling"
                          checked={formData.sameAsBilling}
                          onChange={handleChange}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-semibold text-gray-700">
                          Billing address same as shipping address
                        </span>
                      </label>
                    </div>

                    {!formData.sameAsBilling && (
                      <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Billing Address</h3>
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Address *
                          </label>
                          <input
                            type="text"
                            name="billingAddress"
                            value={formData.billingAddress}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                              errors.billingAddress
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                            }`}
                          />
                          {errors.billingAddress && (
                            <p className="mt-1 text-sm text-red-600">{errors.billingAddress}</p>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              City *
                            </label>
                            <input
                              type="text"
                              name="billingCity"
                              value={formData.billingCity}
                              onChange={handleChange}
                              className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                                errors.billingCity
                                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                              }`}
                            />
                            {errors.billingCity && (
                              <p className="mt-1 text-sm text-red-600">{errors.billingCity}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              State *
                            </label>
                            <input
                              type="text"
                              name="billingState"
                              value={formData.billingState}
                              onChange={handleChange}
                              className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                                errors.billingState
                                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                              }`}
                            />
                            {errors.billingState && (
                              <p className="mt-1 text-sm text-red-600">{errors.billingState}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              ZIP Code *
                            </label>
                            <input
                              type="text"
                              name="billingZipCode"
                              value={formData.billingZipCode}
                              onChange={handleChange}
                              className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                                errors.billingZipCode
                                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                              }`}
                            />
                            {errors.billingZipCode && (
                              <p className="mt-1 text-sm text-red-600">{errors.billingZipCode}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-4">
                        Shipping Method *
                      </label>
                      <div className="space-y-3">
                        {Object.entries(SHIPPING_METHODS).map(([key, method]) => (
                          <label
                            key={key}
                            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                              formData.shippingMethod === key
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="shippingMethod"
                                value={key}
                                checked={formData.shippingMethod === key}
                                onChange={handleChange}
                                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <div>
                                <div className="font-semibold text-gray-900">{method.name}</div>
                                <div className="text-sm text-gray-600">{method.days}</div>
                              </div>
                            </div>
                            <div className="font-bold text-gray-900">
                              {method.price === 0 ? 'Free' : `$${method.price.toFixed(2)}`}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        type="button"
                        onClick={handlePrev}
                        variant="secondary"
                        className="bg-white border-2 border-gray-200 hover:border-blue-500"
                      >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                      >
                        Continue to Payment
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Information */}
              {currentStep === 3 && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl p-6 sm:p-8 animate-fade-in">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Payment Information</h2>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      Payment Method *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { value: 'card', label: 'Credit Card', icon: CreditCard },
                        { value: 'paypal', label: 'PayPal', icon: Shield },
                        { value: 'apple-pay', label: 'Apple Pay', icon: Shield },
                      ].map((method) => {
                        const IconComponent = method.icon;
                        return (
                          <label
                            key={method.value}
                            className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                              formData.paymentMethod === method.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method.value}
                              checked={formData.paymentMethod === method.value}
                              onChange={handleChange}
                              className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <IconComponent className="w-5 h-5 text-gray-700" />
                            <span className="font-semibold text-gray-900">{method.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                            errors.cardNumber
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                          }`}
                        />
                        {errors.cardNumber && (
                          <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                            errors.cardName
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                          }`}
                        />
                        {errors.cardName && (
                          <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            placeholder="MM/YY"
                            maxLength={5}
                            className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                              errors.expiryDate
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                            }`}
                          />
                          {errors.expiryDate && (
                            <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleChange}
                            placeholder="123"
                            maxLength={4}
                            className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                              errors.cvv
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                            }`}
                          />
                          {errors.cvv && (
                            <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'paypal' && (
                    <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-gray-700">
                        You will be redirected to PayPal to complete your payment.
                      </p>
                    </div>
                  )}

                  {formData.paymentMethod === 'apple-pay' && (
                    <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-gray-700">
                        You will be redirected to Apple Pay to complete your payment.
                      </p>
                    </div>
                  )}

                  {errors.submit && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-sm text-red-600">{errors.submit}</p>
                    </div>
                  )}

                  <div className="flex justify-between mt-6">
                    <Button
                      type="button"
                      onClick={handlePrev}
                      variant="secondary"
                      className="bg-white border-2 border-gray-200 hover:border-blue-500"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          Place Order
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl p-6 sticky top-24 animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                  <Package className="w-6 h-6 text-blue-600" />
                  Order Summary
                </h2>
                
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto scrollbar-hide">
                  {cartItems.map((item) => {
                    const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
                    const itemImage = item.image || getProductImage(item.name, item.id);
                    
                    return (
                      <div
                        key={item.id}
                        className="flex gap-3 pb-4 border-b border-gray-200 last:border-0"
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {itemImage ? (
                            <img
                              src={itemImage}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">
                              <Package />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 truncate">{item.name}</div>
                          <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                          <div className="text-sm font-bold text-blue-600 mt-1">
                            ${(itemPrice * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping ({SHIPPING_METHODS[formData.shippingMethod].name})</span>
                    <span className="font-semibold">
                      {shippingCost === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `$${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-2xl font-bold mb-6">
                  <span className="text-gray-900">Total</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>

                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <Shield className="w-4 h-4" />
                    <span className="font-semibold">Secure Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
