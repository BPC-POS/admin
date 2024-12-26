import React from 'react';
import { Table, Button, Space } from 'antd';
import { Setting } from '@/types/settings';

interface SettingsListProps {
  settings: Setting[];
  onEdit: (setting: Setting) => void;
}

const SettingsList: React.FC<SettingsListProps> = ({ settings, onEdit }) => {
  const columns = [
    {
      title: 'Tên cài đặt',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (isActive ? 'Kích hoạt' : 'Không kích hoạt'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Setting) => (
        <Space>
          <Button onClick={() => onEdit(record)}>Sửa</Button>
        </Space>
      ),
    },
  ];

  return <Table columns={columns} dataSource={settings} rowKey="id" />;
};

export default SettingsList; 