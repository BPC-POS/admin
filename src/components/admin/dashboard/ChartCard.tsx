import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';

type ChartDataPoint = {
    [key: string]: string | number | Date;
};

interface ChartCardProps {
    title: string;
    data: ChartDataPoint[];
    xAxisDataKey: string;
    lineDataKey?: string;
    barDataKey?: string;
    pieDataKey?: string;
    chartType?: 'line' | 'bar' | 'pie';
    yAxisLabel?: string;
    xAxisLabel?: string;
    lineStrokeColor?: string;
    barFillColor?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({
    title,
    data,
    xAxisDataKey,
    lineDataKey,
    barDataKey,
    pieDataKey,
    chartType = 'line',
    yAxisLabel,
    xAxisLabel,
    lineStrokeColor = '#8884d8',
    barFillColor = '#82ca9d',
}) => {

    const pieChartColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A0522D', '#228B22', '#4682B4', '#DA70D6'];

    if (!data || data.length === 0) {
        return (
            <div className="bg-white p-4 rounded shadow flex items-center justify-center h-[300px]">
                <p className="text-gray-500">Không có dữ liệu để hiển thị biểu đồ</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">{title}</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    {chartType === 'line' && lineDataKey ? (
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={xAxisDataKey} label={{ value: xAxisLabel || xAxisDataKey, position: 'bottom', offset: 0 }} />
                            <YAxis label={{ value: yAxisLabel || lineDataKey, angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey={lineDataKey} stroke={lineStrokeColor} strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    ) : chartType === 'bar' && barDataKey ? (
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={xAxisDataKey} label={{ value: xAxisLabel || xAxisDataKey, position: 'bottom', offset: 0 }} />
                            <YAxis label={{ value: yAxisLabel || barDataKey, angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey={barDataKey} fill={barFillColor} />
                        </BarChart>
                    ) : chartType === 'pie' && pieDataKey ? (
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                dataKey={pieDataKey}
                                nameKey={xAxisDataKey}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={pieChartColors[index % pieChartColors.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend layout="vertical" align="right" verticalAlign="middle"/>
                        </PieChart>
                    ) : (
                        <p className="text-red-500 text-center py-4">
                        Loại biểu đồ &apos;{chartType}&apos; không được hỗ trợ hoặc thiếu cấu hình dữ liệu.
                        </p>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ChartCard;