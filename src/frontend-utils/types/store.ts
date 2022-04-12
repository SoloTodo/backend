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