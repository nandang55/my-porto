import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const BackButton = ({ 
  to = '/admin/dashboard', 
  label = 'Back to Dashboard',
  iconOnly = false,
  size = 20
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  if (iconOnly) {
    return (
      <button
        onClick={handleBack}
        className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all hover:scale-110"
        title={label}
      >
        <FiArrowLeft size={size} />
      </button>
    );
  }

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
      title={label}
    >
      <div className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <FiArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
      </div>
      <span className="font-medium hidden sm:inline">{label}</span>
    </button>
  );
};

export default BackButton;
