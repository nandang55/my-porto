import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiLock, FiMail, FiUser, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';

const Register = () => {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const { signUp } = useAuth();
  const { success } = useAlert();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
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
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/admin/login');
      }, 2000);
    }
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
            Create Your Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign up to start building your professional portfolio
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  {...register('fullName', { 
                    required: 'Full name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
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
              <label htmlFor="email" className="block font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="email"
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
              <label htmlFor="password" className="block font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  id="password"
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
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Must be at least 6 characters long
              </p>
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
              By signing up, you agree to our{' '}
              <a href="#" className="text-primary-600 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </form>
        </div>

        {/* Footer Links */}
        <div className="mt-6 space-y-3">
          {/* Back to Login */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/admin/login"
                className="text-primary-600 dark:text-primary-400 font-medium hover:underline inline-flex items-center gap-1"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link
              to="/"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 inline-flex items-center gap-1"
            >
              <FiArrowLeft size={14} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

