'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { API_ENDPOINTS } from '@/lib/client-constants';
import Button from '@/components/ui/Button';
import AnimatedProductCard from '@/components/AnimatedProductCard';
import { getProductImage, getProductImageGallery } from '@/lib/product-images';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Package, 
  Truck, 
  Shield, 
  RefreshCw, 
  Star,
  Check,
  Heart,
  Share2,
  TrendingUp,
  Award,
  Zap,
  Play,
  ChevronRight,
  Home,
  MessageSquare,
  HelpCircle,
  Users,
  Clock,
  CheckCircle2,
  Minus,
  Plus,
  ZoomIn,
  X
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  created_at: string;
}

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedColor, setSelectedColor] = useState('blue');
  const [selectedSize, setSelectedSize] = useState('M');
  const [showVideo, setShowVideo] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [imageZoomed, setImageZoomed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (params.id) {
      fetchProduct();
      fetchRelatedProducts();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API_ENDPOINTS.PRODUCTS}/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setProduct(data.data);
      } else {
        router.push('/shop');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      router.push('/shop');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.PRODUCTS);
      const data = await res.json();
      if (data.success) {
        const filtered = data.data.filter((p: Product) => p.id !== parseInt(params.id as string));
        setRelatedProducts(filtered.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      router.push('/cart');
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen py-16 sm:py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="relative min-h-screen py-16 sm:py-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="inline-block p-8 bg-gradient-to-br from-red-50 to-pink-50 rounded-full mb-6">
            <Package className="w-16 h-16 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Product not found</h2>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Button 
            onClick={() => router.push('/shop')} 
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  const priceNum = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const discount = 15;
  const originalPrice = priceNum / (1 - discount / 100);
  const rating = 4.5;
  const reviews = 127;

  const features = [
    { icon: Award, text: 'Premium Quality', color: 'from-yellow-400 to-orange-500' },
    { icon: Zap, text: 'Fast Delivery', color: 'from-blue-400 to-cyan-500' },
    { icon: Shield, text: '1 Year Warranty', color: 'from-green-400 to-emerald-500' },
    { icon: RefreshCw, text: 'Easy Returns', color: 'from-purple-400 to-pink-500' },
  ];

  const specifications = [
    { label: 'Material', value: 'Premium Quality' },
    { label: 'Dimensions', value: '10 x 8 x 5 inches' },
    { label: 'Weight', value: '2.5 lbs' },
    { label: 'Color', value: 'Multiple Options' },
    { label: 'Brand', value: 'ENEXT Premium' },
    { label: 'SKU', value: `PRD-${product.id.toString().padStart(6, '0')}` },
  ];

  const colors = [
    { name: 'Blue', value: 'blue', hex: '#3B82F6' },
    { name: 'Purple', value: 'purple', hex: '#A855F7' },
    { name: 'Pink', value: 'pink', hex: '#EC4899' },
    { name: 'Green', value: 'green', hex: '#10B981' },
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const mockReviews: Review[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Absolutely love this product! The quality is outstanding and it exceeded my expectations.',
      date: '2 days ago',
      verified: true,
    },
    {
      id: 2,
      name: 'Michael Chen',
      rating: 5,
      comment: 'Great value for money. Fast shipping and excellent customer service. Highly recommended!',
      date: '1 week ago',
      verified: true,
    },
    {
      id: 3,
      name: 'Emily Davis',
      rating: 4,
      comment: 'Very satisfied with my purchase. The product is well-made and looks exactly as described.',
      date: '2 weeks ago',
      verified: false,
    },
  ];

  const faqs = [
    {
      question: 'What is the return policy?',
      answer: 'We offer a 30-day return policy. If you\'re not satisfied with your purchase, you can return it for a full refund.',
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days.',
    },
    {
      question: 'Is this product covered by warranty?',
      answer: 'Yes, all our products come with a 1-year manufacturer warranty covering defects and malfunctions.',
    },
    {
      question: 'Can I track my order?',
      answer: 'Yes, once your order ships, you\'ll receive a tracking number via email to monitor your package.',
    },
  ];

  const bundleDeals = [
    { name: 'Product Bundle A', price: 199.99, savings: 50 },
    { name: 'Product Bundle B', price: 299.99, savings: 100 },
  ];

  return (
    <div className="relative min-h-screen py-8 sm:py-12 md:py-16">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 -z-10"></div>
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgb(59 130 246 / 0.15) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>
      
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-pink-400/10 to-orange-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-600 animate-fade-in">
          <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/shop" className="hover:text-blue-600 transition-colors">Shop</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-semibold">{product.name}</span>
        </nav>

        {/* Back Button */}
        <Button
          onClick={() => router.back()}
          variant="secondary"
          className="mb-6 flex items-center gap-2 bg-white/90 backdrop-blur-md border border-gray-200 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Product Image Gallery */}
          <div className="space-y-4 animate-fade-in">
            {/* Main Image */}
            <div className="relative w-full aspect-square bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 rounded-3xl overflow-hidden shadow-2xl group border-2 border-gray-200 cursor-pointer" onClick={() => setImageZoomed(true)}>
              <img
                src={getProductImageGallery(product.name, product.id)[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getProductImage(product.name, product.id);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Badges */}
              {product.stock === 0 ? (
                <div className="absolute top-6 right-6 z-20">
                  <div className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-sm font-bold shadow-xl backdrop-blur-sm border border-red-400/50 animate-pulse">
                    Out of Stock
                  </div>
                </div>
              ) : (
                <>
                  <div className="absolute top-6 right-6 z-20">
                    <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-bold shadow-xl backdrop-blur-sm border border-green-400/50 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      <span>In Stock</span>
                    </div>
                  </div>
                  {discount > 0 && (
                    <div className="absolute top-6 left-6 z-20">
                      <div className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full text-sm font-bold shadow-xl backdrop-blur-sm border border-orange-400/50">
                        -{discount}% OFF
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Action Buttons */}
              <div className="absolute bottom-6 right-6 z-20 flex gap-3">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-3 rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-110 ${
                    isWishlisted
                      ? 'bg-red-500/90 text-white border-red-400/50'
                      : 'bg-white/90 text-gray-700 border-gray-200 hover:bg-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button className="p-3 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 text-gray-700 hover:bg-white transition-all duration-300 hover:scale-110">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-3 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 text-gray-700 hover:bg-white transition-all duration-300 hover:scale-110">
                  <ZoomIn className="w-5 h-5" />
                </button>
              </div>

              {/* Video Play Button */}
              <button
                onClick={() => setShowVideo(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
              >
                <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                  <Play className="w-10 h-10 text-blue-600 ml-1" fill="currentColor" />
                </div>
              </button>

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {getProductImageGallery(product.name, product.id).map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === index
                      ? 'border-blue-500 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getProductImage(product.name, product.id);
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            {/* Category & Rating */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 rounded-full text-sm font-bold border border-blue-100">
                Premium Product
              </span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.floor(rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : star === Math.ceil(rating) && rating % 1 !== 0
                          ? 'fill-yellow-200 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700">{rating}</span>
                <span className="text-sm text-gray-500">({reviews} reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-blue-700 via-purple-600 to-gray-900 bg-clip-text text-transparent leading-tight">
              {product.name}
            </h1>

            {/* Price Section */}
            <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl border border-blue-100 shadow-lg">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ${priceNum.toFixed(2)}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span>Best price guaranteed</span>
              </p>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-900 mb-3">Color: {selectedColor}</label>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-12 h-12 rounded-xl border-2 transition-all duration-300 hover:scale-110 ${
                      selectedColor === color.value
                        ? 'border-blue-500 shadow-lg scale-110'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-900 mb-3">Size: {selectedSize}</label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-xl border-2 font-semibold transition-all duration-300 hover:scale-105 ${
                      selectedSize === size
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-500'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8 p-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed text-base">
                {product.description || 'This premium product features exceptional quality and design. Crafted with attention to detail, it combines style and functionality to deliver an outstanding user experience. Perfect for those who appreciate quality and innovation.'}
              </p>
            </div>

            {/* Features */}
            <div className="mb-8 grid grid-cols-2 gap-3">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={feature.text}
                    className="p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className={`w-10 h-10 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{feature.text}</p>
                  </div>
                );
              })}
            </div>

            {/* Stock Status */}
            <div className="mb-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Availability</p>
                    <p className="text-sm text-gray-600">
                      {product.stock > 0 ? `${product.stock} units in stock` : 'Currently unavailable'}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold ${
                    product.stock > 0
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="mb-8 p-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg">
                <label className="block mb-4 font-bold text-gray-900 text-lg">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl font-bold text-2xl transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                    className="w-24 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl font-bold text-2xl transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <div className="ml-auto text-right">
                    <p className="text-sm text-gray-600">Subtotal</p>
                    <p className="text-2xl font-bold text-blue-600">${(priceNum * quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                size="lg"
                className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-lg font-bold py-4"
              >
                <ShoppingCart className="w-6 h-6" />
                Add to Cart
              </Button>
              <Button
                onClick={() => router.push('/shop')}
                variant="secondary"
                size="lg"
                className="flex-1 bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:bg-white hover:border-blue-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg font-bold py-4"
              >
                Continue Shopping
              </Button>
            </div>

            {/* Shipping Info */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">Free Shipping</p>
                  <p className="text-sm text-gray-600">Free shipping on orders over $50. Estimated delivery: 2-5 business days.</p>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="mt-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-green-600" />
                <p className="text-sm text-gray-700">
                  <span className="font-bold">127 people</span> bought this in the last 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="sticky top-20 z-40 mb-8 animate-fade-in">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border-2 border-gray-200 shadow-xl overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 p-2 overflow-x-auto scrollbar-hide">
              {[
                { id: 'overview', label: 'Overview', icon: Package },
                { id: 'description', label: 'Description', icon: Award },
                { id: 'specifications', label: 'Specifications', icon: CheckCircle2 },
                { id: 'reviews', label: 'Reviews', icon: MessageSquare },
                { id: 'video', label: 'Video', icon: Play },
                { id: 'faq', label: 'FAQ', icon: HelpCircle },
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      // Smooth scroll to content
                      setTimeout(() => {
                        const element = document.getElementById(`tab-${tab.id}`);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 100);
                    }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg scale-105'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content Sections */}
        <div className="space-y-16">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div id="tab-overview" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Description Card */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Award className="w-8 h-8 text-blue-600" />
                    <h2 className="text-2xl font-extrabold text-gray-900">Description</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-base">
                    {product.description || 'This premium product features exceptional quality and design. Crafted with attention to detail, it combines style and functionality to deliver an outstanding user experience. Perfect for those who appreciate quality and innovation.'}
                  </p>
                </div>

                {/* Features Card */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Zap className="w-8 h-8 text-purple-600" />
                    <h2 className="text-2xl font-extrabold text-gray-900">Key Features</h2>
                  </div>
                  <div className="space-y-4">
                    {features.map((feature, index) => {
                      const IconComponent = feature.icon;
                      return (
                        <div key={feature.text} className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                          <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <p className="font-semibold text-gray-900">{feature.text}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Description Tab */}
          {activeTab === 'description' && (
            <div id="tab-description" className="animate-fade-in">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl p-8 sm:p-12">
                <div className="flex items-center gap-3 mb-8">
                  <Award className="w-8 h-8 text-blue-600" />
                  <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-700 to-gray-900 bg-clip-text text-transparent">
                    Product Description
                  </h2>
                </div>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg mb-6">
                    {product.description || 'This premium product features exceptional quality and design. Crafted with attention to detail, it combines style and functionality to deliver an outstanding user experience.'}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
                      <h3 className="font-bold text-gray-900 mb-3">Premium Materials</h3>
                      <p className="text-gray-700 text-sm">Made with the finest materials to ensure durability and longevity.</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                      <h3 className="font-bold text-gray-900 mb-3">Expert Craftsmanship</h3>
                      <p className="text-gray-700 text-sm">Handcrafted by skilled artisans with years of experience.</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                      <h3 className="font-bold text-gray-900 mb-3">Eco-Friendly</h3>
                      <p className="text-gray-700 text-sm">Environmentally conscious production with sustainable practices.</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-100">
                      <h3 className="font-bold text-gray-900 mb-3">Quality Guaranteed</h3>
                      <p className="text-gray-700 text-sm">Backed by our comprehensive quality assurance program.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Specifications Tab */}
          {activeTab === 'specifications' && (
            <div id="tab-specifications" className="animate-fade-in">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl p-8 sm:p-12">
                <div className="flex items-center gap-3 mb-8">
                  <CheckCircle2 className="w-8 h-8 text-blue-600" />
                  <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-700 to-gray-900 bg-clip-text text-transparent">
                    Specifications
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {specifications.map((spec, index) => (
                    <div
                      key={spec.label}
                      className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <p className="text-sm font-semibold text-gray-600 mb-2">{spec.label}</p>
                      <p className="text-xl font-bold text-gray-900">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div id="tab-reviews" className="animate-fade-in">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl p-8 sm:p-12">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-8 h-8 text-blue-600" />
                    <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-700 to-gray-900 bg-clip-text text-transparent">
                      Customer Reviews
                    </h2>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-3xl font-bold text-gray-900">{rating}</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= Math.floor(rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{reviews} reviews</p>
                  </div>
                </div>
                <div className="space-y-6">
                  {mockReviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-gray-900">{review.name}</p>
                            {review.verified && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {review.date}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
                <Button
                  variant="secondary"
                  className="mt-8 w-full sm:w-auto bg-white border-2 border-gray-200 hover:border-blue-500"
                >
                  View All Reviews
                </Button>
              </div>
            </div>
          )}

          {/* Video Tab */}
          {activeTab === 'video' && (
            <div id="tab-video" className="animate-fade-in">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl p-8 sm:p-12">
                <div className="flex items-center gap-3 mb-6">
                  <Play className="w-8 h-8 text-blue-600" />
                  <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-700 to-gray-900 bg-clip-text text-transparent">
                    Product Video
                  </h2>
                </div>
                <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                  {showVideo ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-white p-8">
                        <Play className="w-20 h-20 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Video Player Placeholder</p>
                        <p className="text-sm opacity-75 mt-2">Replace with your video embed code</p>
                        <Button
                          onClick={() => setShowVideo(false)}
                          variant="secondary"
                          className="mt-4 bg-white/20 hover:bg-white/30 text-white border-white/30"
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowVideo(true)}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-all duration-300 group"
                    >
                      <div className="w-24 h-24 bg-white/90 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Play className="w-12 h-12 text-blue-600 ml-1" fill="currentColor" />
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div id="tab-faq" className="animate-fade-in">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl p-8 sm:p-12">
                <div className="flex items-center gap-3 mb-8">
                  <HelpCircle className="w-8 h-8 text-blue-600" />
                  <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-700 to-gray-900 bg-clip-text text-transparent">
                    Frequently Asked Questions
                  </h2>
                </div>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
                    >
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full p-5 bg-gradient-to-r from-gray-50 to-blue-50 flex items-center justify-between text-left hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                      >
                        <span className="font-bold text-gray-900">{faq.question}</span>
                        {expandedFaq === index ? (
                          <Minus className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Plus className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      {expandedFaq === index && (
                        <div className="p-5 bg-white border-t border-gray-200 animate-fade-in">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bundle Deals */}
        <div className="mb-16 animate-fade-in">
          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-3xl border border-purple-100 shadow-xl p-8 sm:p-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 bg-gradient-to-r from-gray-900 via-purple-700 to-gray-900 bg-clip-text text-transparent">
              Bundle Deals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bundleDeals.map((bundle, index) => (
                <div
                  key={index}
                  className="p-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{bundle.name}</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                      Save ${bundle.savings}
                    </span>
                  </div>
                  <p className="text-3xl font-extrabold text-purple-600 mb-4">${bundle.price}</p>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Add Bundle to Cart
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-16 animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 bg-gradient-to-r from-gray-900 via-blue-700 to-gray-900 bg-clip-text text-transparent">
                Related Products
              </h2>
              <p className="text-gray-600">You might also like these products</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {relatedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <AnimatedProductCard {...product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Zoom Modal */}
      {imageZoomed && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setImageZoomed(false)}
        >
          <div className="relative max-w-4xl w-full aspect-square bg-white rounded-2xl overflow-hidden">
            <button
              onClick={() => setImageZoomed(false)}
              className="absolute top-4 right-4 z-10 p-3 bg-white/90 rounded-full hover:bg-white transition-colors"
            >
              <X className="w-6 h-6 text-gray-900" />
            </button>
            {product && (
              <img
                src={getProductImageGallery(product.name, product.id)[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getProductImage(product.name, product.id);
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
