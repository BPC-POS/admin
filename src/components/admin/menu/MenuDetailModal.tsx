import React from 'react';
import { Modal, Typography, Button } from 'antd';
import { MenuItem } from '@/types/menu';

interface MenuDetailModalProps {
  open: boolean;
  onClose: () => void;
  menuItem: MenuItem | null;
}

const MenuDetailModal: React.FC<MenuDetailModalProps> = ({ open, onClose, menuItem }) => {
  if (!menuItem) return null;

  return (
    <Modal
      title="Chi tiết Menu"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
    >
      <Typography.Title level={4}>{menuItem.name}</Typography.Title>
      <Typography.Paragraph>
        <strong>Mô tả:</strong> {menuItem.description}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <strong>Trạng thái:</strong> {menuItem.isActive ? 'Kích hoạt' : 'Không kích hoạt'}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <strong>Sản phẩm:</strong> {menuItem.products.join(', ')}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <strong>Thời gian phục vụ:</strong> {menuItem.timeAvailable ? `${menuItem.timeAvailable.start} - ${menuItem.timeAvailable.end}` : 'Không xác định'}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <strong>Ngày tạo:</strong> {menuItem.createdAt.toLocaleDateString()}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <strong>Ngày cập nhật:</strong> {menuItem.updatedAt.toLocaleDateString()}
      </Typography.Paragraph>
    </Modal>
  );
};

export default MenuDetailModal; 