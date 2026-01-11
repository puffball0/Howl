import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { MapPin, Compass, Camera, Wind, Mountain, Zap, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../contexts/AuthContext";

const personalities = [
    { id: "chill", label: "Chill", icon: Wind },
    { id: "adventurous", label: "Adventurous", icon: Mountain },
    { id: "spontaneous", label: "Spontaneous", icon: Zap },
];

const interestsList = [
    "Hiking", "Food", "Beaches", "Photography", "Nightlife", "Camping", "Surfing", "History", "Music", "Art"
];

const Onboarding = () => {
    const navigate = useNavigate();
    const { completeOnboarding, user } = useAuth();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        displayName: "",
        ageRange: "",
        location: "",
        personality: "",
        interests: [] as string[]
    });

    const updateData = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const toggleInterest = (interest: string) => {
        setFormData(prev => {
            const newInterests = prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest];
            return { ...prev, interests: newInterests };
        });
    };

    const nextStep = () => setStep(s => Math.min(s + 1, 3));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));


    return (
        <div className="min-h-screen bg-[#010b13] text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            <div className="w-full max-w-xl relative z-10">
                {/* Header */}
                <div className="mb-10 text-center">
                    <motion.h1
                        className="text-3xl font-heading font-bold text-white mb-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {step === 1 && "Tell us about yourself"}
                        {step === 2 && "Where are you heading?"}
                        {step === 3 && "What's your calling?"}
                    </motion.h1>
                    <p className="text-gray-400 text-sm">Step {step} of 3</p>
                </div>

                {/* Simple Progress Dots */}
                <div className="flex justify-center gap-3 mb-12">
                    {[1, 2, 3].map((i) => (
                        <motion.div
                            key={i}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all duration-300",
                                step === i ? "bg-howl-orange w-8" : "bg-white/20"
                            )}
                            initial={false}
                            animate={{ width: step === i ? 32 : 8 }}
                        />
                    ))}
                </div>

                {/* Seamless Content Area */}
                <div className="relative min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                <div className="space-y-6">
                                    {/* Profile Pic - Simple Ring */}
                                    <div className="flex justify-center">
                                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center hover:border-howl-orange transition-colors cursor-pointer overflow-hidden text-white/20 hover:text-howl-orange">
                                            <Camera className="w-8 h-8" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">Display Name</label>
                                            <Input
                                                value={formData.displayName}
                                                onChange={(e) => updateData("displayName", e.target.value)}
                                                placeholder="What should we call you?"
                                                className="bg-white/5 border-white/10 focus:border-howl-orange rounded-xl h-12"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">Age Range</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {["18-24", "25-34", "35-44", "45+"].map((age) => (
                                                    <button
                                                        key={age}
                                                        onClick={() => updateData("ageRange", age)}
                                                        className={cn(
                                                            "h-12 rounded-xl border text-sm font-medium transition-all duration-200",
                                                            formData.ageRange === age
                                                                ? "bg-howl-orange/10 border-howl-orange text-howl-orange"
                                                                : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                                                        )}
                                                    >
                                                        {age}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="space-y-8"
                            >
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">Your Base Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <Input
                                                value={formData.location}
                                                onChange={(e) => updateData("location", e.target.value)}
                                                placeholder="City, Region"
                                                className="bg-white/5 border-white/10 focus:border-howl-orange rounded-xl h-12 pl-12"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">Travel Personality</label>
                                        <div className="grid grid-cols-1 gap-3">
                                            {personalities.map((p, idx) => (
                                                <motion.button
                                                    key={p.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    onClick={() => updateData("personality", p.id)}
                                                    className={cn(
                                                        "flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left w-full",
                                                        formData.personality === p.id
                                                            ? "bg-howl-green/20 border-howl-green text-white"
                                                            : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                                                    )}
                                                >
                                                    <p.icon className={cn(
                                                        "w-6 h-6",
                                                        formData.personality === p.id ? "text-howl-orange" : "text-gray-500"
                                                    )} />
                                                    <div>
                                                        <span className="block font-bold text-white">{p.label}</span>
                                                        <span className="text-xs text-gray-400">
                                                            {p.id === 'chill' && 'Slow pace, deep connection, nature focus.'}
                                                            {p.id === 'adventurous' && 'Off-path trails, mountains, high energy.'}
                                                            {p.id === 'spontaneous' && 'No fixed plans, local vibes, whatever happens.'}
                                                        </span>
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-gray-400 flex items-center gap-2 mb-2">
                                        <Compass className="w-4 h-4 text-howl-orange" />
                                        Select your passions
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {interestsList.map((interest, idx) => (
                                            <motion.button
                                                key={interest}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: idx * 0.05 }}
                                                onClick={() => toggleInterest(interest)}
                                                className={cn(
                                                    "px-5 py-2.5 rounded-full border transition-all duration-200 text-sm font-medium",
                                                    formData.interests.includes(interest)
                                                        ? "bg-howl-orange/20 border-howl-orange text-white"
                                                        : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                                                )}
                                            >
                                                {interest}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation */}
                <div className="mt-12 flex items-center justify-between">
                    {step > 1 ? (
                        <button
                            onClick={prevStep}
                            className="text-gray-500 hover:text-white font-medium text-sm transition-colors"
                        >
                            Back
                        </button>
                    ) : (<div />)}

                    <Button
                        variant="adventure"
                        onClick={step < 3 ? nextStep : async () => {
                            setIsLoading(true);
                            try {
                                await completeOnboarding({
                                    display_name: formData.displayName || user?.display_name || 'Adventurer',
                                    age_range: formData.ageRange,
                                    location: formData.location,
                                    personality: formData.personality,
                                    interests: formData.interests,
                                });
                                navigate("/home");
                            } catch (err) {
                                console.error('Onboarding failed:', err);
                            } finally {
                                setIsLoading(false);
                            }
                        }}
                        className="rounded-full px-10 h-12 text-sm font-bold bg-howl-orange text-white hover:brightness-110 shadow-lg shadow-howl-orange/20"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                        ) : (
                            step < 3 ? "Next step" : "Begin Adventure"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
