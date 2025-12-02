import React, { useState, useEffect, useContext, useRef } from 'react';
import { AppContext } from '../App';
import axios from 'axios';
import { toast } from 'sonner';
import io from 'socket.io-client';
import { Send, User, Search } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function ChatComponent({ currentUser }) {
  const { token, API } = useContext(AppContext);
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize Socket.IO
    const newSocket = io(BACKEND_URL, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      newSocket.emit('authenticate', { user_id: currentUser.id });
    });

    newSocket.on('new_message', (message) => {
      if (message.sender_id === selectedUser?.id || message.receiver_id === currentUser.id) {
        setMessages(prev => [...prev, message]);
      }
    });

    newSocket.on('message_sent', (message) => {
      setMessages(prev => [...prev, message]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser.id]);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${API}/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(response.data);
      
      // Auto-select first conversation if available
      if (response.data.length > 0 && !selectedUser) {
        setSelectedUser(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  };

  const fetchMessages = async () => {
    if (!selectedUser) return;
    
    try {
      const response = await axios.get(
        `${API}/messages?other_user_id=${selectedUser.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(response.data);
    } catch (error) {
      toast.error('Failed to fetch messages');
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !socket) return;

    socket.emit('send_message', {
      sender_id: currentUser.id,
      receiver_id: selectedUser.id,
      content: newMessage
    });

    setNewMessage('');
  };

  return (
    <div className="chat-container" style={{ display: 'flex', height: 'calc(100vh - 200px)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', background: 'white' }}>
      {/* Conversations List */}
      <div className="conversations" style={{ width: '320px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '1.125rem' }}>Messages</h3>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Search conversations..."
              className="form-input"
              style={{ paddingLeft: '2.5rem', fontSize: '0.875rem' }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <User size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p>No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className="conversation-item"
                style={{
                  padding: '1rem',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  background: selectedUser?.id === conv.id ? '#eff6ff' : 'transparent',
                  transition: 'background 0.2s'
                }}
                onClick={() => setSelectedUser(conv)}
                data-testid={`conversation-${conv.id}`}
              >
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div
                    className="user-avatar"
                    style={{ width: '48px', height: '48px', fontSize: '1.125rem', flexShrink: 0 }}
                  >
                    {conv.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.125rem' }}>
                      {conv.full_name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {conv.email}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="user-avatar" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
                {selectedUser.full_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{selectedUser.full_name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', background: '#f8fafc' }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', paddingTop: '2rem' }}>
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isOwn = message.sender_id === currentUser.id;
                  return (
                    <div
                      key={message.id}
                      style={{
                        display: 'flex',
                        justifyContent: isOwn ? 'flex-end' : 'flex-start',
                        marginBottom: '1rem'
                      }}
                      data-testid={`message-${message.id}`}
                    >
                      <div
                        style={{
                          maxWidth: '70%',
                          padding: '0.75rem 1rem',
                          borderRadius: '12px',
                          background: isOwn ? 'linear-gradient(135deg, #1e40af, #1e3a8a)' : 'white',
                          color: isOwn ? 'white' : 'var(--text-primary)',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                          wordWrap: 'break-word'
                        }}
                      >
                        <div style={{ marginBottom: '0.25rem' }}>{message.content}</div>
                        <div
                          style={{
                            fontSize: '0.625rem',
                            opacity: 0.7,
                            textAlign: 'right'
                          }}
                        >
                          {new Date(message.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.75rem' }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="form-input"
                style={{ flex: 1 }}
                data-testid="message-input"
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!newMessage.trim()}
                data-testid="send-button"
              >
                <Send size={18} />
              </button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ textAlign: 'center' }}>
              <User size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatComponent;
