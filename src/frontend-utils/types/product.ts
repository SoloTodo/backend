import { InLineProduct } from "./entity";
import { User } from "./user";

export type Product = {
  id: number;
  name: string;
  url: string;
  permissions: string[];
  brand: string;
  category: string;
  creation_date: string;
  creator: User;
  instance_model_id: number;
  keywords: string;
  last_updated: string;
  part_number: string;
  picture_url: string;
  slug: string;
  specs: string;
};

export type Website = {
  external_url: string;
  id: number;
  name: string;
  permissions: string[];
  url: string;
};

export type WtbEntity = {
  brand: string;
  category: string;
  creation_date: string;
  external_url: string;
  id: number;
  is_active: boolean;
  is_visible: boolean;
  key: string;
  last_updated: string;
  model_name: string;
  name: string;
  picture_url: string;
  price: number | null;
  product: InLineProduct;
  section: string;
  url: string;
};
