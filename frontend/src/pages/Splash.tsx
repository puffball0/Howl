import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashProps {
    onComplete: () => void;
}

const Splash: React.FC<SplashProps> = ({ onComplete }) => {
    const [complete, setComplete] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setComplete(true);
            setTimeout(onComplete, 1000); // Wait for exit animation
        }, 4500); // Total splash duration
        return () => clearTimeout(timer);
    }, [onComplete]);

    const text = "call your pack";

    return (
        <AnimatePresence mode="wait">
            {!complete && (
                <motion.div
                    key="splash"
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white overflow-hidden" // Changed to pure black for base
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }} // Simpler fade out
                    transition={{ duration: 1.5, ease: "easeInOut" }} // Slower, smoother fade
                >
                    {/* Background Elements - Subtle Navy Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-howl-navy via-black to-black opacity-80" />

                    {/* Main Logo Text - No Icons */}
                    <motion.h1
                        className="relative text-8xl md:text-9xl font-heading font-black tracking-tighter text-howl-orange z-10"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    >
                        HOWL
                    </motion.h1>

                    {/* Typewriter Subtitle */}
                    <div className="h-8 mt-4 z-10">
                        <motion.p className="text-xl md:text-2xl font-light tracking-widest text-gray-400 font-sans uppercase">
                            {text.split("").map((char, index) => (
                                <motion.span
                                    key={index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 + index * 0.08 }} // Slightly slower typing
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Splash;
