"use client";
import React, { useState, useEffect} from "react";
import SummaryCard from "@/components/admin/dashboard/SummaryCard";
import ChartCard from "@/components/admin/dashboard/ChartCard";
import TopProductsCard from "@/components/admin/dashboard/TopProductsCard";
import LowInventoryCard from "@/components/admin/dashboard/LowInventoryCard";
import { getOrder } from '@/api/order';
import { OrderAPI, SummaryData, ProductCount, ChartDataPoint, OrderStatusAPI } from "@/types/order";

const AdminDashboardPage: React.FC = () => {
  const [, setOrders] = useState<OrderAPI[]>([]);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);

  const [, setTodayRevenueChartData] = useState<ChartDataPoint[]>([]);
  const [monthlyRevenueChartData, setMonthlyRevenueChartData] = useState<ChartDataPoint[]>([]);
  const [totalRevenueChartData, setTotalRevenueChartData] = useState<ChartDataPoint[]>([]);

  const [todayOrderStatusChartData, setTodayOrderStatusChartData] = useState<ChartDataPoint[]>([]);
  const [monthlyOrderStatusChartData, setMonthlyOrderStatusChartData] = useState<ChartDataPoint[]>([]);
  const [totalOrderStatusChartData, setTotalOrderStatusChartData] = useState<ChartDataPoint[]>([]);


  const [topProducts, setTopProducts] = useState<ProductCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getOrder();
        const data: OrderAPI[] = response.data;
        setOrders(data);
        processDashboardData(data);
      } catch (err: unknown) {
        console.error("Failed to fetch orders:", err);
        setError(err instanceof Error ? err.message : "Lỗi khi tải dữ liệu đơn hàng.");
        setOrders([]);
        setSummaryData(null);
        setTodayRevenueChartData([]);
        setMonthlyRevenueChartData([]);
        setTotalRevenueChartData([]);
        setTodayOrderStatusChartData([]);
        setMonthlyOrderStatusChartData([]);
        setTotalOrderStatusChartData([]);
        setTopProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const processDashboardData = (fetchedOrders: OrderAPI[]) => {
    if (!fetchedOrders || fetchedOrders.length === 0) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const startOfMonth = new Date(today);
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    let calculatedTodayRevenue = 0;
    let calculatedTotalOrdersToday = 0;
    let calculatedPendingOrders = 0;
    let calculatedCompletedOrders = 0;

    const revenueByDay: { [key: string]: number } = {};
    const revenueByMonth: { [key: string]: number } = {};
    const totalRevenueOverTime: { [key: string]: number } = {};

    const todayOrderStatusCounts: { [key: number]: number } = {};
    const monthlyOrderStatusCounts: { [key: number]: number } = {};
    const totalOrderStatusCounts: { [key: number]: number } = {};

    const productCounts: { [productId: number]: { name: string, count: number } } = {};

    fetchedOrders.forEach(order => {
      const orderDate = new Date(order.createdAt || new Date());
      const orderDateString = orderDate.toISOString().split('T')[0];
      const orderMonthString = orderDate.toISOString().slice(0, 7); // YYYY-MM

      if (order.status !== OrderStatusAPI.CANCELLED) {
        const orderAmount = parseFloat((Number(order.total_amount).toString()) || '0');

        // Today Revenue and Orders
        if (orderDate >= today && orderDate < tomorrow) {
          calculatedTodayRevenue += orderAmount;
          calculatedTotalOrdersToday++;
          todayOrderStatusCounts[order.status] = (todayOrderStatusCounts[order.status] || 0) + 1;
        }
        // Monthly Revenue
        if (orderDate >= startOfMonth && orderDate < tomorrow) {
          revenueByMonth[orderMonthString] = (revenueByMonth[orderMonthString] || 0) + orderAmount;
          monthlyOrderStatusCounts[order.status] = (monthlyOrderStatusCounts[order.status] || 0) + 1;
        }

        // Total Revenue Over Time
        totalRevenueOverTime[orderDateString] = (totalRevenueOverTime[orderDateString] || 0) + orderAmount;
      }
      // Total Order Status Counts (All Time)
      totalOrderStatusCounts[order.status] = (totalOrderStatusCounts[order.status] || 0) + 1;


      if (order.status === OrderStatusAPI.PENDING) {
        calculatedPendingOrders++;
      }
      if (order.status === OrderStatusAPI.COMPLETED) {
        calculatedCompletedOrders++;
      }


      order.orderItems?.forEach(item => {
        if (item.product) {
          if (!productCounts[item.product_id]) {
            productCounts[item.product_id] = { name: item.product.name, count: 0 };
          }
          productCounts[item.product_id].count += item.quantity;
        }
      });
    });

    const monthlyRevenue = Object.values(revenueByMonth).reduce((sum, amount) => sum + amount, 0);
    setSummaryData({
      monthlyRevenue: monthlyRevenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
      todayRevenue: calculatedTodayRevenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
      totalOrdersToday: calculatedTotalOrdersToday,
      pendingOrders: calculatedPendingOrders,
      completedOrders: calculatedCompletedOrders,
    });

    // Revenue Chart Data
    const last7DaysRevenueData = Object.keys(totalRevenueOverTime)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        .slice(-7)
        .map(day => ({ date: day.split('-').slice(1).join('/'), revenue: totalRevenueOverTime[day] }));
    setTotalRevenueChartData(last7DaysRevenueData);

    const currentMonthRevenueData = Object.keys(revenueByMonth)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        .map(month => ({ month: month, revenue: revenueByMonth[month] })); // Consider formatting month label
    setMonthlyRevenueChartData(currentMonthRevenueData);

    const todayRevenueChart = Object.keys(revenueByDay)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        .slice(-1)
        .map(day => ({ date: day.split('-').slice(1).join('/'), revenue: revenueByDay[day] }));
    setTodayRevenueChartData(todayRevenueChart);


    const statusLabels: { [key: number]: string } = {
      [OrderStatusAPI.PENDING]: 'Chờ xử lý',
      [OrderStatusAPI.CONFIRMED]: 'Đã xác nhận',
      [OrderStatusAPI.PREPARING]: 'Đang pha chế',
      [OrderStatusAPI.READY]: 'Sẵn sàng phục vụ',
      [OrderStatusAPI.COMPLETED]: 'Hoàn thành',
      [OrderStatusAPI.CANCELLED]: 'Đã hủy',
    };

    const totalStatusChartFormattedData = Object.entries(totalOrderStatusCounts).map(([statusKey, count]) => ({
      status: statusLabels[parseInt(statusKey)] || `Status ${statusKey}`,
      count: count
    }));
    setTotalOrderStatusChartData(totalStatusChartFormattedData);
    console.log("statusChartFormattedData:", totalStatusChartFormattedData); 

     const monthlyStatusChartFormattedData = Object.entries(monthlyOrderStatusCounts).map(([statusKey, count]) => ({
      status: statusLabels[parseInt(statusKey)] || `Status ${statusKey}`,
      count: count
    }));
    setMonthlyOrderStatusChartData(monthlyStatusChartFormattedData);

     const todayStatusChartFormattedData = Object.entries(todayOrderStatusCounts).map(([statusKey, count]) => ({
      status: statusLabels[parseInt(statusKey)] || `Status ${statusKey}`,
      count: count
    }));
    setTodayOrderStatusChartData(todayStatusChartFormattedData);


    const productsArray = Object.entries(productCounts).map(([id, data]) => ({
      id: parseInt(id),
      name: data.name,
      count: data.count
    }));
    productsArray.sort((a, b) => b.count - a.count);
    setTopProducts(productsArray.slice(0, 5));
  };


  if (loading) {
    return <div className="min-h-screen bg-gradient-to-b from-[#2C3E50] to-[#3498DB] flex justify-center items-center text-white text-xl">Đang tải dữ liệu dashboard...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gradient-to-b from-[#2C3E50] to-[#3498DB] flex justify-center items-center text-red-400 text-xl">Lỗi tải dữ liệu: {error}</div>;
  }

  if (!summaryData) {
    return <div className="min-h-screen bg-gradient-to-b from-[#2C3E50] to-[#3498DB] flex justify-center items-center text-white text-xl">Không có dữ liệu đơn hàng để hiển thị.</div>;
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2C3E50] to-[#3498DB] font-poppins">
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-bold mb-4 font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 text-5xl">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <SummaryCard title="Doanh thu hôm nay" value={summaryData.todayRevenue} />
          <SummaryCard title="Tổng đơn hàng" value={summaryData.totalOrdersToday.toString()} />
          <SummaryCard title="Đơn hàng chờ" value={summaryData.pendingOrders.toString()} />
          <SummaryCard title="Đã hoàn thành" value={summaryData.completedOrders.toString()} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      
          <ChartCard
              title="Doanh thu tháng này"
              data={monthlyRevenueChartData}
              xAxisDataKey="month"
              lineDataKey="revenue"
              chartType="line"
          />
           <ChartCard
              title="Doanh thu (7 ngày gần nhất)"
              data={totalRevenueChartData}
              xAxisDataKey="date"
              lineDataKey="revenue"
              chartType="line"
          />
           <ChartCard
              title="Tỷ lệ trạng thái đơn hàng hôm nay"
              data={todayOrderStatusChartData}
              xAxisDataKey="status"
              pieDataKey="count"
              chartType="pie"
          />
           <ChartCard
              title="Tỷ lệ trạng thái đơn hàng tháng này"
              data={monthlyOrderStatusChartData}
              xAxisDataKey="status"
              pieDataKey="count"
              chartType="pie"
          />
          <ChartCard
              title="Tỷ lệ trạng thái đơn hàng (Tổng)"
              data={totalOrderStatusChartData}
              xAxisDataKey="status"
              pieDataKey="count"
              chartType="pie"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TopProductsCard
            title="Sản phẩm bán chạy nhất (Top 5)"
            products={topProducts}
          />
          <LowInventoryCard title="Sản phẩm sắp hết hàng (Cần Products)" products={[]} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;