import { useState } from 'react';
import { FiX } from 'react-icons/fi';

const SkillsInput = ({ value = [], onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Popular skills categorized
  const POPULAR_SKILLS = {
    'Frontend': [
      'React.js', 'Vue.js', 'Angular', 'Next.js', 'Svelte', 'TypeScript', 'JavaScript',
      'HTML', 'CSS', 'TailwindCSS', 'Bootstrap', 'Sass', 'Material UI', 'Redux', 'React Native'
    ],
    'Backend': [
      'Node.js', 'Express.js', 'Python', 'Django', 'Flask', 'FastAPI', 'PHP', 'Laravel',
      'Ruby on Rails', 'Java', 'Spring Boot', 'Go', 'Rust', '.NET', 'C#'
    ],
    'Database': [
      'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'Firebase', 'SQLite',
      'Oracle', 'DynamoDB', 'Cassandra', 'Elasticsearch'
    ],
    'DevOps': [
      'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'CI/CD', 'Jenkins',
      'GitLab CI', 'GitHub Actions', 'Terraform', 'Ansible', 'Linux'
    ],
    'Mobile': [
      'React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS Development', 'Android Development',
      'Xamarin', 'Ionic'
    ],
    'Design': [
      'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'UI/UX Design',
      'Wireframing', 'Prototyping', 'User Research'
    ],
    'Tools': [
      'Git', 'GitHub', 'VS Code', 'Postman', 'Jira', 'Slack', 'Trello',
      'Notion', 'NPM', 'Webpack', 'Vite'
    ],
    'Other': [
      'REST API', 'GraphQL', 'Testing', 'Agile', 'Scrum', 'SEO', 'Performance Optimization',
      'Security', 'Microservices', 'WebSockets', 'WebAssembly'
    ]
  };

  const SKILL_COLORS = {
    'React.js': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Vue.js': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Angular': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Python': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'JavaScript': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'TypeScript': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Node.js': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'PHP': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Java': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'Docker': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    'Kubernetes': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'AWS': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'PostgreSQL': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'MongoDB': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'default': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  };

  const getSkillColor = (skill) => {
    return SKILL_COLORS[skill] || SKILL_COLORS['default'];
  };

  const addSkill = (skill) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !value.includes(trimmedSkill)) {
      onChange([...value, trimmedSkill]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeSkill = (skillToRemove) => {
    onChange(value.filter(skill => skill !== skillToRemove));
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        addSkill(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeSkill(value[value.length - 1]);
    }
  };

  // Get filtered suggestions
  const getFilteredSuggestions = () => {
    const allSkills = selectedCategory === 'all'
      ? Object.values(POPULAR_SKILLS).flat()
      : POPULAR_SKILLS[selectedCategory] || [];

    return allSkills
      .filter(skill => 
        skill.toLowerCase().includes(inputValue.toLowerCase()) &&
        !value.includes(skill)
      )
      .slice(0, 10);
  };

  const suggestions = getFilteredSuggestions();

  return (
    <div>
      {/* Selected Skills */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {value.map((skill, index) => (
            <span
              key={index}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getSkillColor(skill)}`}
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
              >
                <FiX size={14} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          All
        </button>
        {Object.keys(POPULAR_SKILLS).map(category => (
          <button
            type="button"
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleInputKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="input w-full"
          placeholder="Type a skill or select from suggestions..."
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && inputValue && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((skill, index) => (
              <button
                type="button"
                key={index}
                onClick={() => addSkill(skill)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <span className={`inline-block px-2 py-1 rounded text-sm ${getSkillColor(skill)}`}>
                  {skill}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Type and press Enter, or click suggestions to add skills
      </p>
    </div>
  );
};

export default SkillsInput;

