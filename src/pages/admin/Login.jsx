import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiLock, FiMail, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';

const Login = () => {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const { signIn, signUp } = useAuth();
  const { success } = useAlert();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const onSubmitLogin = async (data) => {
    setLoading(true);
    setError('');

    const { error } = await signIn(data.email, data.password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/admin/dashboard');
    }
  };

  const onSubmitRegister = async (data) => {
    setLoading(true);
    setError('');

    const { error } = await signUp(data.email, data.password, {
      full_name: data.fullName,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      success('Registration successful! Please check your email to verify your account.');
      setLoading(false);
      reset();
      // Switch to login mode after successful registration
      setTimeout(() => {
        setIsRegister(false);
      }, 2000);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError('');
    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-primary-600 rounded-2xl mb-4">
            <FiUser className="text-white text-4xl" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isRegister 
              ? 'Sign up to start building your portfolio' 
              : 'Sign in to access your dashboard'
            }
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 mb-6 shadow-sm">
          <button
            type="button"
            onClick={() => !isRegister || toggleMode()}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              !isRegister
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => isRegister || toggleMode()}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              isRegister
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="card">
          {/* Login Form */}
          {!isRegister && (
            <form onSubmit={handleSubmit(onSubmitLogin)} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block font-medium mb-2">
                  Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    {...register('email', { required: 'Email is required' })}
                    className="input pl-10 w-full"
                    placeholder="your.email@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    {...register('password', { required: 'Password is required' })}
                    className="input pl-10 w-full"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          )}

          {/* Register Form */}
          {isRegister && (
            <form onSubmit={handleSubmit(onSubmitRegister)} className="space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block font-medium mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="fullName"
                    {...register('fullName', { required: 'Full name is required' })}
                    className="input pl-10 w-full"
                    placeholder="John Doe"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="registerEmail" className="block font-medium mb-2">
                  Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    id="registerEmail"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    className="input pl-10 w-full"
                    placeholder="your.email@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="registerPassword" className="block font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    id="registerPassword"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    className="input pl-10 w-full"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    id="confirmPassword"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) =>
                        value === watch('password') || 'Passwords do not match',
                    })}
                    className="input pl-10 w-full"
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>

              {/* Terms */}
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isRegister ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <Link
                  to="/admin/register"
                  className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
                >
                  Sign up
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

