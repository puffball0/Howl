import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, ChevronRight, Loader2 } from "lucide-react";
import { tripsApi, type TripListItem } from "../services/api";

// Fallback mock data
const mockTrips = [
    {
        id: "1",
        title: "Tropical Paradise",
        location: "Bali, Indonesia",
        duration: "7 Days",
        image_url: "/images/trip-beach.png",
        tags: ["Beach", "Relax"],
        member_count: 5,
        max_members: 8
    },
    {
        id: "2",
        title: "Alpine Summit",
        location: "Swiss Alps",
        duration: "5 Days",
        image_url: "/images/trip-mountain.png",
        tags: ["Hiking", "Cold"],
        member_count: 3,
        max_members: 6
    },
    {
        id: "3",
        title: "Desert Canyon",
        location: "Utah, USA",
        duration: "4 Days",
        image_url: "/images/trip-desert.png",
        tags: ["Adventure", "Heat"],
        member_count: 4,
        max_members: 8
    },
    {
        id: "4",
        title: "Mystic Forest",
        location: "Oregon, USA",
        duration: "3 Days",
        image_url: "/images/hero-sunset.png",
        tags: ["Nature", "Camping"],
        member_count: 2,
        max_members: 5
    },
];

export default function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [trips, setTrips] = useState<TripListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTrips = async () => {
            try {
                const data = await tripsApi.list({ limit: 10 });
                setTrips(data);
            } catch (err) {
                console.log('Using mock data for trips');
                setTrips(mockTrips as TripListItem[]);
            } finally {
                setIsLoading(false);
            }
        };
        loadTrips();
    }, []);

    const suggestedTrips = trips;

    if (isLoading) {
        return (
            <div className="min-h-full w-full bg-howl-navy flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 text-howl-orange animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-full w-full bg-howl-navy flex flex-col">

            {/* HER HERO SECTION */}
            <div className="relative w-full h-[45vh] lg:h-[50vh] shrink-0 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('/images/hero-sunset.png')`
                    }}
                >
                    {/* Less transparency as requested - lighter gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-howl-navy" />
                </div>

                <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 pt-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl lg:text-6xl font-heading font-black text-white dropshadow-lg mb-6"
                    >
                        WHERE TO NEXT?
                    </motion.h1>

                    {/* Search Bar - Floating */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-full max-w-2xl relative"
                    >
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-gray-800" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && searchQuery.trim()) {
                                    window.location.href = `/explore?search=${encodeURIComponent(searchQuery)}`;
                                }
                            }}
                            placeholder="Find your adventure..."
                            className="w-full h-14 pl-12 pr-4 rounded-full bg-white/90 backdrop-blur-md text-howl-navy placeholder-gray-600 font-bold focus:outline-none focus:ring-4 focus:ring-howl-orange/50 shadow-2xl transition-all"
                        />
                    </motion.div>
                </div>
            </div>

            {/* HORIZONTAL SCROLL SECTION */}
            <div className="px-6 -mt-16 relative z-20 space-y-2 pb-10">
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-2xl font-heading font-black text-white tracking-wider">
                        SUGGESTED FOR YOU
                    </h2>
                    <Link to="/explore" className="text-howl-orange text-sm font-bold uppercase tracking-widest hover:text-white transition-colors">
                        View All
                    </Link>
                </div>

                {/* Scroll Container */}
                <div className="overflow-x-auto pb-8 hide-scrollbar">
                    <div className="flex gap-6 w-max px-2">
                        {suggestedTrips.map((trip, index) => (
                            <motion.div
                                key={trip.id}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    to={`/trip/${trip.id}`}
                                    className="w-[340px] h-[450px] bg-[#02121f] rounded-3xl overflow-hidden border border-white/10 flex flex-col group cursor-pointer hover:border-howl-orange/50 transition-colors relative"
                                >
                                    <div className="h-3/5 relative overflow-hidden">
                                        <img
                                            src={trip.image_url || "/images/trip-beach.png"}
                                            alt={trip.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white uppercase">
                                            {trip.duration}
                                        </div>
                                    </div>
                                    <div className="flex-1 p-6 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 text-howl-orange text-xs font-bold uppercase tracking-widest mb-2">
                                                <MapPin size={14} />
                                                {trip.location}
                                            </div>
                                            <h3 className="text-2xl font-heading font-black text-white leading-tight mb-2">
                                                {trip.title}
                                            </h3>
                                            <div className="flex gap-2">
                                                {trip.tags.map(tag => (
                                                    <span key={tag} className="text-[10px] font-bold bg-white/5 text-gray-400 px-2 py-1 rounded-md border border-white/5">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className={`w-full py-3 mt-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2 ${trip.is_member
                                            ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                            : "bg-white/5 group-hover:bg-howl-orange text-white"
                                            }`}>
                                            {trip.is_member ? "Already Joined" : "Join Trip"}
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}

                    </div>
                </div>
                {/* CREATE YOUR OWN TRIP SECTION */}
                <div className="px-6 mb-20 lg:mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="max-w-5xl mx-auto mt-12 bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-howl-orange/30 transition-colors group"
                    >
                        <div className="text-center md:text-left max-w-xl">
                            <h2 className="text-2xl md:text-4xl font-heading font-black text-white mb-3 uppercase tracking-tight">
                                Call Your Pack
                            </h2>
                            <p className="text-gray-400 font-medium text-lg leading-relaxed">
                                Can't find the right trip? Build your own itinerary and find the perfect squad to travel with.
                            </p>
                        </div>

                        <Link to="/create-trip" className="shrink-0">
                            <button className="px-8 py-4 bg-howl-orange hover:bg-howl-burnt text-white rounded-xl font-black uppercase tracking-widest transition-all hover:scale-105 shadow-lg shadow-howl-orange/10 flex items-center gap-2">
                                Start Planning <ChevronRight size={18} />
                            </button>
                        </Link>
                    </motion.div>
                </div>

                {/* SPACER FOR MOBILE NAV */}
                <div className="h-10 lg:h-0" />

                {/* FOOTER */}
                <footer className="mt-auto py-8 text-center text-white/30 text-xs font-bold uppercase tracking-widest border-t border-white/5 bg-[#010b13]">
                    <p>&copy; 2026 Howl. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}
