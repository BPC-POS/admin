export interface OrderAPI {
  id?: number;
  user_id: number; 
  member_id?: number; 
  order_date: Date | string;
  total_amount: number;
  discount: number;
  tax: number;
  status: OrderStatusAPI;
  payment_info: string;
  shipping_address: string;
  items: OrderItemAPI[];
  meta?: {
    table_id: number;
    payment_method?: number;
  }; 
  createdAt?: string; 
  updatedAt?: string; 
  orderItems?: OrderItemAPI[];
};

export enum OrderStatusAPI{
  PENDING = 6,        
  CONFIRMED = 1,    
  PREPARING = 2,     
  READY = 3,            
  COMPLETED = 4,     
  CANCELLED = 5      
};

export interface OrderItemAPI{
  id?: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  discount?: number;
  variant_id: number;
  meta?: Record<string, unknown>;
  product_name?: string;
  createdAt?: string; 
  updatedAt?: string;
  product?: ProductInOrderItemAPI;
}

export interface ProductInOrderItemAPI {
  id: number;
  createdAt: string; 
  updatedAt: string; 
  name: string;
  description: string | null;
  price: string; 
  sku: string;
  stock_quantity: number;
  status: number;
  avatar: string | null;
  meta: {
    recipes: Record<string, unknown>;
    image_id: string;
    extension: string;
    image_url: string;
  };
}

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
  product_id: number;
  quantity: number;
  unit_price: number;
  discount?: number;
  variant_id: number;
  meta?: Record<string, unknown>;
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
  CASH = 1,              
  TRANSFER = 2,      
}

export interface OrderFilter {
  search?: string;
  status?: OrderStatusAPI;
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

export interface SummaryData {
  todayRevenue: string;
  totalOrdersToday: number;
  pendingOrders: number;
  completedOrders: number;
}

export interface ProductCount {
  id: number;
  name: string;
  count: number;
}

export type ChartDataPoint = {
  [key: string]: string | number;
};