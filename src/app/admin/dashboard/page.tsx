"use client";
import React from "react";
import SummaryCard from "@/components/admin/dashboard/SummaryCard";
import ChartCard from "@/components/admin/dashboard/ChartCard";
import TopProductsCard from "@/components/admin/dashboard/TopProductsCard";
import LowInventoryCard from "@/components/admin/dashboard/LowInventoryCard";
import QuickActions from "@/components/admin/dashboard/QuickActions";


const AdminDashboardPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <SummaryCard title="Doanh thu hôm nay" value="$1234" />
        <SummaryCard title="Tổng đơn hàng" value="50" />
        <SummaryCard title="Đơn hàng chờ" value="5" />
        <SummaryCard title="Đã hoàn thành" value="45" />
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
         <ChartCard title="Doanh thu theo thời gian" />
         <ChartCard title="Tỷ lệ đơn hàng" />
       </div>
       <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <TopProductsCard/>
           <LowInventoryCard />
       </div>
      <QuickActions />
    </div>
  );
};

export default AdminDashboardPage;