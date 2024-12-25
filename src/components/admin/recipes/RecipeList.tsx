import React from 'react';
import { Table, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Recipe {
  id: number;
  name: string;
  type: 'drink' | 'food';
  ingredients: {
    name: string;
    amount: number;
    unit: string;
  }[];
  instructions: string;
}

interface RecipeListProps {
  recipes: Recipe[];
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: number) => void;
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'Tên công thức',
      dataIndex: 'name',
      key: 'name',
      className: 'text-base font-poppins font-medium text-gray-800',
    },
    {
      title: 'Nguyên liệu',
      dataIndex: 'ingredients',
      key: 'ingredients',
      className: 'text-base font-poppins',
      render: (ingredients: Recipe['ingredients']) => (
        <ul className="list-none space-y-1.5">
          {ingredients.map((ingredient, index) => (
            <li key={index} className="text-gray-600 font-poppins flex items-center before:content-['•'] before:mr-2 before:text-blue-500">
              <span className="font-medium">{ingredient.name}:</span>
              <span className="ml-1">{ingredient.amount} {ingredient.unit}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Hướng dẫn',
      dataIndex: 'instructions',
      key: 'instructions',
      className: 'text-base text-gray-600 font-poppins whitespace-pre-line',
    },
    {
      title: 'Thao tác',
      key: 'action',
      className: 'text-base font-poppins',
      render: (_: unknown, record: Recipe) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />}
            type="primary"
            onClick={() => onEdit(record)}
            className="flex items-center font-poppins hover:opacity-90 transition-opacity"
          >
            Sửa
          </Button>
          <Button 
            icon={<DeleteOutlined />}
            danger
            onClick={() => onDelete(record.id)}
            className="flex items-center font-poppins hover:opacity-90 transition-opacity"
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-poppins">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-gray-100 p-1 rounded-lg mb-4">
          <TabsTrigger value="all" className="font-poppins text-base px-6 py-2 rounded-md data-[state=active]:bg-black data-[state=active]:shadow-sm transition-all">
            Tất cả công thức
          </TabsTrigger>
          <TabsTrigger value="drinks" className="font-poppins text-base px-6 py-2 rounded-md data-[state=active]:bg-black data-[state=active]:shadow-sm transition-all">
            Đồ uống
          </TabsTrigger>
          <TabsTrigger value="food" className="font-poppins text-base px-6 py-2 rounded-md data-[state=active]:bg-black data-[state=active]:shadow-sm transition-all">
            Đồ ăn
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Table 
            columns={columns} 
            dataSource={recipes} 
            rowKey="id"
            className="border rounded-lg shadow-sm"
            pagination={{
              pageSize: 10,
              className: "flex justify-end font-poppins"
            }}
          />
        </TabsContent>
        <TabsContent value="drinks">
          <Table 
            columns={columns} 
            dataSource={recipes.filter(r => r.type === 'drink')} 
            rowKey="id"
            className="border rounded-lg shadow-sm"
            pagination={{
              pageSize: 10,
              className: "flex justify-end font-poppins"
            }}
          />
        </TabsContent>
        <TabsContent value="food">
          <Table 
            columns={columns} 
            dataSource={recipes.filter(r => r.type === 'food')} 
            rowKey="id"
            className="border rounded-lg shadow-sm"
            pagination={{
              pageSize: 10,
              className: "flex justify-end font-poppins"
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecipeList;