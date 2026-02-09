import React from 'react';

export default function Logo({ className = "w-8 h-8", animated = true }) {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <svg
                viewBox="0 0 100 100"
                className={`w-full h-full drop-shadow-md ${animated ? 'animate-bounce-slow' : ''}`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Body Shadow */}
                <circle cx="50" cy="55" r="40" fill="#E6C200" opacity="0.3" />
                {/* Main Body */}
                <path d="M25,65 Q25,35 55,35 Q85,35 85,65 Q85,85 55,85 Q25,85 25,65" fill="#FFD700" />
                {/* Head */}
                <circle cx="70" cy="40" r="18" fill="#FFD700" />
                {/* Eye */}
                <circle cx="75" cy="35" r="2.5" fill="black" />
                {/* Beak */}
                <path d="M85,40 L96,44 L85,48 Z" fill="#FF8C00" />
                {/* Wing Detail */}
                <path d="M35,65 Q45,55 55,65" fill="none" stroke="#DAB600" stroke-width="3" stroke-linecap="round" />
            </svg>

            {/* Decorative sparkle */}
            {animated && (
                <div className="absolute -top-1 -right-1 animate-pulse">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
                        <path d="M5 0L6.1 3.9L10 5L6.1 6.1L5 10L3.9 6.1L0 5L3.9 3.9L5 0Z" />
                    </svg>
                </div>
            )}
        </div>
    );
}
