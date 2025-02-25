import React from 'react';
import { Form, Input, Select, Button } from 'antd';

// interface RecipeFormProps {
//   recipes: Recipe[];
// }

const RecipeForm: React.FC = ({ }) => {
  return (
    <Form layout="vertical">
      <Form.Item label="Tên công thức" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      
      <Form.Item label="Loại" name="type" rules={[{ required: true }]}>
        <Select>
          <Select.Option value="drink">Đồ uống</Select.Option>
          <Select.Option value="food">Đồ ăn</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="Nguyên liệu" name="ingredients" rules={[{ required: true }]}>
        <Input.TextArea />
      </Form.Item>

      <Form.Item label="Hướng dẫn" name="instructions" rules={[{ required: true }]}>
        <Input.TextArea />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Lưu công thức
      </Button>
    </Form>
  );
};

export default RecipeForm; 