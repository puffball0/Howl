import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Home, Calendar, Map, User, PlusCircle, ChevronLeft, ChevronRight, Settings, MapPin, Menu, Plus } from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";

const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: Map, label: "Explore", path: "/explore" },
    { icon: PlusCircle, label: "Groups", path: "/groups" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: MapPin, label: "My Trips", path: "/my-trips" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Settings, label: "Settings", path: "/settings" },
];



export default function MainLayout() {
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-howl-navy text-white overflow-hidden">
            {/* Desktop Sidebar */}
            <motion.aside
                initial={{ width: 256 }}
                animate={{ width: isSidebarOpen ? 256 : 0, padding: isSidebarOpen ? 16 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hidden lg:flex flex-col border-r border-white/5 bg-[#010b13] relative z-20 overflow-hidden"
            >
                <div className={`mb-10 flex ${isSidebarOpen ? "px-2" : "hidden"}`}>
                    <h1 className="text-3xl font-heading font-black tracking-tighter text-howl-orange">HOWL</h1>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group relative whitespace-nowrap",
                                location.pathname === item.path
                                    ? "bg-howl-orange/10 text-howl-orange"
                                    : "text-gray-500 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className="w-5 h-5 min-w-[20px]" />
                            <span className="font-bold text-sm uppercase tracking-widest overflow-hidden">
                                {item.label}
                            </span>
                            {location.pathname === item.path && (
                                <motion.div
                                    layoutId="desktop-nav-active"
                                    className="absolute left-0 w-1 h-6 bg-howl-orange rounded-full"
                                />
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                    <Link to="/create-trip" className={cn(
                        "w-full h-12 bg-gradient-to-r from-howl-orange to-howl-burnt rounded-xl flex items-center justify-center gap-2 font-black uppercase tracking-tighter shadow-lg shadow-howl-orange/20 hover:scale-[1.02] transition-transform whitespace-nowrap"
                    )}>
                        <span>Create</span>
                    </Link>
                </div>
            </motion.aside>

            {/* Collapse Toggle - Moved outside sidebar to remain visible when closed */}
            <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className={`hidden lg:flex absolute top-8 w-8 h-8 bg-howl-orange rounded-full items-center justify-center text-howl-navy shadow-lg z-50 hover:scale-110 transition-all duration-300 ${isSidebarOpen ? "left-[240px]" : "left-6"}`}
            >
                <Menu size={16} />
            </button>

            {/* Main Content */}
            <main className="flex-1 h-screen overflow-y-auto relative pb-24 lg:pb-0">
                <Outlet />
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#010b13]/80 backdrop-blur-xl border-t border-white/5 px-6 flex items-center justify-between z-50">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        to={item.path}
                        className={cn(
                            "flex flex-col items-center gap-1 transition-all duration-200",
                            location.pathname === item.path ? "text-howl-orange" : "text-gray-500"
                        )}
                    >
                        <div className="relative">
                            <item.icon className="w-6 h-6" />

                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                    </Link>
                ))}

                <Link to="/create-trip" className="w-12 h-12 bg-howl-orange rounded-full flex items-center justify-center shadow-lg shadow-howl-orange/20 -translate-y-4 border-4 border-howl-navy hover:scale-110 transition-transform duration-300">
                    <Plus className="w-6 h-6 text-black" />
                </Link>
            </nav>
        </div>
    );
}
