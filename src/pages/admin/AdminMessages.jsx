import { useEffect, useState, useMemo } from 'react';
import { FiMail, FiTrash2 } from 'react-icons/fi';
import { supabase } from '../../services/supabase';
import BackButton from '../../components/BackButton';
import SearchBar from '../../components/SearchBar';
import AdminNavbar from '../../components/AdminNavbar';
import { useAlert } from '../../context/AlertContext';
import { useAuth } from '../../context/AuthContext';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const alert = useAlert();
  const { user } = useAuth();

  useEffect(() => {
    fetchMessages();
  }, []);

  // Filter messages based on search query
  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) {
      return messages;
    }

    const query = searchQuery.toLowerCase();

    return messages.filter((message) => {
      const nameMatch = message.name?.toLowerCase().includes(query);
      const emailMatch = message.email?.toLowerCase().includes(query);
      const subjectMatch = message.subject?.toLowerCase().includes(query);
      const messageMatch = message.message?.toLowerCase().includes(query);

      return nameMatch || emailMatch || subjectMatch || messageMatch;
    });
  }, [messages, searchQuery]);

  const fetchMessages = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .eq('user_id', user.id) // Only fetch current user's messages
        .order('created_at', { ascending: false});

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchMessages();
      alert.success('Message deleted successfully!');
    } catch (error) {
      console.error('Error deleting message:', error);
      alert.error('Failed to delete message. Please try again.');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      <div className="container mx-auto px-4 max-w-5xl py-8">
        {/* Header with Back Button */}
        <div className="flex items-center gap-3 mb-8">
          <BackButton iconOnly={true} size={32} />
          <h1 className="text-3xl font-bold">Contact Messages</h1>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search messages by name, email, subject, or content..."
            resultCount={filteredMessages.length}
            resultType="messages"
          />
        </div>

        {/* Messages List */}
        {filteredMessages.length > 0 ? (
          <div className="space-y-4">
          {filteredMessages.map((message) => (
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
        ) : searchQuery.trim() ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2">No messages found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                No messages match "{searchQuery}". Try different keywords or clear search.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="btn-primary"
              >
                Clear Search
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No messages yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;

