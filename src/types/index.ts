export interface Item {
  id: string;
  name: string;
  cost: number;
  shippingCost: number;
  deliveryCost: number;
  userId: string;
  createdAt: string;
}

export interface User {
  uid: string;
  email: string | null;
}