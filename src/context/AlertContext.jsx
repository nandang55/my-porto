import { createContext, useContext, useState, useCallback } from 'react';
import Alert from '../components/Alert';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = useCallback(({ type = 'info', title, message, duration = 5000 }) => {
    const id = Date.now() + Math.random();
    const newAlert = { id, type, title, message, duration };
    
    setAlerts((prev) => [...prev, newAlert]);
    
    return id;
  }, []);

  const removeAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  // Convenience methods
  const success = useCallback((message, title = 'Success') => {
    return showAlert({ type: 'success', title, message });
  }, [showAlert]);

  const error = useCallback((message, title = 'Error') => {
    return showAlert({ type: 'error', title, message });
  }, [showAlert]);

  const warning = useCallback((message, title = 'Warning') => {
    return showAlert({ type: 'warning', title, message });
  }, [showAlert]);

  const info = useCallback((message, title = 'Info') => {
    return showAlert({ type: 'info', title, message });
  }, [showAlert]);

  const value = {
    showAlert,
    removeAlert,
    success,
    error,
    warning,
    info,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      
      {/* Alert Container - Fixed position at top-right */}
      <div className="fixed top-4 right-4 z-[9999] max-w-md w-full pointer-events-none">
        <div className="pointer-events-auto">
          {alerts.map((alert) => (
            <Alert
              key={alert.id}
              id={alert.id}
              type={alert.type}
              title={alert.title}
              message={alert.message}
              duration={alert.duration}
              onClose={removeAlert}
            />
          ))}
        </div>
      </div>
    </AlertContext.Provider>
  );
};
