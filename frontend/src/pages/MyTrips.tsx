import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar, MapPin, ChevronRight, Clock,
    CheckCircle2, AlertCircle, BookOpen, Star, MoreVertical, Loader2, Search
} from "lucide-react";
import { cn } from "../lib/utils";
import { userApi, type TripJournal } from "../services/api";

interface Trip {
    id: string;
    title: string;
    location: string;
    date?: string;
    duration?: string;
    image_url?: string;
    status?: string;
    rating?: number;
    member_count?: number;
    max_members?: number;
    tags?: string[];
}

// Fallback mock data for personal trips
const mockTripJournal = {
    upcoming: [
        {
            id: "1",
            title: "Tropical Paradise",
            location: "Bali, Indonesia",
            duration: "Sept 12 - 19, 2026",
            image_url: "/images/trip-beach.png",
            status: "Confirmed",
        },
        {
            id: "2",
            title: "Alpine Summit",
            location: "Swiss Alps",
            duration: "Oct 5 - 10, 2026",
            image_url: "/images/trip-mountain.png",
            status: "Confirmed",
        }
    ],
    pending: [
        {
            id: "4",
            title: "Mystic Forest",
            location: "Oregon, USA",
            duration: "Nov 3 - 6, 2026",
            image_url: "/images/hero-sunset.png",
            status: "Waiting Approval",
        }
    ],
    past: [
        {
            id: "10",
            title: "Desert Canyon",
            location: "Utah, USA",
            duration: "May 20 - 24, 2026",
            image_url: "/images/trip-desert.png",
            status: "Completed",
            rating: 5
        }
    ]
};

export default function MyTrips() {
    const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "pending">("upcoming");
    const [tripJournal, setTripJournal] = useState<{ upcoming: Trip[]; pending: Trip[]; past: Trip[] }>({ upcoming: [], pending: [], past: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const loadTrips = async () => {
            try {
                const data = await userApi.getMyTrips();
                setTripJournal({
                    upcoming: data.upcoming || [],
                    pending: data.pending || [],
                    past: data.past || []
                });
            } catch (err) {
                console.log('Using mock data for my trips');
            } finally {
                setIsLoading(false);
            }
        };
        loadTrips();
    }, []);

    const tabs = [
        { id: "upcoming", label: "Upcoming", count: tripJournal.upcoming.length },
        { id: "pending", label: "Pending", count: tripJournal.pending.length },
        { id: "past", label: "Past", count: tripJournal.past.length },
    ];

    if (isLoading) {
        return (
            <div className="min-h-full w-full bg-howl-navy flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 text-howl-orange animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-full w-full bg-howl-navy p-6 lg:p-10 pb-32">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 text-howl-orange mb-2">
                        <BookOpen size={24} strokeWidth={3} />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Travel Journal</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-heading font-black tracking-tighter text-white">MY ADVENTURES</h1>

                    {/* Search Bar */}
                    <div className="mt-6 relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search your trips..."
                            className="w-full h-12 pl-10 pr-4 bg-white/5 border border-white/10 rounded-xl text-sm font-bold focus:outline-none focus:border-howl-orange transition-all"
                            onChange={(e) => {
                                const query = e.target.value.toLowerCase();
                                const filtered = {
                                    upcoming: tripJournal.upcoming.filter(t => t.title.toLowerCase().includes(query) || t.location.toLowerCase().includes(query)),
                                    pending: tripJournal.pending.filter(t => t.title.toLowerCase().includes(query) || t.location.toLowerCase().includes(query)),
                                    past: tripJournal.past.filter(t => t.title.toLowerCase().includes(query) || t.location.toLowerCase().includes(query))
                                };
                                // Note: This filter is visual only, we aren't updating the main state to avoid losing data
                                // A better approach for client-side search is separate "display" state vs "data" state
                                // But for now, let's just use a simple state for the query and filter in render
                                setSearchTerm(query);
                            }}
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 md:gap-4 mb-10 overflow-x-auto hide-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "px-6 py-3 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-2",
                                activeTab === tab.id
                                    ? "bg-howl-orange border-howl-orange text-white shadow-lg shadow-howl-orange/20"
                                    : "bg-white/5 border-transparent text-gray-500 hover:bg-white/10"
                            )}
                        >
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                </div>

                {/* Content List */}
                <div className="space-y-6 relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            {(tripJournal[activeTab]
                                .filter(t =>
                                    !searchTerm ||
                                    t.title.toLowerCase().includes(searchTerm) ||
                                    t.location.toLowerCase().includes(searchTerm)
                                )
                            ).length > 0 ? (
                                tripJournal[activeTab]
                                    .filter(t =>
                                        !searchTerm ||
                                        t.title.toLowerCase().includes(searchTerm) ||
                                        t.location.toLowerCase().includes(searchTerm)
                                    )
                                    .map((trip, index) => (
                                        <motion.div
                                            key={trip.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="group bg-[#02121f] border border-white/5 rounded-3xl overflow-hidden hover:border-howl-orange/30 transition-all shadow-xl"
                                        >
                                            <div className="flex flex-col md:flex-row">
                                                {/* Left: Image */}
                                                <div className="w-full md:w-56 h-48 md:h-auto shrink-0 relative overflow-hidden">
                                                    <img src={trip.image_url || "/images/trip-beach.png"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={trip.title} />
                                                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent md:hidden" />
                                                </div>

                                                {/* Middle: Info */}
                                                <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-2 text-howl-orange text-[10px] font-black uppercase tracking-widest">
                                                                <MapPin size={14} />
                                                                {trip.location}
                                                            </div>
                                                            <button className="text-gray-700 hover:text-white transition-colors">
                                                                <MoreVertical size={18} />
                                                            </button>
                                                        </div>
                                                        <h3 className="text-2xl font-heading font-black text-white uppercase tracking-tight mb-2">
                                                            {trip.title}
                                                        </h3>
                                                        <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                                                            <span className="flex items-center gap-1.5"><Clock size={14} /> {trip.date}</span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-8 flex items-center justify-between">
                                                        <div className={cn(
                                                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border",
                                                            activeTab === "upcoming" ? "bg-green-500/10 border-green-500/20 text-green-500" :
                                                                activeTab === "pending" ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500" :
                                                                    "bg-white/5 border-white/5 text-gray-500"
                                                        )}>
                                                            {activeTab === "upcoming" && <CheckCircle2 size={12} />}
                                                            {activeTab === "pending" && <AlertCircle size={12} />}
                                                            {trip.status}
                                                        </div>

                                                        {activeTab === "past" && trip.rating && (
                                                            <div className="flex gap-1">
                                                                {[...Array(trip.rating)].map((_, i) => (
                                                                    <Star key={i} size={14} className="fill-howl-orange text-howl-orange" />
                                                                ))}
                                                            </div>
                                                        )}

                                                        <Link to={`/trip/${trip.id}`}>
                                                            <button className="text-white bg-white/5 hover:bg-howl-orange px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                                                Details
                                                            </button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                            ) : (
                                <div className="py-20 text-center">
                                    <MapPin size={48} className="text-gray-800 mx-auto mb-4 opacity-20" />
                                    <p className="text-gray-700 font-black uppercase tracking-widest text-sm">No adventures here yet.</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* SPACER */}
            <div className="h-20" />
        </div>
    );
}
