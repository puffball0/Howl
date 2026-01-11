import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Users, MapPin, ChevronRight, Search, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { groupsApi, type Group } from "../services/api";

// Fallback mock data
const mockGroups = [
    {
        id: "1",
        title: "Tropical Paradise",
        location: "Bali, Indonesia",
        members: "8 Members",
        lastMessage: "Alex: See you guys at the airport!",
        time: "2m ago",
        unread: 3,
        image: "/images/trip-beach.png"
    },
    {
        id: "2",
        title: "Alpine Summit",
        location: "Swiss Alps",
        members: "6 Members",
        lastMessage: "Sarah: Don't forget your crampons!",
        time: "1h ago",
        unread: 0,
        image: "/images/trip-mountain.png"
    },
    {
        id: "3",
        title: "Safari Adventure",
        location: "Kenya, Africa",
        members: "10 Members",
        lastMessage: "Mark: Just sent the final itinerary.",
        time: "5h ago",
        unread: 0,
        image: "/images/trip-desert.png"
    }
];

export default function Groups() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadGroups = async () => {
            try {
                const data = await groupsApi.getMyGroups();
                setGroups(data);
            } catch (err) {
                console.log('Using mock data for groups');
                setGroups(mockGroups as Group[]);
            } finally {
                setIsLoading(false);
            }
        };
        loadGroups();
    }, []);

    // Show loader while loading
    if (isLoading) {
        return (
            <div className="min-h-full w-full bg-howl-navy flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-howl-orange animate-spin" />
            </div>
        );
    }

    const joinedGroups = groups;

    return (
        <div className="min-h-full w-full bg-howl-navy p-6 lg:p-10 pb-32">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-heading font-black tracking-tighter mb-2">YOUR PACKS</h1>
                        <p className="text-gray-400 font-medium">Coordinate with your travel squads.</p>
                    </div>

                    <div className="relative md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Find a pack..."
                            className="w-full h-12 pl-10 pr-4 bg-white/5 border border-white/10 rounded-xl text-sm font-bold focus:outline-none focus:border-howl-orange transition-all"
                        />
                    </div>
                </div>

                {/* Groups List */}
                <div className="space-y-4">
                    {joinedGroups.length > 0 ? (
                        joinedGroups.map((group, index) => (
                            <motion.div
                                key={group.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    to={`/group/${group.id}`}
                                    className="block bg-[#02121f] border border-white/5 p-4 md:p-6 rounded-3xl hover:border-howl-orange/30 transition-all group overflow-hidden relative"
                                >
                                    <div className="flex items-center gap-6">
                                        {/* Trip Image */}
                                        <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-2xl overflow-hidden relative">
                                            <img src={group.image || "/images/trip-beach.png"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={group.title} />
                                            {group.unread > 0 && (
                                                <div className="absolute top-0 right-0 w-4 h-4 bg-howl-orange border-2 border-[#02121f] rounded-full" />
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="text-lg md:text-xl font-heading font-black uppercase tracking-tight truncate text-white">
                                                    {group.title}
                                                </h3>
                                                <span className="text-[10px] font-black text-gray-500">{group.time}</span>
                                            </div>

                                            <div className="flex items-center gap-4 text-xs font-bold text-gray-500 mb-2">
                                                <span className="flex items-center gap-1"><MapPin size={12} className="text-howl-orange" /> {group.location}</span>
                                                <span className="flex items-center gap-1"><Users size={12} /> {group.members}</span>
                                            </div>

                                            <p className={cn(
                                                "text-sm truncate",
                                                group.unread > 0 ? "text-white font-bold" : "text-gray-500"
                                            )}>
                                                {group.lastMessage}
                                            </p>
                                        </div>

                                        <div className="shrink-0 hidden md:block">
                                            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-gray-500 group-hover:bg-howl-orange group-hover:text-white transition-all">
                                                <ChevronRight size={20} />
                                            </div>
                                        </div>
                                    </div>

                                    {group.unread > 0 && (
                                        <div className="absolute top-4 right-4 bg-howl-orange text-black text-[10px] font-black px-2 py-0.5 rounded-full md:hidden">
                                            {group.unread} NEW
                                        </div>
                                    )}
                                </Link>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-500 font-bold uppercase tracking-widest text-xs">
                            You haven't joined any packs yet.
                        </div>
                    )}
                </div>

                {/* Empty State / Discovery Call */}
                <div className="mt-16 text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
                    <MessageSquare size={48} className="text-gray-700 mx-auto mb-4" strokeWidth={1} />
                    <h3 className="text-xl font-heading font-black text-white/40 uppercase mb-2">Join more adventures</h3>
                    <p className="text-gray-600 font-medium mb-8 max-w-xs mx-auto text-sm">Every trip you join will appear here as a separate pack where you can coordinate together.</p>
                    <Link to="/explore" className="text-howl-orange text-sm font-black uppercase tracking-widest hover:text-white transition-colors">
                        Explore Trips <ChevronRight size={14} className="inline ml-1" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
