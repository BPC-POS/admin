import moment from 'moment';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('vi-VN').format(number);
};

export const formatDate = (date: string | Date | number): string => { 
  try {
    const parsedDate = moment(date);
    if (!parsedDate.isValid()) {
      throw new Error('Invalid Date');
    }
    return parsedDate.format('DD/MM/YYYY HH:mm');
  } catch (error) {
    console.error("Lỗi trong formatDate:", error);
    return 'Invalid Date'; 
  }
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }
  return phone;
};