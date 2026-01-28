import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Menu, ShoppingCart, BarChart3, Users, Package, LogIn, TrendingUp, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Menu className="h-8 w-8 text-orange-600" />,
      title: 'Menu Management',
      description: 'Complete menu control with categories, pricing, and availability tracking',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <ShoppingCart className="h-8 w-8 text-blue-600" />,
      title: 'Order Management',
      description: 'Real-time order processing and status tracking for seamless operations',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Package className="h-8 w-8 text-green-600" />,
      title: 'Inventory Control',
      description: 'Automated stock management with alerts and transaction history',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: 'Staff Management',
      description: 'Comprehensive staff management with role-based access control',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-indigo-600" />,
      title: 'Real-Time Reports',
      description: 'Powerful analytics and insights for data-driven decisions',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with audit trails and authentication',
      color: 'from-red-500 to-orange-500'
    }
  ];

  const stats = [
    { icon: <TrendingUp className="h-6 w-6" />, value: 'Real-Time', label: 'Data Sync' },
    { icon: <Clock className="h-6 w-6" />, value: '24/7', label: 'Availability' },
    { icon: <Shield className="h-6 w-6" />, value: '100%', label: 'Database-Backed' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-lg">
                <ChefHat className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Restaurant RMS
                </h1>
                <p className="text-xs text-gray-500">Management System</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                Features
              </a>
              <a href="#about" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                About
              </a>
              <a href="#contact" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                Contact
              </a>
            </div>

            <Button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <LogIn className="h-5 w-5" />
              <span>Login Now</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-block">
                <span className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold">
                  Complete Restaurant Solution
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                Manage Your Restaurant
                <span className="block bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mt-2">
                  Like a Pro
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 max-w-2xl">
                A comprehensive, real-time restaurant management system with complete database integration. 
                Streamline orders, inventory, staff, and reporting all from one powerful platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  onClick={() => navigate('/login')}
                  size="lg"
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-6 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  Get Started
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  size="lg"
                  variant="outline"
                  className="border-2 border-orange-600 text-orange-600 px-8 py-6 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:bg-orange-50"
                >
                  Sign Up
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center lg:text-left">
                    <div className="flex justify-center lg:justify-start text-orange-600 mb-2">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Image/Visual */}
            <div className="relative">
              <div className="relative z-10">
                <img
                  src="/images/Pasta Carbonara.jpg"
                  alt="Restaurant Food"
                  className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80';
                  }}
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-gradient-to-br from-orange-400 to-red-400 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-extrabold text-gray-900 mb-4">
              Powerful Features
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to run your restaurant efficiently, all connected to a secure database
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-2xl"
              >
                {/* Icon */}
                <div className="mb-6">
                  <div className="inline-block p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>

                {/* Hover effect gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gradient-to-br from-gray-50 to-orange-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/images/Burger.jpg"
                alt="Restaurant Interior"
                className="w-full h-auto rounded-2xl shadow-2xl"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80';
                }}
              />
            </div>
            <div className="space-y-6">
              <h3 className="text-4xl font-extrabold text-gray-900">
                Built for Modern Restaurants
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our Restaurant Management System is designed with modern restaurants in mind. 
                Every feature is fully integrated with a secure MySQL database, ensuring data 
                integrity and real-time synchronization across all operations.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">100% Database-Backed</h5>
                    <p className="text-gray-600">All data securely stored in MySQL with real-time sync</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Secure Authentication</h5>
                    <p className="text-gray-600">Enterprise-grade security with password encryption</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Real-Time Updates</h5>
                    <p className="text-gray-600">Instant synchronization across all devices and users</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Complete Audit Trail</h5>
                    <p className="text-gray-600">Track every action for compliance and security</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-r from-orange-600 to-red-600 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Ready to Transform Your Restaurant?
          </h3>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of restaurants already using our system to streamline operations 
            and boost productivity.
          </p>
          <Button
            onClick={() => navigate('/register')}
            size="lg"
            className="bg-white text-orange-600 hover:bg-gray-100 px-10 py-6 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            Start Your Free Trial
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-lg">
                  <ChefHat className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">Restaurant RMS</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                The complete solution for modern restaurant management. 
                Built with care for your business success.
              </p>
            </div>

            {/* Features */}
            <div>
              <h5 className="font-semibold text-lg mb-4">Features</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-orange-500 transition-colors">Menu Management</a></li>
                <li><a href="#features" className="hover:text-orange-500 transition-colors">Order Processing</a></li>
                <li><a href="#features" className="hover:text-orange-500 transition-colors">Inventory Control</a></li>
                <li><a href="#features" className="hover:text-orange-500 transition-colors">Staff Management</a></li>
                <li><a href="#features" className="hover:text-orange-500 transition-colors">Reports & Analytics</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h5 className="font-semibold text-lg mb-4">Resources</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-500 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Blog</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h5 className="font-semibold text-lg mb-4">Contact</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Email: support@restaurantrms.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Address: 123 Restaurant St</li>
              </ul>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors">
                  <span className="text-sm font-bold">f</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors">
                  <span className="text-sm font-bold">t</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors">
                  <span className="text-sm font-bold">in</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Restaurant Management System. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

