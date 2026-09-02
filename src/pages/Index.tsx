import React, { useState } from 'react';
import { Send, Heart, Users, MessageCircle } from 'lucide-react';

interface Message {
  id: number;
  sender: string;
  avatar: string;
  text: string;
  timestamp: string;
  color: string;
}

interface FamilyMember {
  id: number;
  name: string;
  avatar: string;
  initials: string;
  color: string;
  online: boolean;
}

export default function FamilyChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'Bubu',
      avatar: '👨‍🦱',
      text: 'Hey family! How is everyone doing today? 😊',
      timestamp: '10:30 AM',
      color: 'bg-blue-100 border-blue-300',
    },
    {
      id: 2,
      sender: 'Emi',
      avatar: '👩‍🦰',
      text: 'Great! Just finished breakfast. Made some pancakes!',
      timestamp: '10:35 AM',
      color: 'bg-purple-100 border-purple-300',
    },
    {
      id: 3,
      sender: 'Rosa',
      avatar: '👵',
      text: 'Wonderful! The weather is lovely today. Perfect for a walk.',
      timestamp: '10:40 AM',
      color: 'bg-pink-100 border-pink-300',
    },
    {
      id: 4,
      sender: 'Bubu',
      avatar: '👨‍🦱',
      text: 'Rosa, would you like company for that walk?',
      timestamp: '10:42 AM',
      color: 'bg-blue-100 border-blue-300',
    },
    {
      id: 5,
      sender: 'Rosa',
      avatar: '👵',
      text: 'Oh yes, that would be lovely! Meet you in 15 minutes?',
      timestamp: '10:43 AM',
      color: 'bg-pink-100 border-pink-300',
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [activeUser] = useState('Bubu');

  const familyMembers: FamilyMember[] = [
    { id: 1, name: 'Bubu', avatar: '👨‍🦱', initials: 'B', color: 'bg-blue-500', online: true },
    { id: 2, name: 'Emi', avatar: '👩‍🦰', initials: 'E', color: 'bg-purple-500', online: true },
    { id: 3, name: 'Rosa', avatar: '👵', initials: 'R', color: 'bg-pink-500', online: true },
  ];

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: activeUser,
        avatar: familyMembers.find(m => m.name === activeUser)?.avatar || '👤',
        text: inputValue,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        color: activeUser === 'Bubu' ? 'bg-blue-100 border-blue-300' : activeUser === 'Emi' ? 'bg-purple-100 border-purple-300' : 'bg-pink-100 border-pink-300',
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8" />
            <h1 className="text-3xl font-bold">BUBU EMI ROSA</h1>
          </div>
          <p className="text-primary-foreground/90">Family Chat & Connection Hub</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Family Members */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-secondary" />
                <h2 className="text-xl font-bold text-foreground">Family</h2>
              </div>
              
              <div className="space-y-3">
                {familyMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div className="relative">
                      <div className="text-2xl">{member.avatar}</div>
                      {member.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{member.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-border space-y-3">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{messages.length}</p>
                  <p className="text-sm text-muted-foreground">Messages Today</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-secondary">{familyMembers.length}</p>
                  <p className="text-sm text-muted-foreground">Family Members</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-[600px]">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">Family Chat</h3>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.sender === activeUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.sender !== activeUser && (
                      <div className="text-3xl flex-shrink-0">{message.avatar}</div>
                    )}
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl border-2 ${message.color}`}
                    >
                      {message.sender !== activeUser && (
                        <p className="text-xs font-bold text-foreground/70 mb-1">
                          {message.sender}
                        </p>
                      )}
                      <p className="text-foreground break-words">{message.text}</p>
                      <p className="text-xs text-foreground/50 mt-1">{message.timestamp}</p>
                    </div>
                    {message.sender === activeUser && (
                      <div className="text-3xl flex-shrink-0">{message.avatar}</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="border-t border-border bg-muted/30 p-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 rounded-full border-2 border-border focus:border-primary focus:outline-none bg-white text-foreground placeholder-muted-foreground transition-colors"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-3 transition-all hover:shadow-lg active:scale-95"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Features Preview */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 shadow text-center">
                <div className="text-3xl mb-2">📸</div>
                <p className="text-sm font-semibold text-foreground">Photo Sharing</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow text-center">
                <div className="text-3xl mb-2">📅</div>
                <p className="text-sm font-semibold text-foreground">Events & Calendar</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow text-center">
                <div className="text-3xl mb-2">❤️</div>
                <p className="text-sm font-semibold text-foreground">Memories</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
