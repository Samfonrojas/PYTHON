
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getChatbotResponse } from '../services/geminiService';
import { XMarkIcon, PaperAirplaneIcon, SparklesIcon } from './Icons';
import { useTranslation } from '../i18n';

interface ChatbotProps {
    isOpen: boolean;
    onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t, language } = useTranslation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
        const botResponse = await getChatbotResponse(messages, currentInput, language);
        const modelMessage: ChatMessage = { role: 'model', text: botResponse };
        setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
        const errorMessage: ChatMessage = { role: 'model', text: "Sorry, I encountered an error." };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };

  return (
    <div className={`fixed top-0 right-0 h-full bg-bunker-900 shadow-2xl z-40 flex flex-col border-l border-bunker-700 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} w-full max-w-md`}>
        <div className="flex items-center justify-between p-4 bg-bunker-800/50 text-white font-bold border-b border-bunker-700">
            <div className="flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-cyan-400"/>
                <h3 className="text-lg">{t('chatbot.title')}</h3>
            </div>
            <button onClick={onClose} className="text-bunker-400 hover:text-white">
                <XMarkIcon className="w-6 h-6" />
            </button>
        </div>
        <div className="flex-grow p-4 overflow-y-auto">
        {messages.length === 0 ? (
            <div className="text-bunker-400 text-center mt-4">{t('chatbot.greeting')}</div>
        ) : (
            messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
                <div className={`rounded-lg px-4 py-2 max-w-xs text-left ${msg.role === 'user' ? 'bg-cyan-700 text-white' : 'bg-bunker-800 text-bunker-200'}`}>
                    {msg.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                </div>
            </div>
            ))
        )}
        {isLoading && (
            <div className="flex justify-start mb-3">
                <div className="rounded-lg px-4 py-2 bg-bunker-800 text-bunker-200">
                    <span className="animate-pulse">...</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-bunker-700 flex items-center gap-2">
        <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('chatbot.placeholder')}
            className="flex-grow bg-bunker-800 border border-bunker-700 rounded-full px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            disabled={isLoading}
        />
        <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-full p-2.5 disabled:bg-cyan-800 disabled:cursor-not-allowed transition-colors"
        >
            <PaperAirplaneIcon className="w-5 h-5"/>
        </button>
        </div>
    </div>
  );
};

export default Chatbot;
