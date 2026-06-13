import { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import AuthContext from '../context/AuthContext';
import { Send, MessageSquare } from 'lucide-react';

const Messages = () => {
  const { user } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Add a generic company list for passengers to start conversations
  const [allCompanies, setAllCompanies] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data } = await axios.get('/messages/contacts/list');
        setContacts(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchContacts();

    if (user.type === 'Passenger') {
      const fetchCompanies = async () => {
        try {
          const { data } = await axios.get('/users/companies');
          setAllCompanies(data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchCompanies();
    }
  }, [user.type]);

  useEffect(() => {
    if (activeContact) {
      const fetchMessages = async () => {
        try {
          const { data } = await axios.get(`/messages/${activeContact._id}`);
          setMessages(data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchMessages();

      // Basic polling for new messages could go here
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [activeContact]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeContact) return;

    try {
      const payload = {
        companyId: user.type === 'Company' ? user._id : activeContact._id,
        passengerId: user.type === 'Passenger' ? user._id : activeContact._id,
        content: newMessage
      };

      const { data } = await axios.post('/messages', payload);
      setMessages([...messages, data]);
      setNewMessage('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem', height: 'calc(100vh - 80px)' }}>
      <div className="glass-panel" style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

        {/* Contacts Sidebar */}
        <div style={{ width: '300px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MessageSquare size={20} /> Messages</h3>
          </div>

          <div style={{ overflowY: 'auto', flex: 1, padding: '1rem' }}>
            {user.type === 'Passenger' && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Start new chat</h4>
                {allCompanies.map(c => (
                  <div
                    key={c._id}
                    onClick={() => setActiveContact(c)}
                    style={{
                      padding: '0.75rem',
                      cursor: 'pointer',
                      borderRadius: '0.5rem',
                      background: activeContact?._id === c._id ? 'var(--primary)' : 'transparent',
                      marginBottom: '0.2rem'
                    }}
                  >
                    {c.name}
                  </div>
                ))}
              </div>
            )}

            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Recent</h4>
            {contacts.length === 0 ? (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No conversations yet.</p>
            ) : (
              contacts.map(c => (
                <div
                  key={c._id}
                  onClick={() => setActiveContact(c)}
                  style={{
                    padding: '0.75rem',
                    cursor: 'pointer',
                    borderRadius: '0.5rem',
                    background: activeContact?._id === c._id ? 'var(--primary)' : 'var(--surface-light)',
                    marginBottom: '0.5rem'
                  }}
                >
                  {c.name}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
          {activeContact ? (
            <>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--surface-light)' }}>
                <h3>{activeContact.name}</h3>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 'auto', marginBottom: 'auto' }}>Say hi to {activeContact.name}!</p>
                ) : (
                  messages.map(msg => {
                    const isMine = msg.senderId === user._id;
                    return (
                      <div key={msg._id} style={{
                        alignSelf: isMine ? 'flex-end' : 'flex-start',
                        background: isMine ? 'var(--primary)' : 'var(--surface-light)',
                        padding: '0.75rem 1rem',
                        borderRadius: '1rem',
                        borderBottomRightRadius: isMine ? '0' : '1rem',
                        borderBottomLeftRadius: isMine ? '1rem' : '0',
                        maxWidth: '70%'
                      }}>
                        {msg.content}
                      </div>
                    )
                  })
                )}
              </div>

              <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
                <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button type="submit" className="btn btn-primary" disabled={!newMessage.trim()}>
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
              Select a contact to start messaging
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Messages;
