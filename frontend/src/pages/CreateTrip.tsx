import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, MapPin, Calendar, Users, AlertCircle,
    ArrowRight, Plus, ChevronLeft, Check, X, Shield, Info
} from "lucide-react";
import { cn } from "../lib/utils";

// Mock similar trips
const similarTrips = [
    {
        id: "1",
        title: "Tropical Paradise",
        location: "Bali, Indonesia",
        date: "Sept 12, 2026",
        groupSize: "3/8",
        restrictions: "21-35, Nomadic",
        image: "/images/trip-beach.png"
    },
    {
        id: "2",
        title: "Bali Surf Squad",
        location: "Bali, Indonesia",
        date: "Sept 15, 2026",
        groupSize: "5/6",
        restrictions: "18-25, Party",
        image: "/images/hero-sunset.png"
    }
];

export default function CreateTrip() {
    const navigate = useNavigate();
    const [step, setStep] = useState<"search" | "results" | "form">("search");
    const [searchData, setSearchData] = useState({ destination: "", date: "" });

    // Step 1: Search / Initial Intent
    if (step === "search") {
        return (
            <div className="min-h-full w-full bg-howl-navy flex flex-col items-center justify-center p-6 text-white text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-xl w-full"
                >
                    <div className="mb-8 flex justify-center">
                        <div className="w-20 h-20 bg-howl-orange rounded-3xl flex items-center justify-center shadow-2xl shadow-howl-orange/20">
                            <Plus size={40} strokeWidth={3} />
                        </div>
                    </div>
                    <h1 className="text-4xl font-heading font-black mb-4 tracking-tight">WHERE'S YOUR NEXT ADVENTURE?</h1>
                    <p className="text-gray-400 font-medium mb-12">Before we start your pack, let's see if there's a group already heading your way.</p>

                    <div className="space-y-4">
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Enter destination (e.g. Bali)"
                                value={searchData.destination}
                                onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                                className="w-full h-16 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl font-bold focus:outline-none focus:border-howl-orange transition-all placeholder:text-gray-600"
                            />
                        </div>
                        <button
                            onClick={() => setStep("results")}
                            disabled={!searchData.destination}
                            className="w-full h-16 bg-howl-orange hover:bg-howl-burnt disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                        >
                            Check for Packs <ArrowRight size={20} />
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Step 2: Show Similar Trips
    if (step === "results") {
        return (
            <div className="min-h-full w-full bg-howl-navy p-6 lg:p-12 text-white">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => setStep("search")}
                        className="flex items-center gap-2 text-howl-orange font-bold mb-8 hover:text-white transition-colors"
                    >
                        <ChevronLeft size={20} /> BACK
                    </button>

                    <div className="flex items-start gap-6 mb-12 p-8 bg-howl-orange/10 border border-howl-orange/20 rounded-3xl">
                        <AlertCircle className="w-12 h-12 text-howl-orange shrink-0" />
                        <div>
                            <h2 className="text-2xl font-heading font-black mb-2">WE FOUND SIMILAR TRIPS!</h2>
                            <p className="text-gray-400 font-medium">Joining an existing pack is the fastest way to travel together. Check these out before creating your own.</p>
                        </div>
                    </div>

                    <div className="space-y-4 mb-12">
                        {similarTrips.map((trip) => (
                            <div key={trip.id} className="bg-[#02121f] border border-white/5 rounded-3xl overflow-hidden p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-howl-orange/30 transition-colors">
                                <img src={trip.image} className="w-full md:w-32 h-32 md:h-32 object-cover rounded-2xl" alt={trip.title} />
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-xl font-heading font-black uppercase tracking-tight mb-1">{trip.title}</h3>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-bold text-gray-500">
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {trip.date}</span>
                                        <span className="flex items-center gap-1"><Users size={14} /> {trip.groupSize} Members</span>
                                        <span className="flex items-center gap-1"><Shield size={14} /> {trip.restrictions}</span>
                                    </div>
                                </div>
                                <Link
                                    to={`/trip/${trip.id}`}
                                    className="px-6 py-4 bg-white/5 hover:bg-howl-orange text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all"
                                >
                                    View Pack
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className="pt-12 border-t border-white/5 text-center">
                        <p className="text-gray-500 font-bold mb-6 uppercase tracking-widest text-xs">Didn't find what you need?</p>
                        <button
                            onClick={() => setStep("form")}
                            className="bg-white hover:bg-gray-200 text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-2xl hover:scale-105"
                        >
                            Create Your Own Pack Anyway
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Step 3: Creation Form
    return (
        <div className="min-h-full w-full bg-howl-navy p-6 lg:p-12 text-white">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => setStep("results")}
                    className="flex items-center gap-2 text-howl-orange font-bold mb-8 hover:text-white transition-colors"
                >
                    <ChevronLeft size={20} /> BACK TO RESULTS
                </button>

                <h1 className="text-4xl font-heading font-black mb-2 tracking-tight">CREATE YOUR PACK</h1>
                <p className="text-gray-400 font-medium mb-12">Define your adventure and let the squad find you.</p>

                <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
                    {/* Basic Info */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-black text-howl-orange uppercase tracking-widest">General Info</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Trip Title</label>
                                <input type="text" placeholder="Adventuring into the unknown..." className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-xl font-bold focus:outline-none focus:border-howl-orange transition-all" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Duration</label>
                                    <input type="text" placeholder="e.g. 7 Days" className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-xl font-bold focus:outline-none focus:border-howl-orange transition-all" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Max Members</label>
                                    <input type="number" placeholder="8" className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-xl font-bold focus:outline-none focus:border-howl-orange transition-all" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Restrictions */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-black text-howl-orange uppercase tracking-widest">Requirements & Vibe</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Age Range</label>
                                    <select className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-xl font-bold focus:outline-none focus:border-howl-orange transition-all appearance-none cursor-pointer">
                                        <option>All Ages</option>
                                        <option>18-25</option>
                                        <option>21-35</option>
                                        <option>30+</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Gender</label>
                                    <select className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-xl font-bold focus:outline-none focus:border-howl-orange transition-all appearance-none cursor-pointer">
                                        <option>All Genders</option>
                                        <option>Women Only</option>
                                        <option>Men Only</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Pack Vibe</label>
                                <div className="flex flex-wrap gap-2">
                                    {["CHILL", "INTENSE", "NOMADIC", "PARTY", "CULTURAL"].map(vibe => (
                                        <button key={vibe} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black hover:border-howl-orange hover:text-howl-orange transition-all">
                                            {vibe}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Join Logic */}
                    <div className="p-6 bg-[#02121f] rounded-2xl border border-white/5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex gap-4">
                                <Shield className="text-howl-orange mt-1" size={20} />
                                <div>
                                    <h4 className="font-black uppercase tracking-tighter">Request only</h4>
                                    <p className="text-xs text-gray-500 font-bold">You must approve each member manually.</p>
                                </div>
                            </div>
                            <div className="w-12 h-6 bg-howl-orange rounded-full relative p-1 cursor-pointer">
                                <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
                            </div>
                        </div>
                    </div>

                    <button
                        className="w-full h-16 bg-gradient-to-r from-howl-orange to-howl-burnt text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-howl-orange/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        onClick={() => navigate("/home")}
                    >
                        Summon Your Pack
                    </button>
                </form>
            </div>

            <div className="h-20" />
        </div>
    );
}
