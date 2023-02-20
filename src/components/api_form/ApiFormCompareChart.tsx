import { Box, CircularProgress } from "@mui/material";
import { useContext } from "react";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import ApiFormPaginationComponent from "src/frontend-utils/api_form/fields/pagination/ApiFormPaginationComponent";
import { apiSettings } from "src/frontend-utils/settings";
import { Product } from "src/frontend-utils/types/product";
import { Scatterplot } from "../scatterplot/Scatterplot";

type PricesPerCurrency = {
  currency: string;
  normal_price: string;
  offer_price: string;
};

type metadata = {
  score: number;
  normal_price_usd: string;
  offer_price_usd: string;
  prices_per_currency: PricesPerCurrency[];
};

type ExtendedProduct = Product & {
  brand_id: number;
  brand_name: string;
  name_analyzed: string;
  specs: Record<string, any>;
};

export type ProductsData = {
  bucket: string;
  product_entries: {
    metadata: metadata;
    product: ExtendedProduct;
  }[];
};

const processorLinePositionList: Record<number, number> = {
  106254: 1,
  106261: 1,
  1079336: 2,
  1203859: 2,
  1139730: 2,
  106080: 2,
  106090: 2,
  106100: 2,
  106111: 2,
  106120: 2,
  106131: 2,
  106141: 2,
  106348: 2,
  106357: 2,
  106306: 3,
  764085: 3,
  106315: 4,
  697544: 4,
  106325: 5,
  696420: 5,
  788519: 6,
  1202555: 6,
};

const axis = [
  "",
  "Celeron",
  "Pentium / Athlon",
  "Core i3 / Ryzen 3",
  "Core i5 / Ryzen 5",
  "Core i7 / Ryzen 7",
  "Core i9 / Ryzen 9",
  "Extra",
];

export default function ApiFormCompareChart() {
  const context = useContext(ApiFormContext);
  let currentResult = context.currentResult;
  if (currentResult === null) {
    return (
      <Box textAlign="center">
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  let min: number | null = null;
  let max: number | null = null;
  const data = currentResult.results.map((p: ProductsData) => {
    const { product_entries } = p;
    const { product, metadata } = product_entries[0];

    const priceCurrency = metadata.prices_per_currency.find((p) =>
      p.currency.includes(`/${apiSettings.clpCurrencyId}/`)
    );
    const offerPrice = priceCurrency
      ? parseFloat(priceCurrency.offer_price)
      : 0;
    if (min === null || offerPrice < min) min = offerPrice;
    if (max === null || offerPrice > max) max = offerPrice;
    return {
      x: processorLinePositionList[product.specs.processor_line_id] ?? axis.length - 1,
      y: offerPrice,
      productData: p,
    };
  });

  let price_range = { min: 0, max: 0 };
  if (min && max) {
    price_range = {
      min: min - (max - min) / 10,
      max: max + (max - min) / 10,
    };
  }

  return (
    <>
      <ApiFormPaginationComponent />
      <Scatterplot
        data={data}
        width={1000}
        height={500}
        xaxis={axis}
        yaxis={price_range}
      />
      <ApiFormPaginationComponent />
    </>
  );
}
