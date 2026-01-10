import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Shield, Bell, Lock, Eye, LogOut,
    ChevronRight, HelpCircle, ToggleLeft as Toggle,
    Smartphone, Moon, Sun, Info
} from "lucide-react";

export default function Settings() {
    const navigate = useNavigate();

    const sections = [
        {
            title: "Account & Security",
            icon: Shield,
            items: [
                { label: "Email Notifications", type: "toggle", value: true },
                { label: "Push Notifications", type: "toggle", value: false },
                { label: "Two-Factor Authentication", type: "link", value: "Enabled" },
                { label: "Change Password", type: "link" },
            ]
        },
        {
            title: "Privacy",
            icon: Eye,
            items: [
                { label: "Profile Visibility", type: "select", value: "Public" },
                { label: "Show Online Status", type: "toggle", value: true },
                { label: "Data Usage", type: "link" },
            ]
        },
        {
            title: "App Preferences",
            icon: Smartphone,
            items: [
                { label: "Units", type: "select", value: "Metric (km)" },
                { label: "Language", type: "select", value: "English" },
                { label: "Dark Mode", type: "toggle", value: true },
            ]
        }
    ];

    return (
        <div className="min-h-full w-full bg-howl-navy p-6 lg:p-10 pb-32">
            <div className="max-w-2xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-heading font-black tracking-tighter text-white uppercase mb-2">Settings</h1>
                    <p className="text-gray-500 font-medium">Manage your pack experience and privacy.</p>
                </div>

                <div className="space-y-10">
                    {sections.map((section, idx) => (
                        <div key={idx} className="space-y-4">
                            <h3 className="text-sm font-black text-howl-orange uppercase tracking-widest px-2 flex items-center gap-2">
                                <section.icon size={16} />
                                {section.title}
                            </h3>

                            <div className="bg-[#02121f] border border-white/5 rounded-3xl overflow-hidden">
                                {section.items.map((item, i) => (
                                    <div
                                        key={i}
                                        className="px-6 py-5 flex items-center justify-between border-b border-white/5 last:border-none hover:bg-white/[0.02] transition-colors cursor-pointer"
                                    >
                                        <span className="text-sm font-bold text-gray-300">{item.label}</span>

                                        <div className="flex items-center gap-3">
                                            {item.type === "toggle" && (
                                                <div className={cn(
                                                    "w-12 h-6 rounded-full relative p-1 transition-colors",
                                                    item.value ? "bg-howl-orange" : "bg-gray-800"
                                                )}>
                                                    <div className={cn(
                                                        "w-4 h-4 bg-white rounded-full transition-all",
                                                        item.value ? "ml-auto" : "ml-0"
                                                    )} />
                                                </div>
                                            )}
                                            {item.type === "select" && (
                                                <span className="text-xs font-black text-howl-orange uppercase">{item.value}</span>
                                            )}
                                            {item.type === "link" && item.value && (
                                                <span className="text-xs font-black text-green-500 uppercase">{item.value}</span>
                                            )}
                                            <ChevronRight size={16} className="text-gray-700" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Support & Legal */}
                    <div className="space-y-4 pt-4">
                        <div className="bg-[#02121f] border border-white/5 rounded-3xl overflow-hidden">
                            <button className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                <span className="text-sm font-bold text-gray-300 flex items-center gap-3">
                                    <HelpCircle size={18} className="text-gray-500" /> Help & Support
                                </span>
                                <ChevronRight size={16} className="text-gray-700" />
                            </button>
                            <button className="w-full px-6 py-5 flex items-center justify-between border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                                <span className="text-sm font-bold text-gray-300 flex items-center gap-3">
                                    <Info size={18} className="text-gray-500" /> Terms & Privacy
                                </span>
                                <ChevronRight size={16} className="text-gray-700" />
                            </button>
                        </div>
                    </div>

                    {/* Logout */}
                    <div className="pt-8">
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full h-16 bg-white/5 hover:bg-red-500/10 border border-white/5 border-dashed rounded-3xl flex items-center justify-center gap-3 text-red-500 font-black uppercase tracking-widest transition-all group"
                        >
                            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                            Logout
                        </button>
                    </div>

                    <div className="text-center text-[10px] font-black text-gray-700 uppercase tracking-[0.3em] pb-10">
                        Howl v1.0.4 - Built for the Pack
                    </div>
                </div>
            </div>
        </div>
    );
}

// Utility to merge classes (since I can't import from lib/utils easily in one go)
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
