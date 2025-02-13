import { Voucher } from "@/types/voucher";

const mockVouchers: Voucher[] = [
  {
    id: 1,
    code: 'VOUCHER1',
    value: 10000,
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    isActive: true,
  },
  // Thêm các voucher khác
];

export default mockVouchers;