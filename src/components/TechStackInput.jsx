import { useState, useRef, useEffect } from 'react';
import { FiX, FiPlus, FiSearch } from 'react-icons/fi';

// Popular tech stack dengan color coding
const POPULAR_TECH = {
  'Frontend': [
    { name: 'React', color: 'bg-cyan-500' },
    { name: 'Vue.js', color: 'bg-green-500' },
    { name: 'Angular', color: 'bg-red-500' },
    { name: 'Next.js', color: 'bg-black' },
    { name: 'Svelte', color: 'bg-orange-500' },
    { name: 'TailwindCSS', color: 'bg-teal-500' },
    { name: 'TypeScript', color: 'bg-blue-600' },
    { name: 'JavaScript', color: 'bg-yellow-400' },
  ],
  'Backend': [
    { name: 'Node.js', color: 'bg-green-600' },
    { name: 'Express', color: 'bg-gray-700' },
    { name: 'Django', color: 'bg-green-700' },
    { name: 'Laravel', color: 'bg-red-600' },
    { name: 'FastAPI', color: 'bg-teal-600' },
    { name: 'Spring Boot', color: 'bg-green-500' },
    { name: 'Ruby on Rails', color: 'bg-red-500' },
    { name: 'PHP', color: 'bg-indigo-500' },
  ],
  'Database': [
    { name: 'PostgreSQL', color: 'bg-blue-500' },
    { name: 'MongoDB', color: 'bg-green-500' },
    { name: 'MySQL', color: 'bg-blue-600' },
    { name: 'Redis', color: 'bg-red-600' },
    { name: 'Supabase', color: 'bg-emerald-500' },
    { name: 'Firebase', color: 'bg-yellow-500' },
    { name: 'SQLite', color: 'bg-blue-400' },
  ],
  'DevOps & Cloud': [
    { name: 'Docker', color: 'bg-blue-500' },
    { name: 'Kubernetes', color: 'bg-blue-600' },
    { name: 'AWS', color: 'bg-orange-500' },
    { name: 'Vercel', color: 'bg-black' },
    { name: 'Netlify', color: 'bg-teal-500' },
    { name: 'GitHub Actions', color: 'bg-gray-800' },
    { name: 'Azure', color: 'bg-blue-600' },
  ],
  'Mobile': [
    { name: 'React Native', color: 'bg-cyan-500' },
    { name: 'Flutter', color: 'bg-blue-500' },
    { name: 'Swift', color: 'bg-orange-500' },
    { name: 'Kotlin', color: 'bg-purple-500' },
  ],
  'Tools': [
    { name: 'Git', color: 'bg-orange-600' },
    { name: 'Vite', color: 'bg-purple-500' },
    { name: 'Webpack', color: 'bg-blue-500' },
    { name: 'Jest', color: 'bg-red-500' },
    { name: 'Figma', color: 'bg-purple-600' },
  ],
};

// Flatten all tech for searching
const ALL_TECH = Object.values(POPULAR_TECH).flat();

const TechStackInput = ({ value = [], onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter suggestions based on input
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = ALL_TECH.filter(
        (tech) =>
          tech.name.toLowerCase().includes(inputValue.toLowerCase()) &&
          !value.includes(tech.name)
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }, [inputValue, value]);

  const addTech = (techName) => {
    if (techName && !value.includes(techName)) {
      onChange([...value, techName]);
      setInputValue('');
      setShowSuggestions(false);
      inputRef.current?.focus();
    }
  };

  const removeTech = (techToRemove) => {
    onChange(value.filter((tech) => tech !== techToRemove));
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTech(inputValue.trim());
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTech(value[value.length - 1]);
    }
  };

  const getTechColor = (techName) => {
    const tech = ALL_TECH.find((t) => t.name === techName);
    return tech?.color || 'bg-primary-500';
  };

  const getCategoryTech = (category) => {
    if (category === 'All') return ALL_TECH;
    return POPULAR_TECH[category] || [];
  };

  return (
    <div ref={containerRef} className="space-y-3">
      {/* Input Field */}
      <div className="relative">
        <div className="flex items-center gap-2 input-field !py-2">
          <FiSearch className="text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search or add tech stack (e.g., React, Node.js)..."
            className="flex-1 bg-transparent border-none focus:outline-none"
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => addTech(inputValue.trim())}
              className="text-primary-600 dark:text-primary-400 hover:opacity-70"
              title="Add custom tech"
            >
              <FiPlus size={20} />
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && (inputValue || selectedCategory !== 'All') && (
          <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
            {/* Category Tabs */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2">
              <div className="flex gap-1 overflow-x-auto">
                {['All', ...Object.keys(POPULAR_TECH)].map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Suggestions List */}
            <div className="p-2">
              {filteredSuggestions.length > 0 ? (
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                    Search Results
                  </p>
                  {filteredSuggestions.map((tech) => (
                    <button
                      key={tech.name}
                      type="button"
                      onClick={() => addTech(tech.name)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <span className={`w-3 h-3 rounded-full ${tech.color}`} />
                      <span className="font-medium">{tech.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                    {selectedCategory === 'All' ? 'Popular Tech' : selectedCategory}
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {getCategoryTech(selectedCategory)
                      .filter((tech) => !value.includes(tech.name))
                      .map((tech) => (
                        <button
                          key={tech.name}
                          type="button"
                          onClick={() => addTech(tech.name)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                        >
                          <span className={`w-3 h-3 rounded-full ${tech.color}`} />
                          <span className="text-sm font-medium">{tech.name}</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Add custom option */}
              {inputValue && !ALL_TECH.find((t) => t.name.toLowerCase() === inputValue.toLowerCase()) && (
                <button
                  type="button"
                  onClick={() => addTech(inputValue.trim())}
                  className="w-full flex items-center gap-2 px-3 py-2 mt-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                >
                  <FiPlus className="text-primary-600 dark:text-primary-400" />
                  <span className="text-primary-700 dark:text-primary-300 font-medium">
                    Add "{inputValue}"
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected Tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tech) => {
            const color = getTechColor(tech);
            return (
              <div
                key={tech}
                className={`${color} text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-md group hover:shadow-lg transition-all`}
              >
                <span className="font-medium text-sm">{tech}</span>
                <button
                  type="button"
                  onClick={() => removeTech(tech)}
                  className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                  title="Remove"
                >
                  <FiX size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        💡 Click to select from popular tech or type to add custom. Press Enter to add, Backspace to remove last.
      </p>
    </div>
  );
};

export default TechStackInput;
