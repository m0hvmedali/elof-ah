import React, { useState, useRef, useEffect } from 'react';
import { Music, Pause, Play, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const PLAYLIST = [
    { title: "Special Melody", src: "/water-bubbles-257594.mp3", artist: "Memories" },
    // Add more songs here if available in public folder
    { title: "ما بين قلوبنا رسول", src: "/E4CdkU-9Ies.mp3", artist: "اصاله" },
    { title: "la la la ", src: "/Lana_DelRey_-_LaLaLa_(mp3.pm).mp3", artist: "lana del rey" },
    { title: "million dollar man", src: "/Lana_DelRey_-_Million_Dollar_Man_(mp3.pm).mp3", artist: "lana del rey" },
    { title: "without you ", src: "/Lana_DelRey_-_Without_You_(mp3.pm).mp3", artist: "lana del rey" }

];

export default function MusicPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.log("Autoplay blocked:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrack]);

    const togglePlay = () => setIsPlaying(!isPlaying);

    const nextTrack = () => {
        setCurrentTrack((prev) => (prev + 1) % PLAYLIST.length);
        setIsPlaying(true);
    };

    const prevTrack = () => {
        setCurrentTrack((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
        setIsPlaying(true);
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="fixed bottom-20 left-4 z-50 flex flex-col items-start gap-2">
            <audio
                ref={audioRef}
                src={PLAYLIST[currentTrack].src}
                onEnded={nextTrack}
                loop={PLAYLIST.length === 1}
            />

            {/* Expanded Controls */}
            {isExpanded && (
                <div className="bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl w-64 mb-2 animate-in slide-in-from-bottom-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
                            <Music size={18} className="text-white" />
                        </div>
                        <div className="overflow-hidden">
                            <h3 className="text-sm font-bold text-white truncate">{PLAYLIST[currentTrack].title}</h3>
                            <p className="text-xs text-gray-400 truncate">{PLAYLIST[currentTrack].artist}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-white">
                        <button onClick={prevTrack} className="hover:text-pink-400 transition"><SkipBack size={20} /></button>
                        <button onClick={togglePlay} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
                            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                        </button>
                        <button onClick={nextTrack} className="hover:text-pink-400 transition"><SkipForward size={20} /></button>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
                        <span className="text-xs text-gray-400">Playlist ({PLAYLIST.length})</span>
                        <button onClick={toggleMute} className="text-gray-400 hover:text-white">
                            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="group flex items-center gap-2 bg-black/80 backdrop-blur-md p-3 rounded-full border border-white/10 shadow-xl hover:bg-black/90 transition-all active:scale-95"
            >
                <div className={`relative ${isPlaying ? 'animate-pulse' : ''}`}>
                    <Music size={20} className="text-pink-500" />
                    {isPlaying && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-black"></span>
                    )}
                </div>
                {isExpanded && <span className="text-sm font-medium text-white pr-2">Music</span>}
            </button>
        </div>
    );
}
