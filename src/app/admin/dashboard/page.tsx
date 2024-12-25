"use client";
import React from "react";
import SummaryCard from "@/components/admin/dashboard/SummaryCard";
import ChartCard from "@/components/admin/dashboard/ChartCard";
import TopProductsCard from "@/components/admin/dashboard/TopProductsCard";
import LowInventoryCard from "@/components/admin/dashboard/LowInventoryCard";
import QuickActions from "@/components/admin/dashboard/QuickActions";

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2C3E50] to-[#3498DB] font-poppins">
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-bold mb-4 font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 text-5xl">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <SummaryCard title="Doanh thu hôm nay" value="$1234" />
          <SummaryCard title="Tổng đơn hàng" value="50" />
          <SummaryCard title="Đơn hàng chờ" value="5" />
          <SummaryCard title="Đã hoàn thành" value="45" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ChartCard title="Doanh thu theo thời gian" />
          <ChartCard title="Tỷ lệ đơn hàng" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TopProductsCard/>
          <LowInventoryCard />
        </div>
        <QuickActions />
      </div>
    </div>
  );
};

export default AdminDashboardPage;