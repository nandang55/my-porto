import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { supabase } from '../services/supabase';

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
          },
        ]);

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Thank you for your message! I will get back to you soon.',
      });
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage({
        type: 'error',
        text: 'Failed to send message. Please try again or contact me directly via email.',
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: FiMail,
      title: 'Email',
      value: 'contact@bagdja.com',
      link: 'mailto:contact@bagdja.com',
    },
    {
      icon: FiPhone,
      title: 'Phone / WhatsApp',
      value: '+62 877-2453-8083',
      link: 'https://wa.me/6287724538083',
    },
    {
      icon: FiMapPin,
      title: 'Location',
      value: 'West Java - Indonesia',
      link: null,
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <h1 className="section-title text-2xl sm:text-3xl lg:text-4xl">Get In Touch</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-base px-4">
        Have a project in mind or want to collaborate? Feel free to reach out!
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 max-w-6xl mx-auto">
        {/* Contact Info */}
        <div className="order-2 lg:order-1">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Contact Information</h2>
          <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
            {contactInfo.map((info) => {
              const Icon = info.icon;
              const content = (
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex-shrink-0">
                    <Icon className="text-primary-600 dark:text-primary-400" size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium mb-1 text-sm sm:text-base">{info.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base break-words">{info.value}</p>
                  </div>
                </div>
              );

              return info.link ? (
                <a
                  key={info.title}
                  href={info.link}
                  className="block card hover:shadow-xl transition-shadow"
                >
                  {content}
                </a>
              ) : (
                <div key={info.title} className="card">
                  {content}
                </div>
              );
            })}
          </div>

          <div className="card bg-primary-50 dark:bg-primary-900/20">
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
              I'm currently available for freelance work and open to discussing new opportunities.
              Let's create something amazing together!
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="order-1 lg:order-2">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block font-medium mb-2 text-sm sm:text-base">
                Name
              </label>
              <input
                type="text"
                id="name"
                {...register('name', { required: 'Name is required' })}
                className="input-field w-full text-sm sm:text-base"
                placeholder="Your name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block font-medium mb-2 text-sm sm:text-base">
                Email
              </label>
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
                className="input-field w-full text-sm sm:text-base"
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block font-medium mb-2 text-sm sm:text-base">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                {...register('subject', { required: 'Subject is required' })}
                className="input-field w-full text-sm sm:text-base"
                placeholder="What's this about?"
              />
              {errors.subject && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.subject.message}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block font-medium mb-2 text-sm sm:text-base">
                Message
              </label>
              <textarea
                id="message"
                rows="5"
                {...register('message', { required: 'Message is required' })}
                className="input-field w-full text-sm sm:text-base resize-none"
                placeholder="Your message..."
              />
              {errors.message && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.message.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base py-3 sm:py-3.5"
            >
              {loading ? 'Sending...' : 'Send Message'}
              <FiSend className="flex-shrink-0" />
            </button>

            {/* Message */}
            {message.text && (
              <div
                className={`p-3 sm:p-4 rounded-lg text-sm sm:text-base ${
                  message.type === 'success'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                }`}
              >
                {message.text}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

