import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import {
    Send, ChevronLeft, MoreVertical, Paperclip,
    Smile, MapPin, Users, Heart, Loader2
} from "lucide-react";
import { cn } from "../lib/utils";
import { messagesApi, groupsApi, createChatWebSocket, type Message } from "../services/api";

// Fallback mock Messages
const mockMessages = [
    { id: "1", sender_name: "Sarah J.", sender_avatar: "https://i.pravatar.cc/150?u=sarah", content: "Hey pack! Can't wait for Bali! 🌴", created_at: "2026-01-10T09:00:00Z", is_me: false },
    { id: "2", sender_name: "Alex", sender_avatar: "https://i.pravatar.cc/150?u=1", content: "Me too! Has everyone checked their visa requirements?", created_at: "2026-01-10T09:05:00Z", is_me: false },
    { id: "3", sender_name: "You", sender_avatar: "https://i.pravatar.cc/150?u=me", content: "Just did mine! All set.", created_at: "2026-01-10T10:12:00Z", is_me: true },
    { id: "4", sender_name: "Maria", sender_avatar: "https://i.pravatar.cc/150?u=2", content: "See you guys at the airport! ✈️", created_at: "2026-01-10T10:15:00Z", is_me: false },
];

export default function GroupChat() {
    const { user } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [groupInfo, setGroupInfo] = useState({
        title: "Pack Chat",
        member_count: 0,
        created_at: new Date().toISOString()
    });
    const scrollRef = useRef<HTMLDivElement>(null);
    const wsRef = useRef<WebSocket | null>(null);

    // Load message history and group info
    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                const [messagesData, groupData] = await Promise.all([
                    messagesApi.getHistory(id),
                    groupsApi.getGroupDetails(id)
                ]);
                setMessages(messagesData.messages);
                setGroupInfo({
                    title: groupData.title,
                    member_count: groupData.member_count,
                    created_at: groupData.created_at
                });
            } catch (err) {
                console.log('Using mock data for chat');
                setMessages(mockMessages);
                setGroupInfo({
                    title: "Tropical Paradise",
                    member_count: 8,
                    created_at: new Date().toISOString()
                });
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [id]);

    // Setup WebSocket connection
    useEffect(() => {
        if (!id || !user) return;

        try {
            const ws = createChatWebSocket(id);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('WebSocket Connected!');
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'message') {
                    setMessages(prev => {
                        const isMe = data.sender_id === user.id;

                        // If it's my message, check if we have an optimistic one to replace
                        if (isMe) {
                            const optimisticIndex = prev.findIndex(m =>
                                m.is_me &&
                                m.content === data.content &&
                                !m.id.includes('-') // Assuming UUIDs have dashes, timestamps don't
                            );

                            if (optimisticIndex !== -1) {
                                // Replace optimistic message with real one
                                const newMessages = [...prev];
                                newMessages[optimisticIndex] = {
                                    id: data.id,
                                    sender_name: data.sender_name,
                                    sender_avatar: data.sender_avatar,
                                    content: data.content,
                                    created_at: data.created_at,
                                    is_me: true
                                };
                                return newMessages;
                            }
                        }

                        // Otherwise append new message
                        // Check for duplicates just in case (by ID)
                        if (prev.some(m => m.id === data.id)) return prev;

                        return [...prev, {
                            id: data.id,
                            sender_name: data.sender_name,
                            sender_avatar: data.sender_avatar,
                            content: data.content,
                            created_at: data.created_at,
                            is_me: isMe
                        }];
                    });
                }
            };

            ws.onerror = (error) => {
                console.log('WebSocket error:', error);
            };

            ws.onclose = (event) => {
                // Ignore 1000 (Normal) and 1006 (Abnormal) if we instigated the close via cleanup
                // or if the socket is already closed/closing
                const isIntentional = ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING;

                if (event.code !== 1000 && !isIntentional) {
                    // Note: Browsers trigger 1006 if closed during connect.
                    console.log(`WebSocket closed: ${event.code} (${event.reason})`);
                }
            };

            return () => {
                // Mark as intentional close to avoid error logging if possible
                if (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN) {
                    ws.close();
                }
            };
        } catch (err) {
            console.log('WebSocket not available');
        }
    }, [id, user]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = useCallback(async () => {
        if (!inputText.trim() || !id || !user) return;

        const newMessage = {
            id: Date.now().toString(),
            sender_name: user.display_name || "You",
            sender_avatar: user.avatar_url || "https://i.pravatar.cc/150?u=me",
            content: inputText,
            created_at: new Date().toISOString(),
            is_me: true
        };

        // Optimistic update
        setMessages(prev => [...prev, newMessage]);
        setInputText("");

        // Send via WebSocket or API
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: 'message',
                content: inputText
            }));
        } else {
            try {
                await messagesApi.send(id, inputText);
            } catch (err) {
                console.log('Message sent locally only');
            }
        }
    }, [inputText, id]);

    const formatTime = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch {
            return '';
        }
    };

    return (
        <div className="flex flex-col h-full bg-howl-navy text-white overflow-hidden">

            {/* CHAT HEADER */}
            <div className="shrink-0 h-20 px-6 border-b border-white/5 bg-[#02121f]/80 backdrop-blur-md flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-lg font-heading font-black uppercase tracking-tight leading-none mb-1">
                            Tropical Paradise
                        </h2>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Users size={12} /> {groupInfo.member_count} Members</span>
                            <span className="w-1 h-1 bg-gray-700 rounded-full" />
                            <span className="text-howl-orange">Online Now</span>
                        </div>
                    </div>
                </div>
                <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors">
                    <MoreVertical size={20} />
                </button>
            </div>

            {/* MESSAGES AREA */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar"
            >
                <div className="text-center py-10">
                    <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                        Group created on {new Date(groupInfo.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                </div>

                {messages.map((msg, i) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, x: msg.is_me ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                            "flex gap-4 max-w-[85%] md:max-w-[70%]",
                            msg.is_me ? "ml-auto flex-row-reverse" : ""
                        )}
                    >
                        <img
                            src={msg.sender_avatar || `https://i.pravatar.cc/150?u=${msg.sender_name}`}
                            className="w-10 h-10 rounded-2xl shrink-0 object-cover mt-1"
                            alt={msg.sender_name}
                        />
                        <div className={cn("space-y-1", msg.is_me ? "items-end" : "items-start")}>
                            <div className="flex items-center gap-2 px-1">
                                {!msg.is_me && <span className="text-xs font-black text-howl-orange uppercase tracking-tighter">{msg.sender_name}</span>}
                                <span className="text-[10px] font-bold text-gray-600 uppercase">{formatTime(msg.created_at)}</span>
                            </div>
                            <div className={cn(
                                "p-4 rounded-3xl text-sm font-medium leading-relaxed drop-shadow-xl",
                                msg.is_me
                                    ? "bg-howl-orange text-white rounded-tr-none"
                                    : "bg-white/5 border border-white/5 text-gray-300 rounded-tl-none"
                            )}>
                                {msg.content}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* MESSAGE INPUT */}
            <div className="shrink-0 p-6 bg-[#02121f] border-t border-white/10">
                <div className="max-w-4xl mx-auto flex items-end gap-3">
                    <div className="flex-1 relative">
                        <textarea
                            rows={1}
                            placeholder="Type a message..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            className="w-full max-h-32 p-4 pl-14 pr-14 bg-white/5 border border-white/10 rounded-3xl text-sm font-medium focus:outline-none focus:border-howl-orange transition-all resize-none overflow-hidden placeholder:text-gray-600"
                        />
                        <button className="absolute left-4 bottom-4 text-gray-400 hover:text-howl-orange transition-colors">
                            <Smile size={20} />
                        </button>
                        <button className="absolute right-4 bottom-4 text-gray-400 hover:text-howl-orange transition-colors">
                            <Paperclip size={20} />
                        </button>
                    </div>
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputText.trim()}
                        className="w-14 h-14 bg-howl-orange hover:bg-howl-burnt text-white rounded-2xl flex items-center justify-center transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-howl-orange/20"
                    >
                        <Send size={24} />
                    </button>
                </div>
            </div>

            {/* MOBILE SPACER */}
            <div className="h-4 lg:hidden" />
        </div>
    );
}
