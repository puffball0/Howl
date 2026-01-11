import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, SlidersHorizontal, Plus, Loader2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
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
        tags: ["Mountain", "Hiking"],
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
        tags: ["Forest", "Nature"],
        member_count: 2,
        max_members: 5
    },
    {
        id: "5",
        title: "Northern Lights",
        location: "Reykjavik, Iceland",
        duration: "6 Days",
        image_url: "/images/trip-mountain.png",
        tags: ["Cold", "Nature"],
        member_count: 4,
        max_members: 8
    },
    {
        id: "6",
        title: "Safari Adventure",
        location: "Kenya, Africa",
        duration: "10 Days",
        image_url: "/images/trip-desert.png",
        tags: ["Wildlife", "Adventure"],
        member_count: 6,
        max_members: 10
    },
    {
        id: "7",
        title: "Urban Explorer",
        location: "Tokyo, Japan",
        duration: "5 Days",
        image_url: "/images/hero-sunset.png",
        tags: ["City", "Food"],
        member_count: 3,
        max_members: 6
    },
    {
        id: "8",
        title: "Island Hopping",
        location: "Phuket, Thailand",
        duration: "8 Days",
        image_url: "/images/trip-beach.png",
        tags: ["Beach", "Party"],
        member_count: 7,
        max_members: 10
    },
];

const filters = ["All", "Mountain", "Beach", "City", "Forest"];

export default function Explore() {
    const navigate = useNavigate();
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [trips, setTrips] = useState<TripListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTrips = async () => {
            try {
                const data = await tripsApi.list({ search: searchQuery || undefined });
                setTrips(data);
            } catch (err) {
                console.log('Using mock data for trips');
                setTrips(mockTrips as TripListItem[]);
            } finally {
                setIsLoading(false);
            }
        };
        loadTrips();
    }, [searchQuery]);

    // Filter trips based on selection
    const allTrips = trips;

    if (isLoading) {
        return (
            <div className="min-h-full w-full bg-howl-navy flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 text-howl-orange animate-spin" />
            </div>
        );
    }
    const filteredTrips = selectedFilter === "All"
        ? allTrips
        : allTrips.filter(trip => trip.tags?.some(tag => tag.toLowerCase().includes(selectedFilter.toLowerCase())));

    return (
        <div className="min-h-full w-full bg-howl-navy text-white p-6 lg:p-10 pb-32">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-heading font-black tracking-tighter mb-2">EXPLORE TRIPS</h1>
                    <p className="text-gray-400 font-medium">Find your next adventure squad.</p>
                </div>

                {/* Search & Filter Controls */}
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search destination..."
                            className="w-full h-12 pl-10 pr-4 bg-white/5 border border-white/10 rounded-xl text-sm font-bold focus:outline-none focus:border-howl-orange focus:ring-1 focus:ring-howl-orange transition-all"
                        />
                    </div>
                    <button className="h-12 w-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:bg-howl-orange hover:border-howl-orange transition-colors">
                        <SlidersHorizontal size={20} />
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-3 mb-8 overflow-x-auto hide-scrollbar pb-2">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all whitespace-nowrap ${selectedFilter === filter
                            ? "bg-howl-orange border-howl-orange text-white"
                            : "bg-transparent border-white/10 text-gray-400 hover:border-white/30"
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {filteredTrips.map((trip, index) => (
                    <motion.div
                        key={trip.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Link
                            to={`/trip/${trip.id}`}
                            className="bg-[#02121f] rounded-3xl overflow-hidden border border-white/10 flex flex-col group cursor-pointer hover:border-howl-orange/50 transition-colors relative h-full"
                        >
                            <div className="h-64 relative overflow-hidden">
                                <img
                                    src={trip.image_url || "/images/trip-beach.png"}
                                    alt={trip.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white uppercase">
                                    {trip.duration}
                                </div>
                            </div>
                            <div className="flex-1 p-6 flex flex-col gap-4">
                                <div>
                                    <div className="flex items-center gap-2 text-howl-orange text-xs font-bold uppercase tracking-widest mb-2">
                                        <MapPin size={14} />
                                        {trip.location}
                                    </div>
                                    <h3 className="text-2xl font-heading font-black text-white leading-tight">
                                        {trip.title}
                                    </h3>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {trip.tags.map(tag => (
                                        <span key={tag} className="text-[10px] font-bold bg-white/5 text-gray-400 px-2 py-1 rounded-md border border-white/5">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="w-full py-3 mt-auto bg-white/5 group-hover:bg-howl-orange text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2">
                                    Join Trip
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}

                {/* Create New Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => navigate('/create-trip')}
                    className="min-h-[400px] border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center p-6 cursor-pointer hover:border-howl-orange hover:bg-howl-orange/5 transition-all group"
                >
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-howl-orange">
                        <Plus size={32} />
                    </div>
                    <h3 className="text-xl font-heading font-bold mb-2">Create Your Own</h3>
                    <p className="text-sm text-gray-500 max-w-[200px]">Start a new adventure and invite others to join.</p>
                </motion.div>
            </div>
        </div >
    );
}
