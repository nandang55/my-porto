import { useEffect } from 'react';
import { FiX, FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi';

const Alert = ({ id, type = 'info', title, message, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const types = {
    success: {
      icon: FiCheckCircle,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-500',
      iconColor: 'text-green-500',
      textColor: 'text-green-800 dark:text-green-200',
      progressBar: 'bg-green-500',
    },
    error: {
      icon: FiAlertCircle,
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-500',
      iconColor: 'text-red-500',
      textColor: 'text-red-800 dark:text-red-200',
      progressBar: 'bg-red-500',
    },
    warning: {
      icon: FiAlertTriangle,
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-500',
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-800 dark:text-yellow-200',
      progressBar: 'bg-yellow-500',
    },
    info: {
      icon: FiInfo,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-500',
      iconColor: 'text-blue-500',
      textColor: 'text-blue-800 dark:text-blue-200',
      progressBar: 'bg-blue-500',
    },
  };

  const config = types[type] || types.info;
  const Icon = config.icon;

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border-l-4 p-4 rounded-lg shadow-lg mb-3 animate-slideIn`}
      role="alert"
    >
      <div className="flex items-start">
        {/* Icon */}
        <div className={`${config.iconColor} flex-shrink-0`}>
          <Icon size={24} />
        </div>

        {/* Content */}
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`font-bold mb-1 ${config.textColor}`}>
              {title}
            </h3>
          )}
          {message && (
            <p className={`text-sm ${config.textColor}`}>
              {message}
            </p>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={() => onClose(id)}
          className={`${config.iconColor} hover:opacity-70 transition-opacity ml-3 flex-shrink-0`}
          aria-label="Close"
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Progress Bar (auto-dismiss indicator) */}
      {duration && duration > 0 && (
        <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${config.progressBar} animate-progress`}
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      )}
    </div>
  );
};

export default Alert;
