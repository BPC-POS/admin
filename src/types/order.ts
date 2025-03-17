export interface Order {
  id: number | string;
  orderNumber?: string;
  customerName?: string;
  customerPhone?: string;
  tableId?: number | string;
  tableName?: string;
  items: OrderItem[];
  status: OrderStatus | string;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  totalAmount: number;
  note?: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface OrderItem {
  id?: number;
  productId: number | string;
  productName: string;
  variantId?: number | string;
  variantName?: string;
  quantity: number;
  price: number;
  total?: number;
  note?: string;
  toppings?: Array<{
    id: number | string;
    name: string;
    price: number;
  }>;
}

export enum OrderStatus {
  PENDING = 'pending',         // Chờ xác nhận
  CONFIRMED = 'confirmed',     // Đã xác nhận
  PREPARING = 'preparing',     // Đang pha chế
  READY = 'ready',            // Sẵn sàng phục vụ
  COMPLETED = 'completed',     // Hoàn thành
  CANCELLED = 'cancelled'      // Đã hủy
}

export enum PaymentStatus {
  UNPAID = 'unpaid',          // Chưa thanh toán
  PARTIALLY_PAID = 'partial', // Thanh toán một phần
  PAID = 'paid',             // Đã thanh toán
  REFUNDED = 'refunded'      // Đã hoàn tiền
}

export enum PaymentMethod {
  CASH = 'cash',              // Tiền mặt
  CARD = 'card',              // Thẻ
  TRANSFER = 'transfer',      // Chuyển khoản
  MOMO = 'momo',             // Ví MoMo
  VNPAY = 'vnpay',           // VNPay
  ZALOPAY = 'zalopay'        // ZaloPay
}

export interface OrderFilter {
  search?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  startDate?: Date;
  endDate?: Date;
  tableId?: number;
}

export interface OrderStats {
  totalOrders: number;
  totalAmount: number;
  byStatus: Record<OrderStatus, number>;
  byPayment: Record<PaymentStatus, number>;
} 