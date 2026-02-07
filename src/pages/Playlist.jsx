// src/pages/PlaylistPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Heart, Upload, Download } from 'lucide-react';

// قائمة الأغاني مع روابط حقيقية
const songs = [
  {
    id: 1,
    title: "أغنية حبنا",
    artist: "فنان مميز",
    duration: "3:45",
    reason: "هذه الأغنية كانت تعزف في أول مرة اعترفنا فيها بحبنا",
    cover: "🎵",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "رحلة الحب",
    artist: "مغنية رومانسية",
    duration: "4:22",
    reason: "كنا نستمع لهذه الأغنية في أول رحلة سفر معًا",
    cover: "🎶",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "أنتِ حياتي",
    artist: "فنان مشهور",
    duration: "3:18",
    reason: "الكلمات تعبر تمامًا عن مشاعري تجاهك",
    cover: "🎧",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: 4,
    title: "ليلتنا",
    artist: "ثنائي رومانسي",
    duration: "5:01",
    reason: "ذكرتني بأول ليلة قضيناها نتحدث حتى الفجر",
    cover: "🎤",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    id: 5,
    title: "أحلامنا معًا",
    artist: "فرقة موسيقية",
    duration: "4:36",
    reason: "هذه الأغنية تلهمنا للتخطيط لمستقبلنا معًا",
    cover: "🎼",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  },
  {
    id: 6,
    title: "قلبي معك",
    artist: "مطرب مفضل",
    duration: "3:55",
    reason: "نستمع لها دائمًا عندما نشتاق لبعضنا",
    cover: "🎷",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  }
];

export default function PlaylistPage() {
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedSongs, setUploadedSongs] = useState([]);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  // تهيئة الصوت
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

  // تشغيل الأغنية المحددة
  useEffect(() => {
    if (!audioRef.current) return;

    const song = [...songs, ...uploadedSongs][currentSong];
    if (!song || !song.url) return;

    const playSong = async () => {
      audioRef.current.src = song.url;
      audioRef.current.load();

      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("فشل تشغيل الأغنية:", err);
        setIsPlaying(false);
      }
    };

    playSong();

    // تحديث مدة الأغنية عند التحميل
    const handleLoadedMetadata = () => {
      setDuration(audioRef.current.duration);
    };

    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);

    // تحديث الوقت الحالي
    const handleTimeUpdate = () => {
      setCurrentTime(audioRef.current.currentTime);
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0);
    };

    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);

    // عند انتهاء الأغنية
    const handleEnded = () => {
      handleNext();
    };

    audioRef.current.addEventListener('ended', handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [currentSong, uploadedSongs]);

  // التحكم في مستوى الصوت
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // التحكم في التشغيل/الإيقاف
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
    const allSongs = [...songs, ...uploadedSongs];
    setCurrentSong(prev => (prev < allSongs.length - 1 ? prev + 1 : 0));
    setProgress(0);
    setCurrentTime(0);
  };

  const handlePrev = () => {
    const allSongs = [...songs, ...uploadedSongs];
    setCurrentSong(prev => (prev > 0 ? prev - 1 : allSongs.length - 1));
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

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    // محاكاة رفع الملفات (في تطبيق حقيقي، هنا يتم رفع الملفات إلى الخادم)
    setTimeout(() => {
      const newSongs = Array.from(files).map((file, index) => ({
        id: Date.now() + index,
        title: file.name.replace(/\.[^/.]+$/, ""), // إزالة امتداد الملف
        artist: "أغنية مرفوعة",
        duration: "0:00",
        reason: "أغنية أضفتها بنفسك",
        cover: "⬆️",
        url: URL.createObjectURL(file)
      }));

      setUploadedSongs(prev => [...prev, ...newSongs]);
      setIsUploading(false);
      e.target.value = null; // إعادة تعيين المدخل للسماح برفع نفس الملف مرة أخرى
    }, 1500);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const allSongs = [...songs, ...uploadedSongs];

  return (
    <div className="overflow-hidden relative p-4 min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-900 dark:to-purple-900">
      <div className="py-12 mx-auto max-w-4xl">
        <motion.h1
          className="mb-12 text-4xl font-bold text-center text-violet-700 dark:text-violet-300"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          سجل حبنا الموسيقي
        </motion.h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* مشغل الموسيقى */}
          <div className="overflow-hidden bg-white rounded-2xl shadow-xl lg:col-span-2 dark:bg-gray-800">
            <div className="p-6">
              {allSongs[currentSong] && (
                <>
                  <div className="flex items-center mb-8">
                    <div className="flex justify-center items-center mr-6 w-24 h-24 text-4xl text-white bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl">
                      {allSongs[currentSong].cover}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-violet-700 dark:text-violet-300">
                        {allSongs[currentSong].title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">{allSongs[currentSong].artist}</p>
                      <p className="text-gray-500 dark:text-gray-500">{allSongs[currentSong].duration}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div
                      className="overflow-hidden h-2 bg-gray-200 rounded-full cursor-pointer dark:bg-gray-700"
                      onClick={handleProgressClick}
                    >
                      <motion.div
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                        style={{ width: `${progress}%` }}
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
                <button onClick={handlePrev} className="text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300">
                  <SkipBack size={28} />
                </button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePlayPause}
                  className="flex justify-center items-center w-16 h-16 text-white bg-gradient-to-r from-violet-600 to-purple-600 rounded-full shadow-lg"
                >
                  {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" />}
                </motion.button>

                <button onClick={handleNext} className="text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300">
                  <SkipForward size={28} />
                </button>
              </div>

              <div className="flex items-center">
                <Volume2 className="mr-3 text-violet-600 dark:text-violet-400" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full accent-violet-600 dark:accent-violet-400"
                />
              </div>
            </div>

            {allSongs[currentSong] && (
              <div className="p-6 bg-violet-50 dark:bg-violet-900/30">
                <h3 className="flex items-center mb-2 font-bold text-violet-700 dark:text-violet-300">
                  <Heart className="mr-2 text-rose-500" size={18} /> لماذا هذه الأغنية؟
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{allSongs[currentSong].reason}</p>
              </div>
            )}
          </div>

          {/* قائمة التشغيل */}
          <div className="overflow-hidden bg-white rounded-2xl shadow-xl dark:bg-gray-800">
            <div className="flex justify-between items-center p-4 text-white bg-gradient-to-r from-violet-500 to-purple-500">
              <h2 className="flex items-center text-xl font-bold">
                <Music className="mr-2" /> قائمة أغانينا
              </h2>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUpload}
                className="flex items-center px-3 py-1 text-sm rounded-full bg-white/20"
                disabled={isUploading}
              >
                {isUploading ? (
                  <span>جاري الرفع...</span>
                ) : (
                  <>
                    <Upload className="mr-1" size={16} />
                    <span>إضافة أغاني</span>
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
              {allSongs.map((song, index) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer flex items-center ${currentSong === index
                      ? 'bg-violet-50 dark:bg-violet-900/30'
                      : 'hover:bg-violet-50/50 dark:hover:bg-violet-900/10'
                    }`}
                  onClick={() => {
                    setCurrentSong(index);
                    setProgress(0);
                    setCurrentTime(0);
                    setIsPlaying(true);
                  }}
                >
                  <div className="flex justify-center items-center mr-4 w-12 h-12 text-violet-700 bg-gradient-to-r from-violet-100 to-purple-100 rounded-lg dark:from-violet-800/30 dark:to-purple-800/30 dark:text-violet-300">
                    {song.cover}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium truncate ${currentSong === index
                        ? 'text-violet-700 dark:text-violet-300'
                        : 'text-gray-800 dark:text-gray-200'
                      }`}>
                      {song.title}
                    </h3>
                    <p className="text-sm text-gray-600 truncate dark:text-gray-400">{song.artist}</p>
                  </div>

                  <div className="flex items-center">
                    <span className="mr-3 text-sm text-gray-500 dark:text-gray-500">{song.duration}</span>
                    {currentSong === index && isPlaying && (
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                        }}
                      >
                        <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}

              {uploadedSongs.length > 0 && (
                <div className="p-3 text-sm text-center text-gray-500 border-t border-gray-200 dark:text-gray-400 dark:border-gray-700">
                  {uploadedSongs.length} أغنية مرفوعة
                </div>
              )}

              {allSongs.length === 0 && (
                <div className="p-8 text-center">
                  <div className="mb-4 text-5xl">🎵</div>
                  <p className="text-gray-600 dark:text-gray-400">لم تقم بإضافة أي أغاني بعد</p>
                  <button
                    onClick={handleUpload}
                    className="flex items-center px-4 py-2 mx-auto mt-4 text-white bg-violet-500 rounded-full"
                  >
                    <Upload className="mr-2" size={16} />
                    رفع أغاني
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <div className="inline-block px-8 py-4 text-white bg-gradient-to-r from-violet-600 to-purple-600 rounded-full">
              <span className="text-lg font-bold">الموسيقى التي تصف رحلتنا معًا</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* تأثيرات الموجات الصوتية التفاعلية */}
      <div className="flex absolute right-0 bottom-0 left-0 z-0 gap-1 justify-center items-end h-24">
        {[...Array(24)].map((_, i) => (
          <motion.div
            key={i}
            className="w-3 bg-violet-400 rounded-t-lg dark:bg-purple-500"
            style={{ height: `${Math.random() * 20 + 10}px` }}
            animate={{
              height: [
                `${Math.random() * 20 + 10}px`,
                `${Math.random() * 60 + 20}px`,
                `${Math.random() * 40 + 10}px`,
              ],
            }}
            transition={{
              duration: 1.2 + Math.random() * 0.8,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.05
            }}
          />
        ))}
      </div>
    </div>
  );
}