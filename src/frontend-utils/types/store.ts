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

export type Entity = {
  active_registry: {
    normal_price: string;
    offer_price: string;
    is_available: boolean;
  };
  bundle: null;
  category: string;
  cell_plan: null;
  cell_plan_name: null;
  condition: string;
  creation_date: string;
  currency: string;
  description: string;
  ean: null;
  external_url: string;
  id: number;
  is_visible: boolean;
  key: string;
  last_pricing_update: string;
  last_updated: string;
  name: string;
  part_number: null;
  picture_urls: string[];
  product: {
    id: number;
    name: string;
    url: string;
  };
  scraped_condition: string;
  seller: string;
  sku: string;
  store: string;
  url: string;
};
