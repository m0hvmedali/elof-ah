import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Mail, Smartphone } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full py-8 mt-auto backdrop-blur-md bg-black/80 border-t border-white/10 text-gray-400 text-xs z-30">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">

                {/* Copyright */}
                <div className="flex items-center gap-1 opacity-80">
                    <span>© {new Date().getFullYear()} Mohamed Aly. All Rights Reserved.</span>
                </div>

                {/* Credits */}
                <div className="flex items-center gap-2">
                    <span>Made with</span>
                    <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" />
                    <span>for <span className="font-bold text-pink-400">جنى</span></span>
                </div>

                {/* Contact Links */}
                <div className="flex gap-6">
                    <a
                        href="mailto:mohamedalix546@gmail.com"
                        className="flex items-center gap-2 hover:text-cyan-400 transition-colors duration-300 group"
                    >
                        <Mail size={16} className="group-hover:scale-110 transition-transform" />
                        <span>Email</span>
                    </a>
                    <a
                        href="https://wa.me/201281320192"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-green-400 transition-colors duration-300 group"
                    >
                        <Smartphone size={16} className="group-hover:scale-110 transition-transform" />
                        <span>WhatsApp</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}
