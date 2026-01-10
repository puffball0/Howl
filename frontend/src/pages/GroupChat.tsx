import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Send, ChevronLeft, MoreVertical, Paperclip,
    Smile, MapPin, Users, Heart
} from "lucide-react";
import { cn } from "../lib/utils";

// Mock Messages
const initialMessages: Record<string, any[]> = {
    "1": [
        { id: 1, sender: "Sarah J.", avatar: "https://i.pravatar.cc/150?u=sarah", text: "Hey pack! Can't wait for Bali! 🌴", time: "09:00 AM", isMe: false },
        { id: 2, sender: "Alex", avatar: "https://i.pravatar.cc/150?u=1", text: "Me too! Has everyone checked their visa requirements?", time: "09:05 AM", isMe: false },
        { id: 3, sender: "Me", avatar: "https://i.pravatar.cc/150?u=me", text: "Just did mine! All set.", time: "10:12 AM", isMe: true },
        { id: 4, sender: "Maria", avatar: "https://i.pravatar.cc/150?u=2", text: "See you guys at the airport! ✈️", time: "10:15 AM", isMe: false },
    ],
    "default": [
        { id: 1, sender: "Sarah J.", text: "Ready for the big adventure?", time: "Yesterday", isMe: false },
        { id: 2, sender: "Me", text: "Absolutely!", time: "Today", isMe: true },
    ]
};

export default function GroupChat() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<any[]>(initialMessages[id as string] || initialMessages["default"]);
    const [inputText, setInputText] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputText.trim()) return;
        const newMessage = {
            id: Date.now(),
            sender: "Me",
            avatar: "https://i.pravatar.cc/150?u=me",
            text: inputText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true
        };
        setMessages([...messages, newMessage]);
        setInputText("");
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
                            <span className="flex items-center gap-1"><Users size={12} /> 8 Members</span>
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
                        Group created on Sept 01, 2026
                    </div>
                </div>

                {messages.map((msg, i) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, x: msg.isMe ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                            "flex gap-4 max-w-[85%] md:max-w-[70%]",
                            msg.isMe ? "ml-auto flex-row-reverse" : ""
                        )}
                    >
                        <img
                            src={msg.avatar || `https://i.pravatar.cc/150?u=${msg.sender}`}
                            className="w-10 h-10 rounded-2xl shrink-0 object-cover mt-1"
                            alt={msg.sender}
                        />
                        <div className={cn("space-y-1", msg.isMe ? "items-end" : "items-start")}>
                            <div className="flex items-center gap-2 px-1">
                                {!msg.isMe && <span className="text-xs font-black text-howl-orange uppercase tracking-tighter">{msg.sender}</span>}
                                <span className="text-[10px] font-bold text-gray-600 uppercase">{msg.time}</span>
                            </div>
                            <div className={cn(
                                "p-4 rounded-3xl text-sm font-medium leading-relaxed drop-shadow-xl",
                                msg.isMe
                                    ? "bg-howl-orange text-white rounded-tr-none"
                                    : "bg-white/5 border border-white/5 text-gray-300 rounded-tl-none"
                            )}>
                                {msg.text}
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
