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

  let index = 1;
  const currentProcessors: { index: number; value: number; label: string }[] =
    [];
  currentResult.results.map((p: ProductsData) => {
    const { product_entries } = p;
    const { product } = product_entries[0];
    const present = currentProcessors.find(
      (c) => c.value === product.specs.processor_line_family_id
    );
    if (typeof present === "undefined") {
      currentProcessors.push({
        index: index,
        label: product.specs.processor_line_family_name,
        value: product.specs.processor_line_family_id,
      });
      index++;
    }
  });

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
      x: currentProcessors.find(
        (c) => c.value === product.specs.processor_line_family_id
      )?.index,
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
        xaxis={currentProcessors}
        yaxis={price_range}
      />
      <ApiFormPaginationComponent />
    </>
  );
}
