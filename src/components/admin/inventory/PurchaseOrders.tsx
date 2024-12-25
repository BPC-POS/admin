import React from 'react';
import { Table, Button, Tag, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { InventoryItem } from '@/types/inventory';

interface PurchaseOrder {
  id: number;
  orderNumber: string;
  supplier: string;
  items: {
    item: InventoryItem;
    quantity: number;
    unitPrice: number;
  }[];
  status: 'pending' | 'approved' | 'delivered' | 'cancelled';
  orderDate: Date;
  expectedDeliveryDate: Date;
}

interface PurchaseOrdersProps {
  inventory: InventoryItem[];
}

const PurchaseOrders: React.FC<PurchaseOrdersProps> = ({ inventory }) => {
  // Mock data - replace with actual data later
  const mockPurchaseOrders: PurchaseOrder[] = [
    {
      id: 1,
      orderNumber: 'PO-2024-001',
      supplier: 'Nhà cung cấp cà phê A',
      items: [
        {
          item: inventory[0],
          quantity: 50,
          unitPrice: 250000,
        },
      ],
      status: 'pending',
      orderDate: new Date(),
      expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  ];

  const columns = [
    {
      title: 'Mã ��ơn hàng',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'supplier',
      key: 'supplier',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: PurchaseOrder['status']) => {
        const colors = {
          pending: 'gold',
          approved: 'blue',
          delivered: 'green',
          cancelled: 'red',
        };
        const labels = {
          pending: 'Chờ duyệt',
          approved: 'Đã duyệt',
          delivered: 'Đã nhận',
          cancelled: 'Đã hủy',
        };
        return (
          <Tag color={colors[status]}>
            {labels[status]}
          </Tag>
        );
      },
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date: Date) => date.toLocaleDateString('vi-VN'),
    },
    {
      title: 'Ngày nhận dự kiến',
      dataIndex: 'expectedDeliveryDate',
      key: 'expectedDeliveryDate',
      render: (date: Date) => date.toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: PurchaseOrder) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            type="primary"
          >
            Sửa
          </Button>
          <Button 
            icon={<DeleteOutlined />} 
            danger
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="font-poppins">
      <Table 
        columns={columns} 
        dataSource={mockPurchaseOrders}
        rowKey="id"
        className="shadow-sm rounded-lg"
      />
    </div>
  );
};

export default PurchaseOrders; 