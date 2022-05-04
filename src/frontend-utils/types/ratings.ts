import { InLineProduct } from "./entity";
import { User } from "./user";

export type Rating = {
  approval_date: string | null;
  creation_date: string;
  id: number;
  ip: string;
  product: InLineProduct;
  product_comments: string;
  product_rating: number;
  purchase_proof: string;
  store: string;
  store_comments: string;
  store_rating: number;
  url: string;
  user: User;
};
