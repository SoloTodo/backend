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

type ProductEntry = {
  metadata: metadata;
  product: ExtendedProduct;
};

export type ProductsData = {
  bucket: string;
  product_entries: ProductEntry[];
};

const processorLinePositionList: Record<number, number> = {
  106254: 0,
  106261: 0,
  1079336: 1,
  1203859: 1,
  1139730: 1,
  106080: 1,
  106090: 1,
  106100: 1,
  106111: 1,
  106120: 1,
  106131: 1,
  106141: 1,
  106348: 1,
  106357: 1,
  106306: 2,
  764085: 2,
  106315: 3,
  697544: 3,
  106325: 4,
  696420: 4,
  788519: 5,
  1202555: 5,
};

const axis = [
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
  const activeBrands: number[] = [];
  const data = currentResult.results.map((p: ProductsData) => {
    const { product_entries } = p;
    const { product, metadata } = product_entries[0];

    if (!activeBrands.includes(product.brand_id)) {
      activeBrands.push(product.brand_id);
    }

    const priceCurrency = metadata.prices_per_currency.find((p) =>
      p.currency.includes(`/${apiSettings.clpCurrencyId}/`)
    );
    const offerPrice = priceCurrency
      ? parseFloat(priceCurrency.offer_price)
      : 0;
    if (min === null || offerPrice < min) min = offerPrice;
    if (max === null || offerPrice > max) max = offerPrice;
    return {
      x:
        processorLinePositionList[product.specs.processor_line_id] ??
        axis.length - 1,
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
      <ApiFormPaginationComponent rowsPerPage={[5, 10, 20, 50]} />
      <Scatterplot
        data={data}
        width={1200}
        height={500}
        xaxis={axis}
        yaxis={price_range}
        activeBrands={activeBrands}
      />
      <ApiFormPaginationComponent rowsPerPage={[5, 10, 20, 50]} />
    </>
  );
}
