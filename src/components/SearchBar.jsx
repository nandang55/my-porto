import { FiSearch, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, placeholder = 'Search...', resultCount = null }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // Debounce search untuk performance
    const timer = setTimeout(() => {
      onSearch(searchValue);
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchValue, onSearch]);

  const handleClear = () => {
    setSearchValue('');
    onSearch('');
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div
        className={`relative transition-all duration-200 ${
          isFocused ? 'scale-[1.02]' : 'scale-100'
        }`}
      >
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <FiSearch size={20} />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full pl-12 pr-12 py-4 text-lg rounded-xl border-2 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
            isFocused
              ? 'border-primary-500 shadow-lg shadow-primary-500/20'
              : 'border-gray-300 dark:border-gray-600 shadow-md hover:border-primary-400 dark:hover:border-primary-500'
          } focus:outline-none`}
        />

        {/* Clear Button */}
        {searchValue && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            title="Clear search"
          >
            <FiX size={20} />
          </button>
        )}
      </div>

      {/* Search Info */}
      {searchValue && (
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {resultCount !== null && (
              <>
                Found <span className="font-bold text-primary-600 dark:text-primary-400">{resultCount}</span>{' '}
                {resultCount === 1 ? 'project' : 'projects'} matching "{searchValue}"
              </>
            )}
          </p>
        </div>
      )}

      {/* Search Tips */}
      {isFocused && !searchValue && (
        <div className="mt-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
          <p className="text-xs text-primary-700 dark:text-primary-300 text-center">
            💡 <strong>Tip:</strong> Search by project name, description, or technology (e.g., "React", "E-Commerce")
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
