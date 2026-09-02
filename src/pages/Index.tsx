import React, { useState, useEffect } from 'react';
import { Send, Heart, Users, MessageCircle, Plus, Calendar, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

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

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://urkilgwokwywrtadgeto.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVya2lsZ3dva3d5d3J0YWRnZXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNTgyMDgsImV4cCI6MjEwMzkzNDIwOH0.GRhFtVYzmR6Ah2oG6wDAqdAL4URXoUil25k7Pk17gaI';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function FamilyChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [activeUser, setActiveUser] = useState('Bubu');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'photos' | 'events' | 'memories'>('chat');

  useEffect(() => {
    loadFamilyMembers();
    loadMessages();
  }, []);

  const loadFamilyMembers = async () => {
    const { data, error } = await supabase
      .from('family_users')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading family members:', error);
      return;
    }

    const members: FamilyMember[] = data.map((user: any) => ({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      initials: user.name.charAt(0),
      color: user.color,
      online: user.online,
    }));

    setFamilyMembers(members);
    setLoading(false);
  };

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:family_users(name, avatar, color)')
      .order('created_at', { ascending: true })
      .limit(50);

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    const formattedMessages: Message[] = data.map((msg: any) => ({
      id: msg.id,
      sender: msg.sender.name,
      avatar: msg.sender.avatar,
      text: msg.text,
      timestamp: new Date(msg.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      color: msg.sender.name === 'Bubu' ? 'bg-blue-100 border-blue-300' : msg.sender.name === 'Emi' ? 'bg-purple-100 border-purple-300' : 'bg-pink-100 border-pink-300',
    }));

    setMessages(formattedMessages);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const sender = familyMembers.find(m => m.name === activeUser);
      if (!sender) return;

      const { error } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: sender.id,
            text: inputValue,
          },
        ]);

      if (error) {
        console.error('Error sending message:', error);
        return;
      }

      setInputValue('');
      await loadMessages();
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
                <div className="flex gap-2 mb-3">
                  {familyMembers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => setActiveUser(member.name)}
                      className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                        activeUser === member.name
                          ? 'bg-primary text-primary-foreground ring-2 ring-primary/50'
                          : 'bg-muted text-foreground hover:bg-muted/80'
                      }`}
                    >
                      {member.avatar} {member.name}
                    </button>
                  ))}
                </div>
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

            {/* Tab Navigation */}
            <div className="mt-6 flex gap-2 bg-white rounded-xl shadow-lg p-2">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  activeTab === 'chat'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                <MessageCircle className="w-4 h-4 inline mr-2" />
                Chat
              </button>
              <button
                onClick={() => setActiveTab('photos')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  activeTab === 'photos'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                <ImageIcon className="w-4 h-4 inline mr-2" />
                Photos
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  activeTab === 'events'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                Events
              </button>
              <button
                onClick={() => setActiveTab('memories')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  activeTab === 'memories'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                <Heart className="w-4 h-4 inline mr-2" />
                Memories
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'chat' && (
              <div className="mt-4 bg-white rounded-xl shadow-lg p-6 text-center text-muted-foreground">
                Chat feature is ready above!
              </div>
            )}
            {activeTab === 'photos' && (
              <div className="mt-4 bg-white rounded-xl shadow-lg p-12 text-center">
                <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-semibold text-foreground mb-2">Photo Gallery</p>
                <p className="text-muted-foreground mb-4">Share family photos and memories</p>
                <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-all">
                  <Plus className="w-4 h-4 inline mr-2" />
                  Upload Photo
                </button>
              </div>
            )}
            {activeTab === 'events' && (
              <div className="mt-4 bg-white rounded-xl shadow-lg p-12 text-center">
                <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-semibold text-foreground mb-2">Family Calendar</p>
                <p className="text-muted-foreground mb-4">Plan and track family events</p>
                <button className="bg-secondary text-secondary-foreground px-6 py-2 rounded-lg hover:bg-secondary/90 transition-all">
                  <Plus className="w-4 h-4 inline mr-2" />
                  Create Event
                </button>
              </div>
            )}
            {activeTab === 'memories' && (
              <div className="mt-4 bg-white rounded-xl shadow-lg p-12 text-center">
                <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-semibold text-foreground mb-2">Cherished Memories</p>
                <p className="text-muted-foreground mb-4">Save and celebrate special moments</p>
                <button className="bg-accent text-accent-foreground px-6 py-2 rounded-lg hover:bg-accent/90 transition-all">
                  <Plus className="w-4 h-4 inline mr-2" />
                  Add Memory
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
