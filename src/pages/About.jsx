import { FiAward, FiBriefcase, FiBook } from 'react-icons/fi';

const About = () => {
  const experiences = [
    {
      title: 'Senior Software Engineer',
      company: 'Tech Company Inc.',
      period: '2022 - Present',
      description: 'Leading development of scalable web applications using React, Node.js, and cloud technologies.',
    },
    {
      title: 'Full Stack Developer',
      company: 'Digital Solutions Ltd.',
      period: '2020 - 2022',
      description: 'Developed and maintained multiple client projects using modern web technologies.',
    },
    {
      title: 'Junior Developer',
      company: 'Startup XYZ',
      period: '2018 - 2020',
      description: 'Started career building responsive websites and learning modern development practices.',
    },
  ];

  const education = [
    {
      degree: 'Bachelor of Computer Science',
      institution: 'University Name',
      period: '2014 - 2018',
      description: 'Focused on software engineering, algorithms, and data structures.',
    },
  ];

  const skills = {
    'Frontend': ['React.js', 'Next.js', 'TypeScript', 'TailwindCSS', 'Redux'],
    'Backend': ['Node.js', 'Express', 'PostgreSQL', 'Supabase', 'REST API'],
    'Tools': ['Git', 'Docker', 'VS Code', 'Figma', 'Postman'],
    'Other': ['Agile', 'CI/CD', 'Testing', 'SEO', 'Performance Optimization'],
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="section-title">About Me</h1>

      {/* Introduction */}
      <section className="max-w-4xl mx-auto mb-16">
        <div className="card">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            Hi! I'm a passionate Software Engineer with over 5 years of experience in building
            web applications. I love creating elegant solutions to complex problems and continuously
            learning new technologies.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            My expertise lies in full-stack development, with a strong focus on React.js, Node.js,
            and modern cloud technologies. I'm dedicated to writing clean, maintainable code and
            delivering exceptional user experiences.
          </p>
        </div>
      </section>

      {/* Skills */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <FiAward className="text-primary-600 dark:text-primary-400" size={24} />
          <h2 className="text-3xl font-bold">Skills & Technologies</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category} className="card">
              <h3 className="font-bold text-xl mb-4 text-primary-600 dark:text-primary-400">
                {category}
              </h3>
              <ul className="space-y-2">
                {items.map((skill) => (
                  <li key={skill} className="text-gray-700 dark:text-gray-300">
                    • {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <FiBriefcase className="text-primary-600 dark:text-primary-400" size={24} />
          <h2 className="text-3xl font-bold">Work Experience</h2>
        </div>
        <div className="max-w-4xl mx-auto space-y-6">
          {experiences.map((exp, index) => (
            <div key={index} className="card">
              <h3 className="text-xl font-bold mb-1">{exp.title}</h3>
              <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">
                {exp.company}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{exp.period}</p>
              <p className="text-gray-700 dark:text-gray-300">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section>
        <div className="flex items-center gap-2 mb-8 justify-center">
          <FiBook className="text-primary-600 dark:text-primary-400" size={24} />
          <h2 className="text-3xl font-bold">Education</h2>
        </div>
        <div className="max-w-4xl mx-auto space-y-6">
          {education.map((edu, index) => (
            <div key={index} className="card">
              <h3 className="text-xl font-bold mb-1">{edu.degree}</h3>
              <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">
                {edu.institution}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{edu.period}</p>
              <p className="text-gray-700 dark:text-gray-300">{edu.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;

