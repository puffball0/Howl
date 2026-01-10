import { useState } from "react";
import { motion } from "framer-motion";
import {
    User, Mail, MapPin, Camera, Briefcase,
    Globe, Heart, Shield, Save, ChevronRight
} from "lucide-react";
import { cn } from "../lib/utils";

export default function Profile() {
    const [isSaving, setIsSaving] = useState(false);
    const [userData, setUserData] = useState({
        name: "Warda",
        email: "warda@howl.com",
        location: "Berlin, Germany",
        bio: "Adventure seeker and mountain lover. Looking for my next pack to explore the Swiss Alps!",
        personality: "Adventurous",
        interests: ["Hiking", "Photography", "Camping", "Sustainable Travel"]
    });

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1500);
    };

    return (
        <div className="min-h-full w-full bg-howl-navy p-6 lg:p-10 pb-32">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden border-4 border-howl-orange/20 shadow-2xl">
                                <img src="https://i.pravatar.cc/150?u=me" className="w-full h-full object-cover" alt="Profile" />
                            </div>
                            <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-howl-orange text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                <Camera size={20} />
                            </button>
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-heading font-black text-white uppercase tracking-tight mb-1">{userData.name}</h1>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                <MapPin size={12} className="text-howl-orange" /> {userData.location}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        className="h-14 px-8 bg-howl-orange hover:bg-howl-burnt text-white rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-howl-orange/20"
                    >
                        {isSaving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>

                {/* Form Sections */}
                <div className="space-y-8">

                    {/* Basic Settings */}
                    <div className="bg-[#02121f] border border-white/5 rounded-3xl p-8 space-y-6">
                        <h3 className="text-sm font-black text-howl-orange uppercase tracking-widest mb-4 flex items-center gap-2">
                            <User size={16} /> Basic Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Display Name</label>
                                <input
                                    type="text"
                                    value={userData.name}
                                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                    className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-xl font-bold focus:outline-none focus:border-howl-orange transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Email Address</label>
                                <input
                                    type="email"
                                    value={userData.email}
                                    readOnly
                                    className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-xl font-bold text-gray-600 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-howl-orange w-5 h-5" />
                                <input
                                    type="text"
                                    value={userData.location}
                                    onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                                    className="w-full h-14 pl-12 pr-6 bg-white/5 border border-white/10 rounded-xl font-bold focus:outline-none focus:border-howl-orange transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Bio</label>
                            <textarea
                                rows={4}
                                value={userData.bio}
                                onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                                className="w-full p-6 bg-white/5 border border-white/10 rounded-xl font-bold focus:outline-none focus:border-howl-orange transition-all resize-none"
                            />
                        </div>
                    </div>

                    {/* Travel Personality */}
                    <div className="bg-[#02121f] border border-white/5 rounded-3xl p-8">
                        <h3 className="text-sm font-black text-howl-orange uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Heart size={16} /> Travel Personality
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {["Chill", "Adventurous", "Spontaneous", "Planned"].map(p => (
                                <button
                                    key={p}
                                    onClick={() => setUserData({ ...userData, personality: p })}
                                    className={cn(
                                        "h-16 rounded-2xl border-2 font-black uppercase tracking-tighter text-xs transition-all",
                                        userData.personality === p
                                            ? "bg-howl-orange border-howl-orange text-white shadow-lg"
                                            : "bg-white/5 border-transparent text-gray-500 hover:bg-white/10"
                                    )}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Interests */}
                    <div className="bg-[#02121f] border border-white/5 rounded-3xl p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-black text-howl-orange uppercase tracking-widest flex items-center gap-2">
                                <Globe size={16} /> Interests
                            </h3>
                            <button className="text-xs font-bold text-gray-500 hover:text-white transition-colors">Add More +</button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {userData.interests.map(interest => (
                                <div key={interest} className="px-4 py-2 bg-white/5 border border-white/5 rounded-lg text-xs font-bold text-gray-400 flex items-center gap-2 group">
                                    {interest}
                                    <button className="hover:text-howl-orange">
                                        <Save size={12} className="opacity-0 group-hover:opacity-100 transition-opacity rotate-45" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* SPACER */}
            <div className="h-20" />
        </div>
    );
}
