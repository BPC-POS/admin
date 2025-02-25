import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Space, InputNumber, Select } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Recipe } from '@/types/recipe';

interface RecipeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (recipe: Recipe) => void;
  editRecipe?: Recipe | null;
}

const RecipeModal: React.FC<RecipeModalProps> = ({
  open,
  onClose,
  onSubmit,
  editRecipe
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editRecipe) {
      form.setFieldsValue(editRecipe);
    } else {
      form.resetFields();
    }
  }, [editRecipe, form]);

  interface RecipeFormValues {
    name: string;
    type: 'drink' | 'food';
    ingredients: Array<{
      name: string;
      amount: number;
      unit: 'ml' | 'g' | 'piece';
    }>;
    instructions: string;
  }

  const handleSubmit = (values: RecipeFormValues): void => {
    onSubmit({
      ...values,
      id: editRecipe?.id || 0,
      type: values.type || 'drink'
    });
    form.resetFields();
  };

  return (
    <Modal
      title={
        <span className="text-xl font-poppins font-semibold text-gray-800">
          {editRecipe ? "Sửa công thức" : "Thêm công thức mới"}
        </span>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      className="font-poppins"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="font-poppins"
      >
        <Form.Item
          name="name"
          label={<span className="font-poppins text-gray-700">Tên công thức</span>}
          rules={[{ required: true, message: 'Vui lòng nhập tên công thức' }]}
        >
          <Input className="font-poppins rounded-md" />
        </Form.Item>

        <Form.Item
          name="type"
          label={<span className="font-poppins text-gray-700">Loại</span>}
          rules={[{ required: true, message: 'Vui lòng chọn loại' }]}
        >
          <Select
            className="font-poppins rounded-md"
            options={[
              { value: 'drink', label: 'Đồ uống' },
              { value: 'food', label: 'Đồ ăn' },
            ]}
          />
        </Form.Item>

        <Form.List name="ingredients">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} align="baseline" className="w-full">
                  <Form.Item
                    {...restField}
                    name={[name, 'name']}
                    rules={[{ required: true, message: 'Thiếu tên nguyên liệu' }]}
                    className="flex-1"
                  >
                    <Input placeholder="Tên nguyên liệu" className="font-poppins rounded-md" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'amount']}
                    rules={[{ required: true, message: 'Thiếu số lượng' }]}
                  >
                    <InputNumber placeholder="Số lượng" className="font-poppins rounded-md" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'unit']}
                    rules={[{ required: true, message: 'Thiếu đơn vị' }]}
                  >
                    <Select
                      placeholder="Đơn vị"
                      className="font-poppins rounded-md w-32"
                      options={[
                        { value: 'ml', label: 'ml' },
                        { value: 'g', label: 'g' },
                        { value: 'piece', label: 'cái' },
                      ]}
                    />
                  </Form.Item>
                  <MinusCircleOutlined 
                    onClick={() => remove(name)} 
                    className="text-red-500 hover:text-red-700 text-lg cursor-pointer transition-colors"
                  />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  className="font-poppins hover:border-blue-500 hover:text-blue-500 transition-colors"
                >
                  Thêm nguyên liệu
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item
          name="instructions"
          label={<span className="font-poppins text-gray-700">Hướng dẫn</span>}
          rules={[{ required: true, message: 'Vui lòng nhập hướng dẫn' }]}
        >
          <Input.TextArea 
            rows={4} 
            className="font-poppins rounded-md"
            placeholder="Nhập hướng dẫn chi tiết cho công thức..."
          />
        </Form.Item>

        <Form.Item className="flex justify-end mb-0">
          <Space>
            <Button 
              onClick={onClose}
              className="font-poppins hover:bg-gray-100 transition-colors"
            >
              Hủy
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              className="font-poppins bg-blue-500 hover:bg-blue-600 transition-colors"
            >
              {editRecipe ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RecipeModal;