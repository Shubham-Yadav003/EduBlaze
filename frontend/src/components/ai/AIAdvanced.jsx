import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { server } from '../../main';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import './ai.css';

function AIAdvanced({ user, courseContext }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [aiContext, setAiContext] = useState(null);
  const messagesEndRef = useRef(null);
  const params = useParams();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get AI context when component mounts or course changes
  useEffect(() => {
    if (isOpen && !aiContext) {
      fetchAIContext();
    }
  }, [isOpen, params.id]);

  const fetchAIContext = async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/ai/context${params.id ? `?courseId=${params.id}` : ''}`,
        {
          headers: {
            token: localStorage.getItem('token'),
          },
        }
      );
      setAiContext(data.context);
    } catch (error) {
      console.error('Error fetching AI context:', error);
    }
  };

  // Initialize with context-aware welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0 && aiContext) {
      let welcomeMessage = `Hello ${user?.name || 'there'}! 👋 I'm your AI assistant for Ehub.`;

      if (aiContext.courseInfo) {
        welcomeMessage += `\n\nI can help you with the course: "${aiContext.courseInfo.title}"`;
        welcomeMessage += `\n• Course content and materials`;
        welcomeMessage += `\n• Assignment help and explanations`;
        welcomeMessage += `\n• Study strategies for this course`;
      } else {
        welcomeMessage += `\n\nI can help you with:`;
        welcomeMessage += `\n• Course-related questions and content`;
        welcomeMessage += `\n• Platform navigation and features`;
        welcomeMessage += `\n• Study tips and learning strategies`;
        welcomeMessage += `\n• Technical support`;
      }

      if (aiContext.userType === 'Admin' || aiContext.userType === 'Super Admin') {
        welcomeMessage += `\n\nAs an ${aiContext.userType}, I can also help with:`;
        welcomeMessage += `\n• Course management and creation`;
        welcomeMessage += `\n• User management`;
        welcomeMessage += `\n• Platform analytics and insights`;
      }

      welcomeMessage += `\n\nHow can I help you today?`;

      setMessages([
        {
          type: 'ai',
          content: welcomeMessage,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    }
  }, [isOpen, user, aiContext]);

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
          courseContext: aiContext?.courseInfo?.title || 'General platform query'
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
    setAiContext(null);
  };

  const getSuggestedQuestions = () => {
    const suggestions = [];
    
    if (aiContext?.courseInfo) {
      suggestions.push(
        "What are the main topics covered in this course?",
        "Can you explain the course structure?",
        "What are the prerequisites for this course?",
        "How can I get the most out of this course?"
      );
    } else {
      suggestions.push(
        "How do I enroll in a course?",
        "What courses are available?",
        "How do I track my progress?",
        "Can you help me with study tips?"
      );
    }

    if (aiContext?.userType === 'Admin' || aiContext?.userType === 'Super Admin') {
      suggestions.push(
        "How do I create a new course?",
        "How can I manage users?",
        "What analytics are available?"
      );
    }

    return suggestions.slice(0, 4); // Return max 4 suggestions
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
                  <h3>EduBlaze AI Assistant</h3>
                  <p>
                    {aiContext?.courseInfo 
                      ? `Course: ${aiContext.courseInfo.title}`
                      : 'Your learning companion'
                    }
                  </p>
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
              
              {/* Suggested Questions */}
              {messages.length === 1 && !isLoading && (
                <div className="suggested-questions">
                  <p>💡 Try asking:</p>
                  {getSuggestedQuestions().map((suggestion, index) => (
                    <button
                      key={index}
                      className="suggestion-btn"
                      onClick={() => setInputMessage(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
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
                placeholder={
                  aiContext?.courseInfo 
                    ? `Ask about "${aiContext.courseInfo.title}" or anything else...`
                    : "Ask me anything about courses, learning, or platform features..."
                }
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

export default AIAdvanced; 