import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin, Calendar, Users, Clock, Shield, CheckCircle2,
    ChevronLeft, MessageSquare, Info, AlertCircle, ArrowRight
} from "lucide-react";
import { cn } from "../lib/utils";

// Mock data (in a real app, this would come from an API based on useParams ID)
const tripsData: Record<string, any> = {
    "1": {
        id: "1",
        title: "Tropical Paradise",
        location: "Bali, Indonesia",
        duration: "7 Days",
        dates: "Sept 12 - Sept 19, 2026",
        groupSize: "8 Max",
        image: "/images/trip-beach.png",
        leader: { name: "Sarah J.", avatar: "https://i.pravatar.cc/150?u=sarah" },
        members: [
            { id: 1, name: "Alex", avatar: "https://i.pravatar.cc/150?u=1" },
            { id: 2, name: "Maria", avatar: "https://i.pravatar.cc/150?u=2" },
            { id: 3, name: "Chen", avatar: "https://i.pravatar.cc/150?u=3" },
        ],
        description: "Experience the ultimate tropical getaway in Bali. We'll be exploring hidden beaches, visiting ancient temples, and enjoying world-class surfing. This trip is designed for those who want a mix of relaxation and soft adventure.",
        plan: [
            { day: "1-2", title: "Arrival & Beach Clubbing", detail: "Check-in at Seminyak, sunset drinks at Potato Head." },
            { day: "3-5", title: "Ubud Spiritual Journey", detail: "Temple visits, rice terrace trekking, and yoga sessions." },
            { day: "6-7", title: "Nusa Penida Exploration", detail: "Speedboat to Nusa Penida for the iconic Kelingking Beach view." },
        ],
        restrictions: {
            ageLimit: "21-35",
            gender: "All Genders",
            vibe: "Nomadic / Chill",
            joinType: "request" // 'instant' or 'request'
        }
    },
    // Fallback for others
    "all": {
        title: "Alpine Summit",
        location: "Swiss Alps",
        duration: "5 Days",
        dates: "Oct 5 - Oct 10, 2026",
        groupSize: "6 Max",
        image: "/images/trip-mountain.png",
        leader: { name: "Mark Wilson", avatar: "https://i.pravatar.cc/150?u=mark" },
        members: [],
        description: "A challenging but rewarding trek through the heart of the Swiss Alps. Expect stunning vistas and cozy mountain huts.",
        restrictions: {
            ageLimit: "18+",
            gender: "All Genders",
            vibe: "Active / Intense",
            joinType: "instant"
        }
    }
};

export default function TripDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState<any>(null);
    const [joinState, setJoinState] = useState<"idle" | "joining" | "joined" | "requested">("idle");
    const [showRestrictionWarning, setShowRestrictionWarning] = useState(false);

    useEffect(() => {
        // Mock fetching data
        const data = tripsData[id as string] || tripsData["all"];
        setTrip(data);
    }, [id]);

    if (!trip) return <div className="p-20 text-white font-black">LOADING...</div>;

    const handleJoin = () => {
        if (trip.restrictions.joinType === "request") {
            setJoinState("requested");
        } else {
            setJoinState("joining");
            setTimeout(() => setJoinState("joined"), 1500);
        }
    };

    return (
        <div className="min-h-full w-full bg-howl-navy text-white flex flex-col">
            {/* HERO SECTION */}
            <div className="relative w-full h-[40vh] lg:h-[45vh] shrink-0 overflow-hidden">
                <img src={trip.image} className="absolute inset-0 w-full h-full object-cover" alt={trip.title} />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-howl-navy" />

                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-howl-orange transition-colors z-30"
                >
                    <ChevronLeft size={24} />
                </button>

                <div className="absolute bottom-8 left-8 right-8 z-20">
                    <div className="flex items-center gap-2 text-howl-orange text-sm font-black uppercase tracking-widest mb-2 drop-shadow-md">
                        <MapPin size={16} />
                        {trip.location}
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-heading font-black text-white dropshadow-2xl leading-tight">
                        {trip.title.toUpperCase()}
                    </h1>
                </div>
            </div>

            {/* CONTENT GRID */}
            <div className="max-w-7xl mx-auto w-full px-6 lg:px-10 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* LEFT COL: MAIN INFO */}
                <div className="lg:col-span-2 space-y-12">
                    {/* STATS STRIP */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: Clock, label: "DURATION", value: trip.duration },
                            { icon: Users, label: "GROUP SIZE", value: trip.groupSize },
                            { icon: Calendar, label: "DATES", value: trip.dates },
                            { icon: Shield, label: "JOIN METHOD", value: trip.restrictions.joinType.toUpperCase() },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                                <stat.icon className="w-5 h-5 text-howl-orange mb-2" />
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{stat.label}</p>
                                <p className="font-bold text-sm">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* DESCRIPTION */}
                    <section>
                        <h2 className="text-xl font-heading font-black mb-4 flex items-center gap-2">
                            <Info size={20} className="text-howl-orange" />
                            THE ADVENTURE
                        </h2>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            {trip.description}
                        </p>
                    </section>

                    {/* THE PLAN (Tenure) */}
                    {trip.plan && (
                        <section>
                            <h2 className="text-xl font-heading font-black mb-6">THE PLAN</h2>
                            <div className="space-y-6">
                                {trip.plan.map((item: any, i: number) => (
                                    <div key={i} className="flex gap-6 relative">
                                        {i !== trip.plan.length - 1 && (
                                            <div className="absolute left-6 top-10 bottom-0 w-px bg-white/10" />
                                        )}
                                        <div className="w-12 h-12 shrink-0 bg-howl-orange rounded-2xl flex items-center justify-center font-black text-sm z-10">
                                            {item.day}
                                        </div>
                                        <div className="pt-1">
                                            <h3 className="font-black text-lg text-white mb-1 uppercase tracking-tight">{item.title}</h3>
                                            <p className="text-gray-500 text-sm">{item.detail}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* MEMBERS */}
                    <section>
                        <h2 className="text-xl font-heading font-black mb-6 flex items-center justify-between">
                            <span>THE PACK</span>
                            <span className="text-sm text-howl-orange">{trip.members.length + 1} Members</span>
                        </h2>
                        <div className="flex flex-wrap gap-4">
                            {/* Leader */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="relative">
                                    <img src={trip.leader.avatar} className="w-16 h-16 rounded-3xl object-cover border-2 border-howl-orange" alt="Leader" />
                                    <div className="absolute -bottom-1 -right-1 bg-howl-orange text-black p-1 rounded-lg">
                                        <Shield size={12} strokeWidth={3} />
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-howl-orange">Leader</span>
                            </div>
                            {/* Other Members */}
                            {trip.members.map((m: any) => (
                                <div key={m.id} className="flex flex-col items-center gap-2 opacity-60">
                                    <img src={m.avatar} className="w-16 h-16 rounded-3xl object-cover" alt={m.name} />
                                    <span className="text-xs font-bold">{m.name}</span>
                                </div>
                            ))}
                            {/* Slots Left */}
                            <div className="w-16 h-16 border-2 border-dashed border-white/10 rounded-3xl flex items-center justify-center text-white/20">
                                <Users size={20} />
                            </div>
                        </div>
                    </section>
                </div>

                {/* RIGHT COL: SIDEBAR ACTIONS & RESTRICTIONS */}
                <div className="space-y-6">
                    <div className="bg-[#02121f] border border-white/5 rounded-3xl p-8 sticky top-6">
                        <h3 className="text-xl font-heading font-black mb-6 uppercase">Restrictions</h3>
                        <div className="space-y-4 mb-10">
                            {[
                                { icon: Users, label: "AGE RANGE", value: trip.restrictions.ageLimit },
                                { icon: Shield, label: "GENDER", value: trip.restrictions.gender },
                                { icon: Info, label: "VIBE", value: trip.restrictions.vibe },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between py-3 border-b border-white/5">
                                    <div className="flex items-center gap-3 text-gray-500">
                                        <item.icon size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                                    </div>
                                    <span className="text-xs font-black">{item.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA BUTTON */}
                        <AnimatePresence mode="wait">
                            {joinState === "idle" ? (
                                <motion.button
                                    key="idle"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={handleJoin}
                                    className="w-full bg-howl-orange hover:bg-howl-burnt text-white h-16 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-howl-orange/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                                >
                                    {trip.restrictions.joinType === "request" ? "Request to Join" : "Join Trip Now"}
                                    <ArrowRight size={18} />
                                </motion.button>
                            ) : joinState === "joining" ? (
                                <motion.div
                                    key="joining"
                                    className="w-full h-16 bg-white/5 rounded-2xl flex items-center justify-center gap-3"
                                >
                                    <div className="w-5 h-5 border-2 border-howl-orange border-t-transparent rounded-full animate-spin" />
                                    <span className="font-black text-sm uppercase tracking-widest">Processing...</span>
                                </motion.div>
                            ) : joinState === "joined" ? (
                                <motion.div
                                    key="joined"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="space-y-4"
                                >
                                    <div className="w-full h-16 bg-green-500/10 border border-green-500/20 text-green-500 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest">
                                        <CheckCircle2 size={20} />
                                        Joined Successfully
                                    </div>
                                    <Link
                                        to={`/group/${trip.id}`}
                                        className="w-full bg-white hover:bg-gray-200 text-black h-16 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                                    >
                                        <MessageSquare size={18} />
                                        Open Pack Chat
                                    </Link>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="requested"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-full p-6 bg-howl-orange/10 border border-howl-orange/20 rounded-2xl text-center"
                                >
                                    <AlertCircle className="w-10 h-10 text-howl-orange mx-auto mb-4" />
                                    <h4 className="font-black uppercase tracking-tight mb-2">Request Sent!</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed font-bold">
                                        The pack leader will review your profile. You'll be notified once accepted.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <p className="text-[10px] text-gray-600 font-bold text-center mt-6 uppercase tracking-wider">
                            {trip.restrictions.joinType === "request"
                                ? "This pack requires leader approval"
                                : "Instant join available for this adventure"}
                        </p>
                    </div>

                    {/* AD REPLACEMENT / TIP */}
                    <div className="bg-gradient-to-br from-howl-navy to-[#051a2b] p-6 rounded-3xl border border-white/5 flex gap-4 items-start">
                        <div className="w-10 h-10 shrink-0 bg-white/5 rounded-xl flex items-center justify-center text-howl-orange">
                            <Shield size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black mb-1 uppercase tracking-tight">Howl Verified</h4>
                            <p className="text-xs text-gray-500 font-medium">All members in this pack have verified identities for your safety.</p>
                        </div>
                    </div>
                </div>

            </div>

            {/* FOOTER SPACER */}
            <div className="h-20" />
        </div>
    );
}
