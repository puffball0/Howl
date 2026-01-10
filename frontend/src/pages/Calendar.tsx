import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft, ChevronRight, MapPin,
    Calendar as CalendarIcon, Users, Info
} from "lucide-react";
import { cn } from "../lib/utils";

// Mock data for calendar
const tripEvents = [
    {
        id: "1",
        title: "Tropical Paradise",
        location: "Bali, Indonesia",
        dates: [12, 13, 14, 15, 16, 17, 18, 19],
        month: 8, // Sept (0-indexed 8)
        color: "bg-howl-orange",
        vibe: "Nomadic / Chill"
    },
    {
        id: "2",
        title: "Alpine Summit",
        location: "Swiss Alps",
        dates: [5, 6, 7, 8, 9, 10],
        month: 9, // Oct
        color: "bg-blue-500",
        vibe: "Active / Intense"
    }
];

export default function Calendar() {
    const [currentMonth, setCurrentMonth] = useState(8); // September 2026
    const [hoveredTrip, setHoveredTrip] = useState<any>(null);

    const daysInMonth = (month: number) => new Date(2026, month + 1, 0).getDate();
    const firstDayOfMonth = (month: number) => new Date(2026, month, 1).getDay();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const generateDays = () => {
        const days = [];
        const numDays = daysInMonth(currentMonth);
        const firstDay = firstDayOfMonth(currentMonth);

        // Padding for previous month days
        for (let i = 0; i < firstDay; i++) {
            days.push({ day: null, isTrip: false });
        }

        for (let d = 1; d <= numDays; d++) {
            const trip = tripEvents.find(t => t.month === currentMonth && t.dates.includes(d));
            days.push({ day: d, isTrip: !!trip, trip });
        }
        return days;
    };

    return (
        <div className="min-h-full w-full bg-howl-navy p-6 lg:p-10 pb-32 flex flex-col items-center">

            <div className="max-w-5xl w-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-heading font-black tracking-tighter mb-2 uppercase">Your Timeline</h1>
                        <p className="text-gray-400 font-medium">Visualize your upcoming pack adventures.</p>
                    </div>

                    <div className="flex items-center gap-6 bg-[#02121f] p-2 rounded-2xl border border-white/5">
                        <button
                            onClick={() => setCurrentMonth(prev => Math.max(0, prev - 1))}
                            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="text-sm font-black uppercase tracking-widest w-40 text-center">
                            {monthNames[currentMonth]} 2026
                        </span>
                        <button
                            onClick={() => setCurrentMonth(prev => Math.min(11, prev + 1))}
                            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex gap-6 mb-8">
                    {tripEvents.map(trip => (
                        <div key={trip.id} className="flex items-center gap-2">
                            <div className={cn("w-3 h-3 rounded-full", trip.color)} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{trip.title}</span>
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="bg-[#02121f] border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative">
                    {/* Days Header */}
                    <div className="grid grid-cols-7 border-b border-white/5">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                            <div key={day} className="py-4 text-center text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7">
                        {generateDays().map((date, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "aspect-square p-2 border-r border-b border-white/5 flex flex-col justify-between relative group",
                                    !date.day ? "bg-black/10" : "hover:bg-white/5 transition-colors"
                                )}
                                onMouseEnter={() => date.trip && setHoveredTrip(date.trip)}
                                onMouseLeave={() => setHoveredTrip(null)}
                            >
                                {date.day && (
                                    <span className={cn(
                                        "text-xs font-black",
                                        date.isTrip ? "text-white" : "text-gray-700"
                                    )}>
                                        {date.day}
                                    </span>
                                )}

                                {date.isTrip && (
                                    <motion.div
                                        layoutId={date.trip.id}
                                        className={cn(
                                            "w-full h-1 md:h-2 rounded-full",
                                            date.trip.color
                                        )}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Pop-up Card for Hover */}
                    <AnimatePresence>
                        {hoveredTrip && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute bottom-6 right-6 w-72 bg-white rounded-2xl p-6 shadow-2xl z-50 text-howl-navy"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white", hoveredTrip.color)}>
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-heading font-black leading-tight uppercase tracking-tight">{hoveredTrip.title}</h3>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{hoveredTrip.location}</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <span className="text-[10px] font-black text-gray-400 uppercase">Vibe</span>
                                        <span className="text-xs font-bold">{hoveredTrip.vibe}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-[10px] font-black text-gray-400 uppercase">Dates</span>
                                        <span className="text-xs font-bold">Sept {hoveredTrip.dates[0]} - {hoveredTrip.dates[hoveredTrip.dates.length - 1]}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-8 flex items-center gap-2 text-gray-600 italic text-xs">
                    <Info size={14} />
                    <span>Hover over any highlighted date to see trip details.</span>
                </div>
            </div>

            {/* SPACER */}
            <div className="h-20" />
        </div>
    );
}
