import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ActiveHoursChart({ data }) {
    // Convert {`"00": 20220, "01": 22063, ...} to array format
    const chartData = Object.entries(data).map(([hour, count]) => ({
        hour: `${hour}:00`,
        messages: count,
        hourNum: parseInt(hour)
    }));

    // Color based on activity level
    const getColor = (count) => {
        if (count > 15000) return '#ff6b6b'; // Very active
        if (count > 10000) return '#ffd93d'; // Active
        if (count > 5000) return '#6bcf7f'; // Moderate
        return '#4dabf7'; // Low
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-2">⏰ أنشط الساعات</h2>
                <p className="text-xl text-white/70">متى بنتكلم أكتر؟</p>
            </div>

            <div className="w-full max-w-4xl h-96 bg-white/10 backdrop-blur-lg rounded-3xl p-6">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <XAxis
                            dataKey="hour"
                            stroke="#fff"
                            tick={{ fill: '#fff', fontSize: 12 }}
                        />
                        <YAxis
                            stroke="#fff"
                            tick={{ fill: '#fff', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                background: 'rgba(0,0,0,0.8)',
                                border: 'none',
                                borderRadius: '12px',
                                color: '#fff'
                            }}
                            formatter={(value) => [`${value} رسالة`, 'الرسائل']}
                        />
                        <Bar dataKey="messages" radius={[8, 8, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getColor(entry.messages)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 text-center">
                <p className="text-white/60 text-sm">
                    أقصى نشاط في الساعة {chartData.sort((a, b) => b.messages - a.messages)[0].hour}
                </p>
            </div>
        </div>
    );
}
