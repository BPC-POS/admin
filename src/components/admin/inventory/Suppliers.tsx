import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Switch } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  isActive: boolean;
}

const Suppliers: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // Mock data - replace with actual data later
  const [suppliers] = useState<Supplier[]>([
    {
      id: 1,
      name: 'Công ty TNHH Cà phê A',
      contactPerson: 'Nguyễn Văn A',
      phone: '0901234567',
      email: 'contact@suppliera.com',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      isActive: true,
    },
  ]);

  const columns = [
    {
      title: 'Tên nhà cung cấp',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Người liên hệ',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Switch checked={isActive} disabled />
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Supplier) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="primary"
            onClick={() => {
              setEditingSupplier(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
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
      <div className="mb-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingSupplier(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Thêm nhà cung cấp
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={suppliers}
        rowKey="id"
        className="shadow-sm rounded-lg"
      />

      <Modal
        title={editingSupplier ? "Sửa nhà cung cấp" : "Thêm nhà cung cấp"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => {
          form.validateFields()
            .then(values => {
              console.log(values);
              setIsModalVisible(false);
            })
            .catch(info => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên nhà cung cấp"
            rules={[{ required: true, message: 'Vui lòng nhập tên nhà cung cấp' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="contactPerson"
            label="Người liên hệ"
            rules={[{ required: true, message: 'Vui lòng nhập tên người liên hệ' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Trạng thái"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Suppliers; 