import { 
  FiTarget, 
  FiHeart, 
  FiZap, 
  FiUsers, 
  FiTrendingUp, 
  FiShield,
  FiAward,
  FiClock,
  FiGlobe,
  FiCode
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const About = () => {
  const values = [
    {
      icon: <FiZap className="text-3xl" />,
      title: 'Innovation',
      description: 'We constantly push boundaries to provide cutting-edge portfolio solutions.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: <FiHeart className="text-3xl" />,
      title: 'User-Centric',
      description: 'Every feature is designed with our users\' success and satisfaction in mind.',
      color: 'from-pink-500 to-red-500'
    },
    {
      icon: <FiShield className="text-3xl" />,
      title: 'Security First',
      description: 'Enterprise-grade security to protect your work and personal information.',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: <FiAward className="text-3xl" />,
      title: 'Excellence',
      description: 'We strive for perfection in every aspect of our platform and service.',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const stats = [
    { icon: <FiUsers />, number: '10,000+', label: 'Active Users' },
    { icon: <FiGlobe />, number: '50,000+', label: 'Portfolios Created' },
    { icon: <FiTrendingUp />, number: '99.9%', label: 'Uptime' },
    { icon: <FiClock />, number: '24/7', label: 'Support' }
  ];

  const techStack = [
    { name: 'React.js', description: 'Modern UI library for blazing fast interfaces' },
    { name: 'Supabase', description: 'Powerful backend with real-time database' },
    { name: 'TailwindCSS', description: 'Beautiful, responsive design system' },
    { name: 'PostgreSQL', description: 'Robust and reliable data storage' },
    { name: 'Vite', description: 'Lightning-fast build tool and dev server' },
    { name: 'CKEditor', description: 'Professional WYSIWYG content editor' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About BagdjaPorto
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8">
              Empowering professionals to showcase their best work with stunning, 
              easy-to-build portfolio websites.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="card group hover:shadow-2xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <FiTarget className="text-white text-2xl" />
                </div>
                <h2 className="text-3xl font-bold">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                To democratize professional portfolio creation by providing powerful, 
                intuitive tools that enable anyone—from designers to developers, 
                photographers to writers—to build stunning online portfolios without 
                technical barriers.
              </p>
            </div>

            <div className="card group hover:shadow-2xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <FiTrendingUp className="text-white text-2xl" />
                </div>
                <h2 className="text-3xl font-bold">Our Vision</h2>
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                To become the world's leading portfolio platform, recognized for 
                innovation, ease of use, and empowering millions of professionals 
                to showcase their talents and advance their careers through beautiful, 
                functional online portfolios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Our Story</h2>
            <div className="card">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                BagdjaPorto was born from a simple observation: talented professionals 
                often struggle to showcase their work online. Traditional portfolio builders 
                were either too complex, too expensive, or too limited in features.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                In 2024, our team of developers and designers came together with a shared 
                vision: create a portfolio platform that combines power with simplicity. 
                We wanted to build something that a complete beginner could use, yet powerful 
                enough for seasoned professionals.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Today, BagdjaPorto serves thousands of users worldwide, helping them land 
                dream jobs, attract clients, and build their personal brands. We're proud to 
                be part of their success stories, and we're just getting started.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Our Core Values</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            The principles that guide everything we do
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <div
                key={index}
                className="card text-center hover:shadow-2xl transition-all group"
              >
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${value.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">By the Numbers</h2>
          <p className="text-xl text-center mb-12 opacity-90">
            Our growth and commitment to excellence
          </p>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl mb-4 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <FiCode className="text-primary-600 dark:text-primary-400 text-3xl" />
              </div>
              <h2 className="text-4xl font-bold mb-4">Built with Modern Technology</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                We use the best tools to deliver the best experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {techStack.map((tech, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl hover:shadow-lg transition-shadow"
                >
                  <div className="w-3 h-3 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{tech.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{tech.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Join thousands of professionals who trust BagdjaPorto to showcase their work
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/admin/login" 
                className="btn-primary text-lg px-8 py-4 flex items-center gap-2 justify-center shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
              >
                Create Your Portfolio
              </Link>
              <Link 
                to="/contact" 
                className="btn-secondary text-lg px-8 py-4 hover:shadow-lg transform hover:-translate-y-1 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

