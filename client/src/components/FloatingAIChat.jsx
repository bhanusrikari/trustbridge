import { useState, useRef, useEffect } from 'react';
import api from '../services/api';

const FloatingAIChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi! I am your TrustBridge AI assistant. How can I help you find the right local services today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Mock AI response for demo purposes
            // In a real app, this would call /api/ai/chat
            setTimeout(() => {
                const aiResponse = {
                    role: 'assistant',
                    content: `That's a great question! Based on your interest in "${input}", I recommend checking out our verified plumbers or home cleaning experts in the marketplace. Is there anything specific you are looking for in Hyderabad?`
                };
                setMessages(prev => [...prev, aiResponse]);
                setIsLoading(false);
            }, 1000);
        } catch (error) {
            console.error("AI Chat Error", error);
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-50">
            {/* Chat Bubble Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full shadow-[0_10px_40px_rgba(79,70,229,0.4)] flex items-center justify-center transition-all duration-500 transform ${isOpen ? 'rotate-90 bg-slate-900' : 'bg-indigo-600 hover:scale-110 hover:-translate-y-1'}`}
            >
                {isOpen ? (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                ) : (
                    <div className="relative">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-300 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-400 border-2 border-white"></span>
                        </span>
                    </div>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-80 sm:w-96 h-[500px] bg-white rounded-[40px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 text-white">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <div>
                                <h4 className="font-black text-lg leading-none">TrustBridge AI</h4>
                                <p className="text-[10px] font-bold text-indigo-200 mt-1 uppercase tracking-widest flex items-center">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                                    Always Online
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium ${msg.role === 'user'
                                        ? 'bg-slate-900 text-white rounded-tr-none shadow-lg'
                                        : 'bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-sm'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-slate-100 shadow-sm">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex items-center space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 bg-slate-100 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white p-3 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
                        >
                            <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default FloatingAIChat;
