export type OrderItem = {
  id: number;
  name: string;
  qty: number;
  unit_price: string;
  line_total: string;
  image: string;
};

export type Order = {
  id: number;
  currency: string;
  subtotal: string;
  discount: string;
  shipping: string;
  tax: string;
  total: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address_line1: string;
  customer_address_line2: string;
  customer_city: string;
  customer_state: string;
  customer_postal_code: string;
  customer_country: string;
  items: OrderItem[];
  status: string;
  created_at: string;
  updated_at: string;
  transportation_zone: string | null;
  transportation_weight: string | null;
  transportation_price: string | null;
};

export type ApiList = {
  status: string;
  message: Record<string, string>;
  data: Order[];
};