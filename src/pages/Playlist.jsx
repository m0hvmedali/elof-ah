import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Heart, Upload, Download, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useTheme } from '../context/ThemeContext';




export default function PlaylistPage() {
  const { currentTheme } = useTheme();
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [songs, setSongs] = useState([]);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  // Fetch songs from Supabase
  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const { data, error } = await supabase
        .from('audio_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSongs(data || []);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume / 100;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Play selected song
  useEffect(() => {
    if (!audioRef.current || songs.length === 0) return;

    const song = songs[currentSong];
    if (!song || !song.file_url) return;

    const playSong = async () => {
      audioRef.current.src = song.file_url;
      audioRef.current.load();

      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error('فشل تشغيل الأغنية:', err);
        setIsPlaying(false);
      }
    };

    playSong();

    const handleLoadedMetadata = () => {
      setDuration(audioRef.current.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audioRef.current.currentTime);
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0);
    };

    const handleEnded = () => {
      handleNext();
    };

    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('ended', handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [currentSong, songs]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Play/Pause control
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentSong(prev => (prev < songs.length - 1 ? prev + 1 : 0));
    setProgress(0);
    setCurrentTime(0);
  };

  const handlePrev = () => {
    setCurrentSong(prev => (prev > 0 ? prev - 1 : songs.length - 1));
    setProgress(0);
    setCurrentTime(0);
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  const handleProgressClick = (e) => {
    if (!audioRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const width = rect.width;
    const percent = offsetX / width;

    audioRef.current.currentTime = percent * audioRef.current.duration;
    setCurrentTime(audioRef.current.currentTime);
    setProgress(percent * 100);
  };

  const handleUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of files) {
        const fileName = `${Date.now()}_${file.name}`;
        const filePath = `music/${fileName}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('audio')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('audio')
          .getPublicUrl(filePath);

        // Save to database
        const { error: dbError } = await supabase
          .from('audio_files')
          .insert([{
            title: file.name.replace(/\.[^/.]+$/, ''),
            artist: 'مستخدم',
            file_url: urlData.publicUrl,
            file_path: filePath,
            reason: 'أغنية مرفوعة'
          }]);

        if (dbError) throw dbError;
      }

      await fetchSongs();
      e.target.value = null;
    } catch (error) {
      console.error('Error uploading:', error);
      alert('فشل رفع الملف. حاول مرة أخرى.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteSong = async (song) => {
    if (!confirm('هل تريد حذف هذه الأغنية؟')) return;

    try {
      // Delete from storage
      await supabase.storage
        .from('audio')
        .remove([song.file_path]);

      // Delete from database
      const { error } = await supabase
        .from('audio_files')
        .delete()
        .eq('id', song.id);

      if (error) throw error;

      await fetchSongs();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      className="overflow-hidden relative p-4 min-h-screen pb-24"
      style={{
        background: `linear-gradient(135deg, ${currentTheme.primary}15, ${currentTheme.secondary}15)`
      }}
    >
      <div className="py-12 mx-auto max-w-4xl">
        <motion.h1
          className="mb-12 text-4xl font-bold text-center"
          style={{ color: currentTheme.primary }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Music Playlist 🎵
        </motion.h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Music Player */}
          <div className="overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl lg:col-span-2 dark:bg-gray-800/70 border border-white/50">
            <div className="p-6">
              {songs[currentSong] && (
                <>
                  <div className="flex items-center mb-8">
                    <div
                      className="flex justify-center items-center mr-6 w-24 h-24 text-4xl text-white rounded-xl"
                      style={{ background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})` }}
                    >
                      🎵
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold" style={{ color: currentTheme.primary }}>
                        {songs[currentSong].title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">{songs[currentSong].artist}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div
                      className="overflow-hidden h-2 bg-gray-200 rounded-full cursor-pointer dark:bg-gray-700"
                      onClick={handleProgressClick}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          width: `${progress}%`,
                          background: `linear-gradient(90deg, ${currentTheme.primary}, ${currentTheme.secondary})`
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-8 justify-center items-center mb-8">
                <button onClick={handlePrev} style={{ color: currentTheme.primary }}>
                  <SkipBack size={28} />
                </button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePlayPause}
                  className="flex justify-center items-center w-16 h-16 text-white rounded-full shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})` }}
                >
                  {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" />}
                </motion.button>

                <button onClick={handleNext} style={{ color: currentTheme.primary }}>
                  <SkipForward size={28} />
                </button>
              </div>

              <div className="flex items-center">
                <Volume2 className="mr-3" style={{ color: currentTheme.primary }} />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full"
                  style={{ accentColor: currentTheme.primary }}
                />
              </div>
            </div>
          </div>

          {/* Playlist */}
          <div className="overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl dark:bg-gray-800/70 border border-white/50">
            <div className="flex justify-between items-center p-4 text-white"
              style={{ background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})` }}
            >
              <h2 className="flex items-center text-xl font-bold">
                <Music className="mr-2" /> Playlist
              </h2>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUpload}
                className="flex items-center px-3 py-1 text-sm rounded-full bg-white/20"
                disabled={isUploading}
              >
                {isUploading ? (
                  <span>Uploading...</span>
                ) : (
                  <>
                    <Upload className="mr-1" size={16} />
                    <span>Add Song</span>
                  </>
                )}
              </motion.button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="audio/*"
                multiple
                className="hidden"
              />
            </div>

            <div className="overflow-y-auto max-h-[500px]">
              {songs.map((song, index) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer flex items-center justify-between ${currentSong === index
                    ? 'bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/30'
                    : 'hover:bg-violet-50/50 dark:hover:bg-violet-900/10'
                    }`}
                  onClick={() => {
                    setCurrentSong(index);
                    setProgress(0);
                    setCurrentTime(0);
                    setIsPlaying(true);
                  }}
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="flex justify-center items-center mr-4 w-12 h-12 rounded-lg"
                      style={{ background: `linear-gradient(135deg, ${currentTheme.primary}30, ${currentTheme.secondary}30)` }}
                    >
                      🎵
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium truncate ${currentSong === index ? 'font-bold' : ''
                        }`} style={{ color: currentSong === index ? currentTheme.primary : 'inherit' }}>
                        {song.title}
                      </h3>
                      <p className="text-sm text-gray-600 truncate dark:text-gray-400">{song.artist}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentSong === index && isPlaying && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      >
                        <div className="w-2 h-2 rounded-full" style={{ background: currentTheme.primary }}></div>
                      </motion.div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSong(song);
                      }}
                      className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </motion.div>
              ))}

              {songs.length === 0 && (
                <div className="p-8 text-center">
                  <div className="mb-4 text-5xl">🎵</div>
                  <p className="text-gray-600 dark:text-gray-400">No songs yet</p>
                  <button
                    onClick={handleUpload}
                    className="flex items-center px-4 py-2 mx-auto mt-4 text-white rounded-full"
                    style={{ background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})` }}
                  >
                    <Upload className="mr-2" size={16} />
                    Upload Songs
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}