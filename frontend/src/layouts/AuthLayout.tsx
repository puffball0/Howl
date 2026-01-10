import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import heroImg from "../assets/auth-hero.png";

const AuthLayout = () => {
    const location = useLocation();

    return (
        <div className="flex min-h-screen w-full bg-howl-navy text-foreground overflow-hidden">
            {/* Left Side - Hero Image (Desktop Only) */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-howl-navy/20 z-10" /> {/* Overlay */}
                <motion.img
                    src={heroImg}
                    alt="Adventure Awaits"
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1.05 }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                />
                {/* Text Removed as per feedback */}
            </div>

            {/* Right Side - Content */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
                {/* Mobile Background (Subtle Texture to replace missing split screen) */}
                <div className="absolute inset-0 lg:hidden z-0">
                    <div className="absolute inset-0 bg-howl-navy opacity-90 z-10" />
                    <img src={heroImg} alt="bg" className="w-full h-full object-cover" />
                </div>

                <div className="w-full max-w-md z-20 relative bg-howl-green/90 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-8 lg:p-0 rounded-2xl shadow-2xl lg:shadow-none border border-white/10 lg:border-none">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
