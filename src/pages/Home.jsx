import { Link } from 'react-router-dom';
import { FiArrowRight, FiGithub, FiLinkedin } from 'react-icons/fi';

const Home = () => {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center justify-center py-20">
        <div className="text-center max-w-4xl">
          {/* Profile Image */}
          <div className="mb-8">
            <img
              src="https://via.placeholder.com/200"
              alt="Profile"
              className="w-32 h-32 md:w-48 md:h-48 rounded-full mx-auto shadow-2xl border-4 border-primary-500 object-cover"
            />
          </div>

          {/* Name & Title */}
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Hi, I'm <span className="text-primary-600 dark:text-primary-400">Your Name</span>
          </h1>
          <h2 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-400 mb-6">
            Software Engineer & Programmer
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Passionate about building innovative solutions and creating exceptional digital experiences.
            Specializing in full-stack development with modern technologies.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link to="/portfolio" className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
              View My Work <FiArrowRight />
            </Link>
            <Link to="/contact" className="btn-secondary w-full sm:w-auto text-center">
              Get In Touch
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex gap-4 justify-center">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 transition-colors duration-200"
            >
              <FiGithub size={24} />
            </a>
            <a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 transition-colors duration-200"
            >
              <FiLinkedin size={24} />
            </a>
          </div>
        </div>
      </section>

      {/* Featured Skills Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50 -mx-4 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="section-title">Core Skills</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['React.js', 'Node.js', 'TypeScript', 'Supabase', 'TailwindCSS', 'PostgreSQL', 'Git', 'REST API'].map((skill) => (
              <div key={skill} className="card text-center">
                <p className="font-medium text-lg">{skill}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

