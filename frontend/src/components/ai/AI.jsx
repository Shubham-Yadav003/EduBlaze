import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { server } from '../../main';
import toast from 'react-hot-toast';
import './ai.css';

function AI({ user }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          type: 'ai',
          content: `Hello ${user?.name || 'there'}! 👋 I'm your AI assistant for Ehub. I can help you with:

• Course-related questions and content
• Platform navigation and features
• Study tips and learning strategies
• Technical support

How can I help you today?`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    }
  }, [isOpen, user]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/ai/ask`,
        {
          message: inputMessage,
          courseContext: 'General platform query'
        },
        {
          headers: {
            token: localStorage.getItem('token'),
          },
        }
      );

      const aiMessage = {
        type: 'ai',
        content: data.response,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Error:', error);
      toast.error(error.response?.data?.message || 'Failed to get AI response');
      
      const errorMessage = {
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <>
      {/* AI Chat Button */}
      <button 
        className="ai-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Ask AI Assistant"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
        </svg>
        Ask AI
      </button>

      {/* AI Chat Modal */}
      {isOpen && (
        <div className="ai-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="ai-modal" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="ai-header">
              <div className="ai-header-info">
                <div className="ai-avatar">🤖</div>
                <div>
                  <h3>Ehub AI Assistant</h3>
                  <p>Your learning companion</p>
                </div>
              </div>
              <div className="ai-header-actions">
                <button onClick={clearChat} className="clear-btn" title="Clear chat">
                  🗑️
                </button>
                <button onClick={() => setIsOpen(false)} className="close-btn" title="Close">
                  ✕
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="ai-messages">
              {messages.map((message, index) => (
                <div key={index} className={`ai-message ${message.type}`}>
                  <div className="message-content">
                    {message.content}
                  </div>
                  <div className="message-timestamp">
                    {message.timestamp}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="ai-message ai">
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="ai-input-container">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about courses, learning, or platform features..."
                disabled={isLoading}
                rows="1"
                className="ai-input"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="ai-send-btn"
              >
                {isLoading ? '⏳' : '➤'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AI; 