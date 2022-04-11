export type Store = {
  url: string;
  id: number;
  name: string;
  country: string;
  last_activation: string;
  type: string;
  storescraper_class: string;
  logo: string;
  permissions: string[];
};

export type Update = {
  available_products_count: number | null;
  categories?: any;
  creation_date: string;
  discovery_url_concurrency: number | null;
  discovery_urls_without_products_count: number | null;
  id: number;
  last_updated: string;
  products_for_url_concurrency: number | null;
  registry_file: string;
  status: number | null;
  store: string;
  unavailable_products_count: number | null;
  url: string;
  use_async: boolean;
};

export type Category = {
  budget_ordering: string | null;
  id: number;
  name: string;
  permissions: string[];
  slug: string;
  url: string;
};

export type StoreScrapingOptions = {
  categories: string[];
  prefer_async: boolean;
  discover_urls_concurrency?: number;
  products_for_url_concurrency?: number;
};

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
  };
  bundle: null;
  category: string;
  cell_plan?: InLineProduct;
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
