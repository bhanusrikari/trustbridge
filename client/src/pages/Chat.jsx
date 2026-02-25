import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const startChatId = searchParams.get('userId') || searchParams.get('providerId'); // ID to start chat with
    const startChatRole = searchParams.get('role'); // Role of the person to chat with

    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const messagesEndRef = useRef(null);
    const pollingInterval = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Fetch Conversations
    const fetchConversations = async () => {
        try {
            const res = await api.get('/chat/conversations');
            setConversations(res.data);

            // If starting a new chat from profile, checks if it exists or creates a temp placeholder
            if (startChatId && startChatRole && !activeChat) {
                const existing = res.data.find(c => c.other_id === parseInt(startChatId) && c.other_role === startChatRole);
                if (existing) {
                    setActiveChat(existing);
                } else {
                    // Create temp chat object
                    setActiveChat({
                        other_id: parseInt(startChatId),
                        other_role: startChatRole,
                        name: 'New Chat', // Ideally fetch name, but for now generic
                        isNew: true
                    });
                }
            }
        } catch (error) {
            console.error("Error loading conversations", error);
        } finally {
            setLoading(false);
        }
    };

    // Load Messages for Active Chat
    const fetchMessages = async () => {
        if (!activeChat) return;
        try {
            const res = await api.get('/chat/history', {
                params: {
                    other_id: activeChat.other_id,
                    other_role: activeChat.other_role
                }
            });
            setMessages(res.data);
        } catch (error) {
            console.error("Error loading messages", error);
        }
    };

    useEffect(() => {
        fetchConversations();
        // Poll for new conversations list (optional, maybe just messages)
    }, [startChatId, startChatRole]);

    useEffect(() => {
        if (activeChat) {
            fetchMessages();
            scrollToBottom();
            // Poll for messages in active chat
            pollingInterval.current = setInterval(fetchMessages, 3000); // 3s polling
        } else {
            setMessages([]);
        }

        return () => {
            if (pollingInterval.current) clearInterval(pollingInterval.current);
        };
    }, [activeChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!newMessage.trim() || !activeChat) return;

        const tempMsg = {
            id: Date.now(),
            sender_id: user.uid || user.spid || user.lrid, // Identify me
            content: newMessage,
            createdAt: new Date().toISOString(),
            isTemp: true
        };

        // Optimistic UI
        setMessages([...messages, tempMsg]);
        setNewMessage('');

        try {
            await api.post('/chat/send', {
                receiver_id: activeChat.other_id,
                receiver_role: activeChat.other_role,
                content: tempMsg.content
            });
            fetchMessages(); // Refresh to get real ID and status
            fetchConversations(); // Update list order
        } catch (error) {
            console.error("Failed to send", error);
            // Optionally set an error state here to show a small toast or message near the input
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)] bg-gray-50">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">Messages</h2>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 h-[85%] flex overflow-hidden">
                {/* Sidebar */}
                <div className={`${activeChat ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 border-r border-gray-100 bg-gray-50/50 flex-col`}>
                    <div className="p-4 border-b border-gray-100 bg-white">
                        <input type="text" placeholder="Search chats..." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                    </div>
                    <div className="overflow-y-auto flex-grow p-2 space-y-1">
                        {conversations.length === 0 && !loading && <div className="p-4 text-center text-gray-500">No conversations yet.</div>}
                        {conversations.map(chat => (
                            <div
                                key={`${chat.other_role}_${chat.other_id}`}
                                onClick={() => setActiveChat(chat)}
                                className={`p-3 rounded-xl cursor-pointer hover:shadow-md transition ${activeChat?.other_id === chat.other_id && activeChat?.other_role === chat.other_role ? 'bg-white shadow-sm border border-blue-100' : 'hover:bg-gray-100'}`}
                            >
                                <div className="flex items-center">
                                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                                        {chat.name.charAt(0)}
                                    </div>
                                    <div className="ml-3 flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{chat.name}</p>
                                            <p className="text-xs text-gray-400">{new Date(chat.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-gray-500 truncate">{chat.last_message}</p>
                                            {chat.unread_count > 0 && (
                                                <span className="ml-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[1.2rem] text-center">
                                                    {chat.unread_count}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`${!activeChat ? 'hidden md:flex' : 'flex'} w-full md:w-2/3 flex-col bg-white`}>
                    {activeChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm z-10">
                                <div className="flex items-center">
                                    <button onClick={() => setActiveChat(null)} className="md:hidden mr-3 text-gray-500">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                        {activeChat.name.charAt(0)}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-bold text-gray-900">{activeChat.name}</p>
                                        <p className="text-xs text-gray-500 capitalize">{activeChat.other_role}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-gray-50">
                                {messages.map((msg, index) => {
                                    // Determine if I sent it. 
                                    // Backend stores sender_id. User context has {id (or uid/spid), role}
                                    const isMe = (msg.sender_id === (user.uid || user.spid || user.lrid || user.id)) &&
                                        (msg.sender_role === user.role);

                                    return (
                                        <div key={msg.id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}`}>
                                                <p className="text-sm">{msg.content}</p>
                                                <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white border-t border-gray-100">
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        className="flex-grow border-gray-200 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    />
                                    <button
                                        onClick={handleSend}
                                        className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition shadow-md flex-shrink-0"
                                    >
                                        <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-grow flex items-center justify-center text-gray-400 flex-col">
                            <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            <p className="text-lg">Select a conversation to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
