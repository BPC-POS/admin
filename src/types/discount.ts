export interface Discount {
    id: number;
    code: string;
    discount_percentage: number | null;
    start_date: Date;
    end_date: Date;
    status: DiscountStatus;
    description: string;
}

export interface CreateDiscountDTO {
    id: number;
    code: string;
    discount_percentage: number | undefined | null;
    start_date: Date;
    end_date: Date;
    status: DiscountStatus;
    description: string;
}

export enum DiscountStatus{
    ACTIVE = 1,
    INACTIVE = 2,
}