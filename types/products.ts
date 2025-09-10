export type QuantityTier = {
  from: string; // e.g. "1.00"
  to: string;   // e.g. "50.00"
  equal?: string; // in some entries this is the price
  total?: string; // in other entries this is the price
};

export type LocaleProduct = {
  id: number;
  admin_id: number;
  category: string;
  name: string;
  image: string;
  price_each: string; // base price (stringified)
  description: string;
  weight: string;
  created_at: string; // ISO
  updated_at: string; // ISO
  quantity: QuantityTier[];
};

export type ProductRecord = {
  en: LocaleProduct;
  ar: LocaleProduct;
};

export type ApiPayload = {
  status: string;
  message: { en: string; ar: string };
  data: {
    current_page: number;
    data: ProductRecord[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: { url: string | null; label: string; page: number | null; active: boolean }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
};

