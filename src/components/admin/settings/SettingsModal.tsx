import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch, Button } from 'antd';
import { Setting } from '@/types/settings';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (setting: Setting) => void;
  editSetting: Setting | null;
}

// Định nghĩa interface cho kiểu dữ liệu form values
interface SettingsFormValues {
  name: string;
  description: string;
  isActive: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  onClose,
  onSubmit,
  editSetting,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editSetting) {
      form.setFieldsValue(editSetting);
    } else {
      form.resetFields();
    }
  }, [editSetting, form]);

  // Sử dụng interface SettingsFormValues cho tham số values
  const handleFinish = (values: SettingsFormValues) => {
    onSubmit({ ...values, id: editSetting ? editSetting.id : Date.now() });
    form.resetFields();
  };

  return (
    <Modal
      title={editSetting ? 'Sửa cài đặt' : 'Thêm cài đặt mới'}
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Tên cài đặt"
          rules={[{ required: true, message: 'Vui lòng nhập tên cài đặt' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
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
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SettingsModal;