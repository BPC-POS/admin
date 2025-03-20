// import { Order, OrderStatus, PaymentStatus } from "@/types/order";

// const mockOrders: Order[] = [
//     {
//       id: 1,
//       orderNumber: 'ORD001',
//       customerName: 'Nguyễn Văn A', 
//       customerPhone: '0123456789',
//       tableId: 1,
//       items: [
//         {
//           id: 1,
//           productId: 1,
//           productName: 'Cà phê sữa',
//           quantity: 2,
//           price: 29000,
//           note: 'Ít đường'
//         },
//         {
//           id: 2,
//           productId: 2,
//           productName: 'Bánh mì',
//           quantity: 1,
//           price: 15000
//         }
//       ],
//       status: OrderStatus.PENDING,
//       paymentStatus: PaymentStatus.UNPAID,
//       totalAmount: 73000,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     },
//     {
//       id: 2,
//       orderNumber: 'ORD002',
//       customerName: 'Trần Thị B',
//       customerPhone: '0987654321', 
//       tableId: 3,
//       items: [
//         {
//           id: 3,
//           productId: 3,
//           productName: 'Trà sữa trân châu',
//           quantity: 3,
//           price: 35000
//         }
//       ],
//       status: OrderStatus.PREPARING,
//       paymentStatus: PaymentStatus.PARTIALLY_PAID,
//       totalAmount: 105000,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     },
//     {
//       id: 3,
//       orderNumber: 'ORD003',
//       customerName: 'Lê Văn C',
//       customerPhone: '0909123456',
//       tableId: 5,
//       items: [
//         {
//           id: 4,
//           productId: 4,
//           productName: 'Cà phê đen',
//           quantity: 1,
//           price: 25000
//         },
//         {
//           id: 5,
//           productId: 5,
//           productName: 'Bánh flan',
//           quantity: 2,
//           price: 20000
//         }
//       ],
//       status: OrderStatus.COMPLETED,
//       paymentStatus: PaymentStatus.PAID,
//       totalAmount: 65000,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     },
//     {
//       id: 4,
//       orderNumber: 'ORD004',
//       customerName: 'Phạm Thị D',
//       customerPhone: '0778899123',
//       tableId: 2,
//       items: [
//         {
//           id: 6,
//           productId: 6,
//           productName: 'Sinh tố bơ',
//           quantity: 2,
//           price: 40000
//         }
//       ],
//       status: OrderStatus.CANCELLED,
//       paymentStatus: PaymentStatus.REFUNDED,
//       totalAmount: 80000,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     },
//     // Thêm mock data khác...
//   ];

//   export default mockOrders;