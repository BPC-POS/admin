import { Product, ProductStatus, Size } from '@/types/product';

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Cà phê đen',
    price: 25000,
    image: '/images/products/coffee-black.jpg',
    category: 'Cà phê',
    description: 'Cà phê đen đậm đà hương vị Việt Nam',
    status: ProductStatus.ACTIVE,
    size: [
      { name: 'S', price: 0, isDefault: true },
      { name: 'M', price: 5000, isDefault: false },
      { name: 'L', price: 10000, isDefault: false }
    ],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: 'Trà sữa',
    price: 30000,
    image: '/images/products/tea-milk.jpg',
    category: 'Trà',
    description: 'Trà sữa thơm ngon, béo ngậy',
    status: ProductStatus.ACTIVE,
    size: [
      { name: 'S', price: 0, isDefault: true },
      { name: 'M', price: 5000, isDefault: false },
      { name: 'L', price: 10000, isDefault: false }
    ],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: 'Nước chanh',
    price: 15000,
    image: '/images/products/lemonade.jpg',
    category: 'Nước giải khát',
    description: 'Nước chanh tươi mát, giải khát mùa hè',
    status: ProductStatus.ACTIVE,
    size: [
      { name: 'S', price: 0, isDefault: true },
      { name: 'M', price: 5000, isDefault: false },
      { name: 'L', price: 10000, isDefault: false }
    ],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    name: 'Bánh mì thịt',
    price: 20000,
    image: '/images/products/banh-mi.jpg',
    category: 'Đồ ăn',
    description: 'Bánh mì thịt với hương vị đặc trưng',
    status: ProductStatus.ACTIVE,
    size: [
      { name: 'S', price: 0, isDefault: true },
      { name: 'M', price: 5000, isDefault: false },
      { name: 'L', price: 10000, isDefault: false }
    ],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 5,
    name: 'Pizza',
    price: 80000,
    image: '/images/products/pizza.jpg',
    category: 'Đồ ăn',
    description: 'Pizza phô mai thơm ngon, hấp dẫn',
    status: ProductStatus.ACTIVE,
    size: [
      { name: 'M', price: 0, isDefault: true },
      { name: 'L', price: 10000, isDefault: false }
    ],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 6,
    name: 'Sinh tố bơ',
    price: 35000,
    image: '/images/products/avocado-smoothie.jpg',
    category: 'Sinh tố',
    description: 'Sinh tố bơ mịn màng, bổ dưỡng',
    status: ProductStatus.ACTIVE,
    size: [
      { name: 'S', price: 0, isDefault: true },
      { name: 'M', price: 5000, isDefault: false },
      { name: 'L', price: 10000, isDefault: false }
    ],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 7,
    name: 'Trà đào',
    price: 25000,
    image: '/images/products/peach-tea.jpg',
    category: 'Trà',
    description: 'Trà đào thơm ngon, ngọt ngào',
    status: ProductStatus.ACTIVE,
    size: [
      { name: 'S', price: 0, isDefault: true },
      { name: 'M', price: 5000, isDefault: false },
      { name: 'L', price: 10000, isDefault: false }
    ],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 8,
    name: 'Mì Ý',
    price: 60000,
    image: '/images/products/spaghetti.jpg',
    category: 'Đồ ăn',
    description: 'Mì Ý sốt cà chua, thơm ngon',
    status: ProductStatus.ACTIVE,
    size: [
      { name: 'M', price: 0, isDefault: true },
      { name: 'L', price: 10000, isDefault: false }
    ],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default mockProducts;