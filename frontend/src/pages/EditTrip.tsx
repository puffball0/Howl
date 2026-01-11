import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    MapPin, Calendar, Users, Shield, Save,
    ChevronLeft, Loader2, AlertCircle
} from "lucide-react";
import { tripsApi, type TripCreate, type TripDetail } from "../services/api";

export default function EditTrip() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<TripCreate>>({
        title: "",
        location: "",
        duration: "",
        dates: "",
        max_members: 8,
        description: "",
        age_limit: "All Ages",
        gender: "All Genders",
        vibe: "CHILL",
        join_type: "instant",
        tags: []
    });

    useEffect(() => {
        const loadTrip = async () => {
            if (!id) return;
            try {
                const trip = await tripsApi.getById(id);
                // Check if user is leader (backend will also enforce, but good for UX)
                if (!trip.is_leader) {
                    navigate(`/trip/${id}`); // Redirect if not leader
                    return;
                }

                setFormData({
                    title: trip.title,
                    location: trip.location,
                    duration: trip.duration,
                    dates: trip.dates || "",
                    max_members: trip.max_members,
                    description: trip.description || "",
                    age_limit: trip.restrictions.ageLimit,
                    gender: trip.restrictions.gender,
                    vibe: trip.restrictions.vibe || "CHILL",
                    join_type: trip.restrictions.joinType,
                    tags: trip.tags
                });
            } catch (err) {
                console.error("Failed to load trip:", err);
                setError("Failed to load trip details.");
            } finally {
                setIsLoading(false);
            }
        };
        loadTrip();
    }, [id, navigate]);

    const handleSave = async () => {
        if (!id) return;
        setIsSaving(true);
        try {
            await tripsApi.update(id, formData);
            navigate(`/trip/${id}`);
        } catch (err) {
            console.error("Failed to update trip:", err);
            setError("Failed to save changes. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-full w-full bg-howl-navy flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-howl-orange animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-full w-full bg-howl-navy p-6 lg:p-12 text-white">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => navigate(`/trip/${id}`)}
                    className="flex items-center gap-2 text-howl-orange font-bold mb-8 hover:text-white transition-colors"
                >
                    <ChevronLeft size={20} /> CANCEL EDITING
                </button>

                <h1 className="text-4xl font-heading font-black mb-2 tracking-tight">EDIT YOUR PACK</h1>
                <p className="text-gray-400 font-medium mb-12">Update the details of your adventure.</p>

                {error && (
                    <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 font-bold">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
                    {/* Basic Info */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-black text-howl-orange uppercase tracking-widest">General Info</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Trip Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-xl font-bold focus:outline-none focus:border-howl-orange transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full h-14 pl-12 pr-6 bg-white/5 border border-white/10 rounded-xl font-bold focus:outline-none focus:border-howl-orange transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Description</label>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-6 bg-white/5 border border-white/10 rounded-xl font-medium focus:outline-none focus:border-howl-orange transition-all resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Dates</label>
                                    <input
                                        type="text"
                                        value={formData.dates}
                                        onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
                                        placeholder="e.g. Sept 12 - 19"
                                        className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-xl font-bold focus:outline-none focus:border-howl-orange transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Duration</label>
                                    <input
                                        type="text"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-xl font-bold focus:outline-none focus:border-howl-orange transition-all"
                                    />
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
                                    <select
                                        value={formData.age_limit}
                                        onChange={(e) => setFormData({ ...formData, age_limit: e.target.value })}
                                        className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-xl font-bold focus:outline-none focus:border-howl-orange transition-all appearance-none cursor-pointer"
                                    >
                                        <option>All Ages</option>
                                        <option>18-25</option>
                                        <option>21-35</option>
                                        <option>30+</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Gender</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-xl font-bold focus:outline-none focus:border-howl-orange transition-all appearance-none cursor-pointer"
                                    >
                                        <option>All Genders</option>
                                        <option>Women Only</option>
                                        <option>Men Only</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Max Members</label>
                                    <input
                                        type="number"
                                        value={formData.max_members}
                                        onChange={(e) => setFormData({ ...formData, max_members: parseInt(e.target.value) })}
                                        className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-xl font-bold focus:outline-none focus:border-howl-orange transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Join Type</label>
                                    <select
                                        value={formData.join_type}
                                        onChange={(e) => setFormData({ ...formData, join_type: e.target.value })}
                                        className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-xl font-bold focus:outline-none focus:border-howl-orange transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="instant">Instant Join</option>
                                        <option value="request">Request Only</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Pack Vibe</label>
                                <div className="flex flex-wrap gap-2">
                                    {["CHILL", "INTENSE", "NOMADIC", "PARTY", "CULTURAL"].map(vibe => (
                                        <button
                                            key={vibe}
                                            onClick={() => setFormData({ ...formData, vibe })}
                                            className={`px-4 py-2 rounded-lg border text-[10px] font-black transition-all ${formData.vibe === vibe
                                                    ? "bg-howl-orange border-howl-orange text-white"
                                                    : "bg-white/5 border-white/10 text-gray-400 hover:border-howl-orange hover:text-howl-orange"
                                                }`}
                                        >
                                            {vibe}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        className="w-full h-16 bg-gradient-to-r from-howl-orange to-howl-burnt text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-howl-orange/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="animate-spin" /> Saving Changes...
                            </>
                        ) : (
                            <>
                                <Save size={20} /> Save Changes
                            </>
                        )}
                    </button>
                </form>
            </div>

            <div className="h-20" />
        </div>
    );
}
