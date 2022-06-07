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
}: {
  name: string;
  label: string;
  currencyUsed: Currency;
}) {
  const context = useContext(ApiFormContext);
  const field = context.getField(name) as ApiFormPriceRange | undefined;
  const [cleanedData, setCleanedData] = useState([0, 0]);
  const [first, setFirst] = useState(true);

  if (typeof field === "undefined") {
    throw `Invalid field name: ${name}`;
  }

  const normalizeValue = (denormalizedValue: number, props: PriceRanges) => {
    if (denormalizedValue <= props["80th"]) {
      return (
        (800 * (denormalizedValue - props.min)) / (props["80th"] - props.min)
      );
    } else {
      return (
        800 +
        (200 * (denormalizedValue - props["80th"])) /
          (props.max - props["80th"])
      );
    }
  };

  const denormalizeValue = (value: number, props: PriceRanges) => {
    if (value <= 800) {
      return props.min + (value / 800) * (props["80th"] - props.min);
    } else {
      return (
        props["80th"] + ((value - 800) / 200) * (props.max - props["80th"])
      );
    }
  };

  // let min = 0;
  // let max = 0;
  // console.log(context.currentResult);
  // if (context.currentResult !== null) {
  //   const price_ranges = context.currentResult.price_ranges;
  //   if (price_ranges !== null) {
  //     const prices = price_ranges[name];
  //     min = currency(prices.min, { precision: 0 }).intValue;
  //     max = currency(prices.max, { precision: 0 }).intValue;
  //   }
  // }

  useEffect(() => {
    if (
      typeof field.cleanedData !== "undefined" &&
      context.currentResult !== null &&
      first
    ) {
      const price_ranges = context.currentResult.price_ranges;
      const minNorm =
        field.cleanedData[0] !== null
          ? normalizeValue(field.cleanedData[0], price_ranges)
          : 0;
      const maxNorm =
        field.cleanedData[1] !== null
          ? normalizeValue(field.cleanedData[1], price_ranges)
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
  };

  const handleChangeSubmit = (
    _event: Event | SyntheticEvent<Element, Event>,
    _newValue: number | number[]
  ) => {
    // if (Array.isArray(cleanedData)) {
    //   if (cleanedData[0] !== min || cleanedData[1] !== max) {
    //     if (cleanedData[0] === min) {
    //       context.updateUrl({ [`${name}_min`]: [] });
    //     } else {
    //       context.updateUrl({ [`${name}_min`]: [cleanedData[0].toString()] });
    //     }
    //     if (cleanedData[1] === max) {
    //       context.updateUrl({ [`${name}_max`]: [] });
    //     } else {
    //       context.updateUrl({ [`${name}_max`]: [cleanedData[1].toString()] });
    //     }
    //   }
    // }
  };

  const valueLabelFormat = (value: number) => {
    return currency(value, { precision: 0 })
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
