"use client"
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer} from "recharts";
import Card from "@/src/component/ui/card";
type DashBoardData = {
    totalProducts: number,
    totalActive: number,
    totalOutOfStock: number, 
    productByCategory: {
        _id: string,
        count: number,
    }[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Dashboard() {
    const [data, setData] = useState<DashBoardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/dashboard")
            .then((res) => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch dashboard data:", err);
                setLoading(false);
            });
    }, []); 

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                <p className="text-gray-600 font-medium">Loading dashboard...</p>
            </div>
        </div>
    );

    if (!data) return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <p className="text-gray-600 font-medium">Failed to load dashboard data</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
                    <p className="text-gray-600">Welcome back! Here's your product overview.</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                    <Card 
                        title="Total Products" 
                        value={data.totalProducts}
                    />
                    <Card 
                        title="Active Products" 
                        value={data.totalActive}
                    />
                    <Card 
                        title="Out of Stock" 
                        value={data.totalOutOfStock}
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1  gap-6">
                    {/* Category Chart */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Products by Category</h2>
                        {data.productByCategory.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart 
                                    data={data.productByCategory}
                                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                                >
                                    <XAxis 
                                        dataKey="_id" 
                                        stroke="#9ca3af"
                                        style={{ fontSize: '12px' }}
                                    />
                                    <YAxis 
                                        stroke="#9ca3af"
                                        style={{ fontSize: '12px' }}
                                    />
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px'
                                        }}
                                        formatter={(value) => [`${value} products`, 'Count']}
                                    />
                                    <Bar 
                                        dataKey="count" 
                                        fill="#3b82f6"
                                        radius={[8, 8, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                                <p className="text-gray-500">No category data available</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary Stats */}
                {/* <div className="mt-8 bg-white rounded-xl shadow-md border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Summary</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                            <div className="bg-blue-600 text-white p-3 rounded-lg">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 4H3z"></path>
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">Average Stock</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {Math.round(data.productByCategory.reduce((sum, cat) => sum + cat.count, 0) / Math.max(data.productByCategory.length, 1))}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                            <div className="bg-green-600 text-white p-3 rounded-lg">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">Active Rate</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {data.totalProducts > 0 ? Math.round((data.totalActive / data.totalProducts) * 100) : 0}%
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg">
                            <div className="bg-yellow-600 text-white p-3 rounded-lg">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
                                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"></path>
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">Categories</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {data.productByCategory.length}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-red-50 rounded-lg">
                            <div className="bg-red-600 text-white p-3 rounded-lg">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M13.477 14.89A6 6 0 0B5.11 13.477a6 6 0 004.472 3.656c.866-.023 1.718-.15 2.532-.386a6.003 6.003 0 001.362-2.857zM18.364 5.364L9.172 14.556a4 4 0 01-5.656-5.656l9.193-9.193a1 1 0 111.415 1.414L4.93 9.314a2 2 0 102.828 2.828l8.38-8.379a1 1 0 111.414 1.414z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">Stock Issues</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {data.totalOutOfStock}
                                </p>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    )
}