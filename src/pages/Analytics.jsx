import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StoryViewer from '../components/analytics/StoryViewer';
import WordCloud from '../components/analytics/WordCloud';
import ActiveHoursChart from '../components/analytics/ActiveHoursChart';

export default function Analytics() {
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [showStories, setShowStories] = useState(false);

    useEffect(() => {
        // Load analytics data
        fetch('/analytics_results.json')
            .then(res => res.json())
            .then(data => setAnalytics(data))
            .catch(err => console.error('Failed to load analytics:', err));
    }, []);

    if (!analytics) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-red-900 flex items-center justify-center">
                <div className="text-white text-2xl">Loading analytics...</div>
            </div>
        );
    }

    const stories = [
        {
            component: (
                <div className="text-center text-white">
                    <h1 className="text-6xl font-bold mb-6">📊 تحليل المحادثات</h1>
                    <p className="text-2xl mb-4">رحلة عبر {analytics.totalMessages.toLocaleString()} رسالة</p>
                    <p className="text-xl text-white/70">من {analytics.dateRange.start} إلى {analytics.dateRange.end}</p>
                    <div className="mt-12 text-8xl animate-pulse">💕</div>
                </div>
            )
        },
        {
            component: <WordCloud words={analytics.topWords} />
        },
        {
            component: <ActiveHoursChart data={analytics.activeHours} />
        },
        {
            component: (
                <div className="text-center text-white">
                    <h1 className="text-5xl font-bold mb-8">🎉 النهاية</h1>
                    <p className="text-2xl mb-6">شفنا إزاي علاقتنا جميلة!</p>
                    <button
                        onClick={() => setShowStories(false)}
                        className="mt-8 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-xl font-bold hover:scale-110 transition"
                    >
                        رجوع للصفحة الرئيسية
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-red-900">
            {!showStories ? (
                <div className="flex items-center justify-center min-h-screen p-8">
                    <div className="text-center">
                        <h1 className="text-6xl font-bold text-white mb-6">📊 تحليلات المحادثة</h1>
                        <p className="text-2xl text-white/80 mb12">
                            اكتشف أسرار محادثاتنا معاً!
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-12">
                            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8">
                                <div className="text-5xl mb-4">💬</div>
                                <div className="text-4xl font-bold text-white">{analytics.totalMessages.toLocaleString()}</div>
                                <div className="text-white/70">رسالة</div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8">
                                <div className="text-5xl mb-4">⭐</div>
                                <div className="text-4xl font-bold text-white">{analytics.topWords[0]?.word}</div>
                                <div className="text-white/70">أكثر كلمة</div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8">
                                <div className="text-5xl mb-4">🌙</div>
                                <div className="text-4xl font-bold text-white">1 AM</div>
                                <div className="text-white/70">أنشط وقت</div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowStories(true)}
                            className="mt-8 px-12 py-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-2xl font-bold text-white hover:scale-110 transition shadow-2xl"
                        >
                            ابدأ الرحلة! 🚀
                        </button>
                    </div>
                </div>
            ) : (
                <StoryViewer
                    stories={stories}
                    onClose={() => {
                        setShowStories(false);
                        navigate('/');
                    }}
                />
            )}
        </div>
    );
}
