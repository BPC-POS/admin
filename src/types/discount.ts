export interface Discount {
    code: string;
    discount_percentage: number;
    start_date: Date;
    end_date: Date;
    status: boolean;
    description: string;
}

export interface CreateDiscountDTO {
    code: string;
    discount_percentage: number;
    start_date: Date;
    end_date: Date;
    status: boolean;
    description: string;
}