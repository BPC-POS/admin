import { Product, ProductStatus } from "@/types/product";
import test from '../../public/assets/images/tet.png'

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Cà phê đen',
    price: 25000,
    image: test.src,
    category: 'coffee',
    description: 'Cà phê đen đậm đà hương vị Việt Nam',
    status: ProductStatus.ACTIVE,
    size: [
      { name: 'S', price: 0, isDefault: true },
      { name: 'M', price: 5000, isDefault: false },
      { name: 'L', price: 10000, isDefault: false }
    ],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    name: 'Trà đào',
    price: 30000,
    image: test.src,
    category: 'tea',
    description: 'Trà đào thơm ngon',
    status: ProductStatus.ACTIVE,
      size: [
          { name: 'S', price: 0, isDefault: true },
          { name: 'M', price: 5000, isDefault: false },
          { name: 'L', price: 10000, isDefault: false }
      ],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    name: 'Trà sữa trân châu',
    price: 35000,
    image: test.src,
    category: 'milktea',
    description: 'Trà sữa trân châu béo ngậy',
      status: ProductStatus.ACTIVE,
      size: [
          { name: 'S', price: 0, isDefault: true },
          { name: 'M', price: 5000, isDefault: false },
          { name: 'L', price: 10000, isDefault: false }
      ],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
      id: 4,
      name: 'Sinh tố bơ',
      price: 40000,
      image: test.src,
      category: 'smoothie',
      description: 'Sinh tố bơ thơm ngon bổ dưỡng',
      status: ProductStatus.ACTIVE,
        size: [
            { name: 'S', price: 0, isDefault: true },
            { name: 'M', price: 5000, isDefault: false },
            { name: 'L', price: 10000, isDefault: false }
        ],
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date()
  },
  {
      id: 5,
      name: 'Cà phê sữa đá',
      price: 30000,
      image: test.src,
      category: 'coffee',
      description: 'Cà phê sữa đá Việt Nam',
      status: ProductStatus.ACTIVE,
      size: [
        { name: 'S', price: 0, isDefault: true },
        { name: 'M', price: 5000, isDefault: false },
        { name: 'L', price: 10000, isDefault: false }
      ],
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date()
  },
  {
      id: 6,
      name: 'Trà tắc',
      price: 25000,
      image: test.src,
      category: 'tea',
      description: 'Trà tắc giải khát',
      status: ProductStatus.ACTIVE,
      size: [
        { name: 'S', price: 0, isDefault: true },
        { name: 'M', price: 5000, isDefault: false },
        { name: 'L', price: 10000, isDefault: false }
      ],
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date()
  },
    {
        id: 7,
        name: 'Trà sữa matcha',
        price: 40000,
        image: test.src,
        category: 'milktea',
        description: 'Trà sữa matcha thơm ngon',
        status: ProductStatus.ACTIVE,
        size: [
            { name: 'S', price: 0, isDefault: true },
            { name: 'M', price: 5000, isDefault: false },
            { name: 'L', price: 10000, isDefault: false }
        ],
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 8,
        name: 'Sinh tố xoài',
        price: 35000,
        image: test.src,
        category: 'smoothie',
        description: 'Sinh tố xoài thơm ngon',
        status: ProductStatus.ACTIVE,
        size: [
            { name: 'S', price: 0, isDefault: true },
            { name: 'M', price: 5000, isDefault: false },
            { name: 'L', price: 10000, isDefault: false }
        ],
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
];

export default mockProducts;