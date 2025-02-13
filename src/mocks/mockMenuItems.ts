import { MenuItem, MenuType, WeekDay } from "@/types/menu";

const mockMenuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Menu chính',
    description: 'Các món bán chạy nhất',
    image: '/images/menu/main-menu.jpg',
    isActive: true,
    sortOrder: 0,
    type: MenuType.REGULAR,
    products: [1, 2, 3],
    timeAvailable: {
      start: '07:00',
      end: '22:00'
    },
    daysAvailable: [
      WeekDay.MONDAY,
      WeekDay.TUESDAY,
      WeekDay.WEDNESDAY,
      WeekDay.THURSDAY,
      WeekDay.FRIDAY,
      WeekDay.SATURDAY,
      WeekDay.SUNDAY
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: 'Menu sáng',
    description: 'Các món ăn sáng',
    image: '/images/menu/breakfast-menu.jpg',
    isActive: true,
    sortOrder: 1,
    type: MenuType.BREAKFAST,
    products: [4, 5, 6],
    timeAvailable: {
      start: '06:00',
      end: '10:00'
    },
    daysAvailable: [
      WeekDay.MONDAY,
      WeekDay.TUESDAY,
      WeekDay.WEDNESDAY,
      WeekDay.THURSDAY,
      WeekDay.FRIDAY
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Thêm các menu items khác
];

export default mockMenuItems;