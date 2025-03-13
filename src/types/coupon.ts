export interface Coupon {
    id?: number;
    code: string;
    description: string;
    discount_amount: number | null; 
    discount_percentage: number | null; 
    max_usage: number | null; 
    start_date: string | Date; 
    end_date: string | Date;   
    status: CouponStatus; 
  }
  
  export type CreateCouponDTO = {
    id?: number;
    code: string;
    description: string;
    discount_amount: number | undefined | null;
    discount_percentage: number | undefined | null;
    max_usage?: number; 
    start_date: string | Date;
    end_date: string | Date;
    status?: CouponStatus; 
  };

  export enum CouponStatus {
    ACTIVE = 1,
    INACTIVE = 2,
  }