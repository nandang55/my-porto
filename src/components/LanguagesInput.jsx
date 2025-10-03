import { useState } from 'react';
import { FiX } from 'react-icons/fi';

const LanguagesInput = ({ value = [], onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Popular languages
  const POPULAR_LANGUAGES = [
    'English', 'Indonesian', 'Mandarin', 'Spanish', 'French', 'German',
    'Japanese', 'Korean', 'Arabic', 'Portuguese', 'Russian', 'Italian',
    'Dutch', 'Turkish', 'Hindi', 'Bengali', 'Urdu', 'Thai', 'Vietnamese',
    'Polish', 'Ukrainian', 'Romanian', 'Greek', 'Czech', 'Swedish',
    'Hungarian', 'Finnish', 'Danish', 'Norwegian', 'Hebrew', 'Malay'
  ];

  const addLanguage = (language) => {
    const trimmedLanguage = language.trim();
    if (trimmedLanguage && !value.includes(trimmedLanguage)) {
      onChange([...value, trimmedLanguage]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeLanguage = (languageToRemove) => {
    onChange(value.filter(lang => lang !== languageToRemove));
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        addLanguage(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeLanguage(value[value.length - 1]);
    }
  };

  // Get filtered suggestions
  const getFilteredSuggestions = () => {
    return POPULAR_LANGUAGES
      .filter(lang => 
        lang.toLowerCase().includes(inputValue.toLowerCase()) &&
        !value.includes(lang)
      )
      .slice(0, 10);
  };

  const suggestions = getFilteredSuggestions();

  return (
    <div>
      {/* Selected Languages */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {value.map((language, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
            >
              {language}
              <button
                type="button"
                onClick={() => removeLanguage(language)}
                className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
              >
                <FiX size={14} />
              </button>
            </span>
          ))}
        </div>
      )}

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
          placeholder="Type a language or select from suggestions..."
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && inputValue && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((language, index) => (
              <button
                type="button"
                key={index}
                onClick={() => addLanguage(language)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <span className="text-2xl">🌍</span>
                <span>{language}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Type and press Enter, or click suggestions to add languages
      </p>
    </div>
  );
};

export default LanguagesInput;

