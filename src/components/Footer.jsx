
import React from 'react';
import { Mail, Smartphone, Heart } from 'lucide-react';

export default function Footer({ className = "" }) {
    return (
        <footer className={`w-full py-4 backdrop-blur-xl bg-white/95 dark:bg-gray-900/90 border-t border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 text-xs shadow-lg z-50 relative ${className}`}>
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-3">

                {/* Copyright */}
                <div className="flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
                    <span className="font-medium">© {new Date().getFullYear()} Mohamed Aly. All Rights Reserved.</span>
                </div>

                {/* Credits */}
                <div className="md:absolute left-1/2 md:-translate-x-1/2 flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
                    <span>Built with</span>
                    <Heart size={12} className="text-rose-500 fill-rose-500 animate-pulse" />
                    <span>by Mohamed Aly</span>
                </div>

                {/* Contact Links */}
                <div className="flex gap-4">
                    <a
                        href="mailto:mohamedalix546@gmail.com"
                        className="flex items-center gap-2 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-300 group"
                    >
                        <Mail size={14} className="group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Email</span>
                    </a>
                    <a
                        href="https://wa.me/201281320192"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300 group"
                    >
                        <Smartphone size={14} className="group-hover:scale-110 transition-transform" />
                        <span className="font-medium">WhatsApp</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}
