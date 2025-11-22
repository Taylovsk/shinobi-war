import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { generateLoreOrQuest } from '../services/geminiService';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'Saudações, jovem Shinobi. Eu sou o guardião deste pergaminho. O que buscas saber sobre o Multiverso?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setIsLoading(true);

    const response = await generateLoreOrQuest(userMsg);
    
    setMessages(prev => [...prev, { sender: 'ai', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-gray-900 border border-orange-500/50 rounded-lg shadow-[0_0_50px_rgba(234,88,12,0.3)] flex flex-col h-[600px] overflow-hidden">
        
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-orange-900/50 to-gray-900">
            <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                <h3 className="text-xl font-bold text-white anime-font tracking-wider">Oráculo Shinobi</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/40">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div 
                        className={`max-w-[80%] p-3 rounded-lg text-sm leading-relaxed ${
                            msg.sender === 'user' 
                            ? 'bg-orange-600 text-white rounded-br-none' 
                            : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-none'
                        }`}
                    >
                        {msg.text}
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-gray-800 p-3 rounded-lg text-xs text-orange-400 animate-pulse">
                        Convocando chakra...
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-white/10 bg-gray-900 flex gap-2">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Pergunte sobre missões, clãs ou história..."
                className="flex-1 bg-black/50 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
            <button 
                onClick={handleSend}
                disabled={isLoading}
                className="bg-orange-600 hover:bg-orange-500 disabled:bg-gray-700 text-white p-2 rounded transition-colors flex items-center justify-center"
            >
                <Send className="w-5 h-5" />
            </button>
        </div>

      </div>
    </div>
  );
};

export default ChatModal;
