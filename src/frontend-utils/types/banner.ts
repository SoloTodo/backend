import { InLineProduct } from "./entity";
import { Category } from "./store";

export type Content = {
  id: number;
  percentage: number;
  brand: InLineProduct;
  category: Category;
}

export type Subsection = {
  id: number;
  name: string;
  section: InLineProduct;
  type: InLineProduct;
}

export type Banner = {  
  asset: {
    contents: Content[];
    creation_date: string;
    id: number;
    is_active: boolean;
    is_complete: boolean;
    key: string;
    picture_url: string;
    total_percentage: number;
    url: string;
  };
  destination_url_list: string[];
  external_url: string;
  id: number;
  position: number;
  subsection: Subsection;
  update: {
    id: number;
    is_active: boolean;
    status: number;
    status_message: string | null;
    store: string;
    timestamp: string;
    url: string;
  }
  url: string;
}