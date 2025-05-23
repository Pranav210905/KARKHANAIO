import { Item } from '../types';

export const calculateItemsTotal = (items: Item[]): number => {
  return items.reduce((total, item) => total + item.cost + item.shippingCost + item.deliveryCost, 0);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};