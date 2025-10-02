import { useEffect, useState } from 'react';
import { FiMail, FiTrash2 } from 'react-icons/fi';
import { supabase } from '../../services/supabase';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message.');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Contact Messages</h1>

        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FiMail className="text-primary-600 dark:text-primary-400" />
                    <h3 className="font-bold text-lg">{message.name}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    {message.email}
                  </p>
                  <p className="font-medium mb-2">{message.subject}</p>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {message.message}
                  </p>
                  <p className="text-sm text-gray-500 mt-3">
                    {new Date(message.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(message.id)}
                  className="btn-secondary flex items-center gap-1 text-sm text-red-600 dark:text-red-400 ml-4"
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {messages.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No messages yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;

