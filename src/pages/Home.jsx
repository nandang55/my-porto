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
      icon: <FiImage className="text-3xl" />,
      title: 'Media Management',
      description: 'Upload multiple images and videos with drag-and-drop. Automatic thumbnail generation and optimization.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <FiGlobe className="text-3xl" />,
      title: 'Custom Domain',
      description: 'Use your own domain or get a free subdomain. Full SSL and CDN included for blazing fast performance.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <FiSettings className="text-3xl" />,
      title: 'Easy Customization',
      description: 'Customize colors, fonts, and layout without coding. Real-time preview of all your changes.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: <FiZap className="text-3xl" />,
      title: 'Lightning Fast',
      description: 'Built with modern tech stack for instant page loads. Optimized for performance and SEO.',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: <FiShield className="text-3xl" />,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with automatic backups. Your data is always safe and accessible.',
      color: 'from-red-500 to-red-600'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Account',
      description: 'Sign up in seconds with your email. No credit card required to start.',
    },
    {
      number: '02',
      title: 'Build Portfolio',
      description: 'Add your projects, skills, and experience with our intuitive editor.',
    },
    {
      number: '03',
      title: 'Customize Design',
      description: 'Choose a template and customize it to match your personal brand.',
    },
    {
      number: '04',
      title: 'Go Live',
      description: 'Publish your portfolio and share it with the world instantly.',
    }
  ];

  const benefits = [
    'Multi-user support with isolated data',
    'WYSIWYG editor for rich content',
    'Advanced tech stack tagging system',
    'Global search functionality',
    'Dark mode support',
    'Mobile responsive design',
    'SEO optimized pages',
    'Analytics dashboard',
    'Contact form with email notifications',
    'Blog integration',
    'Social media links',
    'Custom metadata for projects'
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 opacity-10 dark:opacity-20"></div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full mb-8 animate-fadeInUp">
              <FiStar className="text-yellow-500" />
              <span className="font-semibold">Professional Portfolio Platform</span>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              Build Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
                Professional Portfolio
              </span>
              in Minutes
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              Showcase your work, attract clients, and grow your career with a stunning portfolio website.
              No coding required.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <Link 
                to="/admin/login" 
                className="btn-primary flex items-center gap-2 justify-center text-lg px-8 py-4 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
              >
                Get Started Free <FiArrowRight />
              </Link>
              <a 
                href="#features" 
                className="btn-secondary text-lg px-8 py-4 hover:shadow-lg transform hover:-translate-y-1 transition-all"
              >
                Explore Features
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-gray-600 dark:text-gray-400 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-2">
                <FiCheck className="text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheck className="text-green-500" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheck className="text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path 
              fill="currentColor" 
              fillOpacity="1" 
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
              className="text-gray-50 dark:text-gray-800/50"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Powerful features to help you create a portfolio that stands out
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Four simple steps to launch your professional portfolio
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-500 to-primary-300 dark:from-primary-600 dark:to-primary-800 -z-10"></div>
                )}
                
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center text-3xl font-bold shadow-xl">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Packed with Features
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                All the tools you need to create an amazing portfolio
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                    <FiCheck className="text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div className="p-8">
              <div className="text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                <FiUsers className="inline mb-2" />
              </div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-gray-600 dark:text-gray-400">Active Users</div>
            </div>
            <div className="p-8">
              <div className="text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                <FiLayout className="inline mb-2" />
              </div>
              <div className="text-4xl font-bold mb-2">5000+</div>
              <div className="text-gray-600 dark:text-gray-400">Portfolios Created</div>
            </div>
            <div className="p-8">
              <div className="text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                <FiTrendingUp className="inline mb-2" />
              </div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-gray-600 dark:text-gray-400">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Build Your Portfolio?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of professionals who trust us to showcase their work
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/admin/login" 
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-2 justify-center shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
              >
                Start Building Now <FiArrowRight />
              </Link>
              <Link 
                to="/contact" 
                className="bg-primary-700 hover:bg-primary-800 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-white/30 hover:border-white/50 transition-all"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={logoBagdjaPorto} 
                  alt="BagdjaPorto" 
                  className="h-8 w-auto"
                />
              </div>
              <p className="text-sm">
                Create stunning professional portfolios in minutes. No coding required.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><Link to="/admin/login" className="hover:text-white transition-colors">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/admin/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} BagdjaPorto. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

