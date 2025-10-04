import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiArrowRight, 
  FiImage, 
  FiLayout, 
  FiSettings, 
  FiGlobe, 
  FiZap, 
  FiShield,
  FiSmartphone,
  FiTrendingUp,
  FiUsers,
  FiCheck,
  FiStar
} from 'react-icons/fi';
import logoBagdjaPorto from '../assets/logo_bagdja_porto.png';

const Home = () => {
  const features = [
    {
      icon: <FiLayout className="text-3xl" />,
      title: 'Beautiful Templates',
      description: 'Choose from stunning, professionally designed portfolio templates that showcase your work perfectly.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <FiSettings className="text-3xl" />,
      title: 'Easy Customization',
      description: 'Customize colors, fonts, layouts, and content with our intuitive drag-and-drop editor.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <FiGlobe className="text-3xl" />,
      title: 'Custom Domains',
      description: 'Use your own domain name to make your portfolio truly yours with professional branding.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <FiZap className="text-3xl" />,
      title: 'Lightning Fast',
      description: 'Built with modern technology for blazing fast loading times and optimal performance.',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: <FiShield className="text-3xl" />,
      title: 'Secure & Reliable',
      description: 'Your data is protected with enterprise-grade security and 99.9% uptime guarantee.',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: <FiSmartphone className="text-3xl" />,
      title: 'Mobile Responsive',
      description: 'Perfect on all devices - desktop, tablet, and mobile with responsive design.',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const stats = [
    { label: 'Active Users', value: '10,000+', icon: <FiUsers className="text-2xl" /> },
    { label: 'Portfolios Created', value: '50,000+', icon: <FiTrendingUp className="text-2xl" /> },
    { label: 'Happy Customers', value: '98%', icon: <FiStar className="text-2xl" /> }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <img 
                src={logoBagdjaPorto} 
                alt="BagdjaPorto" 
                className="h-16 mx-auto mb-6"
              />
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Create Your
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Perfect Portfolio
              </span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Build stunning, professional portfolios in minutes. No coding required. 
              Showcase your work with beautiful templates and custom domains.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/admin/register" 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Get Started Free
                <FiArrowRight className="text-xl" />
              </Link>
              <Link 
                to="/admin/login" 
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-2"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-400 rounded-full opacity-20 animate-pulse delay-500"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Everything You Need to
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Build Your Portfolio
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              From beautiful templates to custom domains, we provide all the tools you need 
              to create a professional portfolio that stands out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 group"
                style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Showcase Your Work?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of professionals who trust BagdjaPorto to showcase their work 
            and grow their careers.
          </p>
          <Link 
            to="/admin/register" 
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
          >
            Start Building Now
            <FiArrowRight className="text-xl" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <img 
                src={logoBagdjaPorto} 
                alt="BagdjaPorto" 
                className="h-12 mb-4"
              />
              <p className="text-gray-400 mb-4 max-w-md">
                The easiest way to create beautiful, professional portfolios. 
                No coding required, just drag, drop, and customize.
              </p>
              <div className="flex space-x-4">
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/admin/register" className="hover:text-white transition-colors">Get Started</Link></li>
                <li><Link to="/admin/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BagdjaPorto. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;