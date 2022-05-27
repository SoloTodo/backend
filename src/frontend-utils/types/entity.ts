export type InLineProduct = {
  id: number;
  name: string;
  url: string;
};

export type Entity = {
  active_registry?: {
    normal_price: string;
    offer_price: string;
    is_available: boolean;
    cell_monthly_payment: string,
  };
  bundle: { name: string, id: number };
  category: string;
  cell_plan: InLineProduct | null;
  cell_plan_name?: string;
  condition: string;
  creation_date: string;
  currency: string;
  description?: string;
  ean?: string;
  external_url: string;
  id: number;
  is_visible: boolean;
  key: string;
  last_pricing_update: string;
  last_updated: string;
  name: string;
  part_number?: string;
  picture_urls: string[];
  product?: InLineProduct;
  scraped_condition: string;
  seller?: string;
  sku?: string;
  store: string;
  url: string;
};

export type StaffInfo = {
  discovery_url: string;
  last_association: string | null;
  last_association_user: string | null;
  last_staff_access: string | null;
  last_staff_access_user: string | null;
  scraped_category: string;
};

export type EntityEvent = {
  timestamp: string;
  user: { full_name: string; id: number; url: string };
  changes: {
    field: string;
    new_value: { id: number; name: string } | null;
    old_value: { id: number; name: string } | null;
  }[];
};
