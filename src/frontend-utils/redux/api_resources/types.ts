export type ApiResourceObject = {
  url: string;
  id: number;
};

export type Country = ApiResourceObject & {
  name: string;
  iso_code: string;
  currency: string;
  number_format: string;
  flag: string;
};

export type StoreType = ApiResourceObject & {
  name: string;
};

export type Currency = ApiResourceObject & {
  name: string;
  iso_code: string;
  decimal_places: number;
  prefix: string;
  exchange_rate: string;
  exchange_rate_last_updated: string;
};
