import { SyntheticEvent, useContext, useEffect, useState } from "react";
import { Box, Slider, Stack, Typography } from "@mui/material";
import { Currency } from "src/frontend-utils/redux/api_resources/types";
import ApiFormContext from "../../ApiFormContext";
import { ApiFormPriceRange } from "./ApiFormPriceRange";
// currency
import currency from "currency.js";

type PriceRanges = {
  "80th": number;
  min: number;
  max: number;
};

export default function ApiFormPriceRangeComponent({
  name,
  label,
  currencyUsed,
  initPriceRanges,
}: {
  name: string;
  label: string;
  currencyUsed: Currency;
  initPriceRanges: { [key: string]: PriceRanges };
}) {
  const context = useContext(ApiFormContext);
  const field = context.getField(name) as ApiFormPriceRange | undefined;
  const [cleanedData, setCleanedData] = useState([0, 0]);
  const [first, setFirst] = useState(true);
  const [pushUrl, setPushUrl] = useState(true);
  const [priceRanges, setPriceRanges] = useState<PriceRanges>(
    initPriceRanges[name]
  );

  if (typeof field === "undefined") {
    throw `Invalid field name: ${name}`;
  }

  const normalizeValue = (denormalizedValue: number) => {
    if (denormalizedValue <= priceRanges["80th"]) {
      return (
        (800 * (denormalizedValue - priceRanges.min)) /
        (priceRanges["80th"] - priceRanges.min)
      );
    } else {
      return (
        800 +
        (200 * (denormalizedValue - priceRanges["80th"])) /
          (priceRanges.max - priceRanges["80th"])
      );
    }
  };

  const denormalizeValue = (value: number) => {
    if (value <= 800) {
      return (
        priceRanges.min +
        (value / 800) * (priceRanges["80th"] - priceRanges.min)
      );
    } else {
      return (
        priceRanges["80th"] +
        ((value - 800) / 200) * (priceRanges.max - priceRanges["80th"])
      );
    }
  };

  useEffect(() => {
    if (
      typeof field.cleanedData !== "undefined" &&
      context.currentResult !== null &&
      context.currentResult.price_ranges !== null &&
      JSON.stringify(context.currentResult.price_ranges) !==
        JSON.stringify(priceRanges)
    ) {
      const price_ranges = context.currentResult.price_ranges[name];
      if (
        price_ranges.min < priceRanges.min ||
        price_ranges.max > priceRanges.max
      ) {
        setPriceRanges(price_ranges);
      }
    }
    if (
      typeof field.cleanedData !== "undefined" &&
      priceRanges["80th"] !== 0 &&
      first
    ) {
      const minNorm =
        field.cleanedData[0] !== null
          ? normalizeValue(field.cleanedData[0])
          : 0;
      const maxNorm =
        field.cleanedData[1] !== null
          ? normalizeValue(field.cleanedData[1])
          : 1000;
      setCleanedData([
        currency(minNorm, { precision: 0 }).intValue,
        currency(maxNorm, { precision: 0 }).intValue,
      ]);
      setFirst(false);
    }
  });

  const handleChange = (event: Event, newValue: number | number[]) => {
    setCleanedData(newValue as number[]);
    setPushUrl(true);
  };

  const handleChangeSubmit = (
    _event: Event | SyntheticEvent<Element, Event>,
    _newValue: number | number[]
  ) => {
    if (Array.isArray(cleanedData)) {
      if (pushUrl) {
        let minValue: string[] = [];
        let maxValue: string[] = [];
        if (cleanedData[0] !== 0) {
          minValue = [denormalizeValue(cleanedData[0]).toString()];
        }
        if (cleanedData[1] !== 1000) {
          maxValue = [denormalizeValue(cleanedData[1]).toString()];
        }
        context.updateUrl({
          [`${name}_min`]: minValue,
          [`${name}_max`]: maxValue,
        });
        setPushUrl(false);
      }
    }
  };

  const valueLabelFormat = (value: number) => {
    return currency(denormalizeValue(value), { precision: 0 })
      .multiply(currencyUsed.exchange_rate)
      .format();
  };

  return (
    <Stack direction="column">
      <Typography>{label}</Typography>
      <Box sx={{ width: "100%" }}>
        <Slider
          value={cleanedData}
          min={0}
          max={1000}
          valueLabelDisplay={"auto"}
          onChange={handleChange}
          onChangeCommitted={handleChangeSubmit}
          valueLabelFormat={valueLabelFormat}
          disableSwap
        />
      </Box>
    </Stack>
  );
}
