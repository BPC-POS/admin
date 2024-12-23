import React from 'react';

interface TopProductsCardProps {
  title?: string; // Optional title
    products?: {name: string, count: number}[]
}

const TopProductsCard: React.FC<TopProductsCardProps> = ({title = "Sản phẩm bán chạy nhất", products = [
    {name: 'Cafe den', count: 50},
    {name: 'Cafe sua', count: 45},
    {name: 'Tra dao', count: 40},
    {name: 'Banh mi', count: 35},
    {name: 'Banh ngot', count: 30}
]}) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">{title}</h3>
      <ul className="product-list">
        {products.map((product, index) => (
          <li key={index} className="product-item flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
            <span className="product-name text-gray-800">{product.name}</span>
            <span className="product-count font-semibold text-gray-600">{product.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopProductsCard;