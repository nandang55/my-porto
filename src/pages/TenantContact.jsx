import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { supabase } from '../services/supabase';
import TenantNavbar from '../components/TenantNavbar';
import { useAlert } from '../context/AlertContext';

const TenantContact = () => {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { success, error: showError } = useAlert();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchPortfolio();
  }, [slug]);

  const fetchPortfolio = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setPortfolio(data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const { error } = await supabase.from('contact_messages').insert([
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          user_id: portfolio.user_id,
        },
      ]);

      if (error) throw error;

      success('Message sent successfully!');
      reset();
    } catch (error) {
      console.error('Error sending message:', error);
      showError('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!portfolio) {
    return <div className="min-h-screen flex items-center justify-center">Portfolio not found</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <TenantNavbar portfolio={portfolio} />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h1 className="section-title">Get In Touch</h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Have a project in mind or just want to say hello? Feel free to reach out!
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-4">
                  {portfolio.email && (
                    <a
                      href={`mailto:${portfolio.email}`}
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors"
                    >
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                        <FiMail className="text-primary-600 dark:text-primary-400 text-xl" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Email</p>
                        <p className="text-gray-600 dark:text-gray-400">{portfolio.email}</p>
                      </div>
                    </a>
                  )}

                  {portfolio.phone && (
                    <a
                      href={`tel:${portfolio.phone}`}
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors"
                    >
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                        <FiPhone className="text-primary-600 dark:text-primary-400 text-xl" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Phone</p>
                        <p className="text-gray-600 dark:text-gray-400">{portfolio.phone}</p>
                      </div>
                    </a>
                  )}

                  {portfolio.location && (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                        <FiMapPin className="text-primary-600 dark:text-primary-400 text-xl" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Location</p>
                        <p className="text-gray-600 dark:text-gray-400">{portfolio.location}</p>
                        {portfolio.timezone && (
                          <p className="text-sm text-gray-500 dark:text-gray-500">{portfolio.timezone}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Availability Status */}
              {portfolio.availability_status && (
                <div className="card">
                  <h3 className="text-xl font-semibold mb-4">Availability</h3>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      portfolio.availability_status === 'available'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : portfolio.availability_status === 'busy'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {portfolio.availability_status === 'available' && '🟢 Available for work'}
                      {portfolio.availability_status === 'busy' && '🟡 Partially available'}
                      {portfolio.availability_status === 'unavailable' && '🔴 Not available'}
                    </span>
                  </div>
                  {portfolio.hourly_rate && (
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Hourly Rate:</span> {portfolio.hourly_rate}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="input-field"
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    className="input-field"
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject *</label>
                  <input
                    type="text"
                    {...register('subject', { required: 'Subject is required' })}
                    className="input-field"
                    placeholder="What's this about?"
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <textarea
                    {...register('message', { required: 'Message is required' })}
                    rows="6"
                    className="input-field resize-none"
                    placeholder="Tell me about your project..."
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} {portfolio.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TenantContact;

