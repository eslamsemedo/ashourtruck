export type Transport = {
  id: number;
  admin_id: number;
  zone: string;
  weight_kg: string; // "500.000"
  price: string;     // "120.00"
  created_at: string;
  updated_at: string;
  weight: string;    // "500 kg"
};

export type ApiList = {
  status: string;
  message: Record<string, string>;
  data: { data: Transport[]; total: number };
}
export type ApiCreateOrUpdate = {
  status: string;
  message: Record<string, string>;
  data?: Transport;
}