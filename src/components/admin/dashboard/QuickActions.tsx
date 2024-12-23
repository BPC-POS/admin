import React from 'react';
import Button from "@/components/ui/Button"
import { Add, ShoppingCart, List, Warehouse } from "@mui/icons-material";


const QuickActions: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Hành động nhanh</h3>
      <div className="flex flex-wrap gap-2">
        <Button variant="outlined" startIcon={<Add/>} className="flex-1 text-black" >Tạo đơn hàng mới</Button>
         <Button variant="outlined" startIcon={<List/>} className="flex-1 text-black">Quản lý sản phẩm</Button>
        <Button variant="outlined" startIcon={<ShoppingCart/>} className="flex-1 text-black">Quản lý đơn hàng</Button>
         <Button variant="outlined" startIcon={<Warehouse/>} className="flex-1 text-black">Nhập kho</Button>
      </div>
    </div>
  );
};

export default QuickActions;