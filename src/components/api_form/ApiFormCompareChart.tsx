import { Box, CircularProgress } from "@mui/material";
import { useContext } from "react";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
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

export default function ApiFormCompareChart({
  processorsLines,
}: {
  processorsLines: { id: number; name: string }[];
}) {
  const context = useContext(ApiFormContext);
  let currentResult = context.currentResult;
  if (currentResult === null) {
    return (
      <Box textAlign="center">
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  let index = 0;
  const currentProcessors = processorsLines.reduce(
    (acc: { index: number; value: number; label: string }[], a) => {
      const choiceWithDoc = context.currentResult.aggs[
        "processor_lines"
      ].filter((c: { id: number }) => c.id === a.id);
      if (choiceWithDoc.length > 0) {
        acc.push({
          index: index,
          value: a.id,
          label: a.name,
        });
        index++;
      }
      return acc;
    },
    []
  );
  let price_range = context.currentResult.price_ranges["offer_price_usd"];

  let min: number | null = null;
  let max: number | null = null;
  const data = currentResult.results.map((p: ProductsData) => {
    const { product_entries } = p;
    const { product, metadata } = product_entries[0];

    // const offerPrice = parseFloat(metadata.offer_price_usd);
    const priceCurrency = metadata.prices_per_currency.find((p) =>
      p.currency.includes(`/${apiSettings.clpCurrencyId}/`)
    );
    const offerPrice = priceCurrency ? parseFloat(priceCurrency.offer_price) : 0;
    console.log(offerPrice)
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

  if (min && max) {
    price_range = {
      ...price_range,
      min: min - (max - min) / 10,
      max: max,
    };
  }

  return (
    <Scatterplot
      data={data}
      width={800}
      height={500}
      xaxis={currentProcessors}
      yaxis={price_range}
    />
  );
}
