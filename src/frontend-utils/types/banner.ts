import { Category } from "./store";

export type Brand = {
  id: number;
  name: string;
  url: string;
};

export type Section = {
  id: number;
  name: string;
  url: string;
};

export type Type = {
  id: number;
  name: string;
  url: string;
};

export type Content = {
  id: number;
  percentage: number;
  brand: Brand;
  category: Category;
}

export type Subsection = {
  id: number;
  name: string;
  section: Section;
  type: Type;
}

export type BannerAsset = {
  contents: Content[];
  creation_date: string;
  id: number;
  is_active: boolean;
  is_complete: boolean;
  key: string;
  picture_url: string;
  total_percentage?: number;
  url: string;
}

export type Banner = {  
  asset: BannerAsset;
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

export type BannerUpdate = {
  id: number;
  is_active: boolean;
  status: 1 | 2 | 3;
  status_message: string | null;
  store: string;
  timestamp: string;
  url: string;
}

export const statusCodes = {
  1: "En proceso",
  2: "Exitoso",
  3: "Error",
};