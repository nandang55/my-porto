// Tech tag component with color coding for display
const TECH_COLORS = {
  // Frontend
  'React': 'bg-cyan-500',
  'Vue.js': 'bg-green-500',
  'Angular': 'bg-red-500',
  'Next.js': 'bg-black dark:bg-gray-900',
  'Svelte': 'bg-orange-500',
  'TailwindCSS': 'bg-teal-500',
  'TypeScript': 'bg-blue-600',
  'JavaScript': 'bg-yellow-400',
  
  // Backend
  'Node.js': 'bg-green-600',
  'Express': 'bg-gray-700',
  'Django': 'bg-green-700',
  'Laravel': 'bg-red-600',
  'FastAPI': 'bg-teal-600',
  'Spring Boot': 'bg-green-500',
  'Ruby on Rails': 'bg-red-500',
  'PHP': 'bg-indigo-500',
  
  // Database
  'PostgreSQL': 'bg-blue-500',
  'MongoDB': 'bg-green-500',
  'MySQL': 'bg-blue-600',
  'Redis': 'bg-red-600',
  'Supabase': 'bg-emerald-500',
  'Firebase': 'bg-yellow-500',
  'SQLite': 'bg-blue-400',
  
  // DevOps & Cloud
  'Docker': 'bg-blue-500',
  'Kubernetes': 'bg-blue-600',
  'AWS': 'bg-orange-500',
  'Vercel': 'bg-black dark:bg-gray-900',
  'Netlify': 'bg-teal-500',
  'GitHub Actions': 'bg-gray-800',
  'Azure': 'bg-blue-600',
  
  // Mobile
  'React Native': 'bg-cyan-500',
  'Flutter': 'bg-blue-500',
  'Swift': 'bg-orange-500',
  'Kotlin': 'bg-purple-500',
  
  // Tools
  'Git': 'bg-orange-600',
  'Vite': 'bg-purple-500',
  'Webpack': 'bg-blue-500',
  'Jest': 'bg-red-500',
  'Figma': 'bg-purple-600',
};

const TechTag = ({ tech, size = 'md' }) => {
  const color = TECH_COLORS[tech] || 'bg-primary-500';
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`${color} text-white ${sizeClasses[size]} rounded-full font-medium shadow-sm inline-block`}
    >
      {tech}
    </span>
  );
};

export default TechTag;
