// app/admin/components/dashboard/ChartCard.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartCardProps {
    title: string;
    chartType?: 'line' | 'bar' | 'pie'
}

const ChartCard: React.FC<ChartCardProps> = ({ title, chartType = 'line' }) => {
    const data = [
        { name: 'Mon', value: 200 },
        { name: 'Tue', value: 300 },
        { name: 'Wed', value: 150 },
        { name: 'Thu', value: 400 },
        { name: 'Fri', value: 250 },
        { name: 'Sat', value: 500 },
        { name: 'Sun', value: 350 },
    ];

    return (
        <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">{title}</h3>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    {chartType === 'line' ? (
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" />
                        </LineChart>
                    ) : <></> }
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ChartCard;