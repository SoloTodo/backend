import { Box, CircularProgress } from "@mui/material";
import currency from "currency.js";
import { addDays } from "date-fns";
import merge from "lodash/merge";
import { useContext } from "react";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import { ApiFormDateRangePicker } from "src/frontend-utils/api_form/fields/range_picker/ApiFormDateRangePicker";
import { ApiFormSelect } from "src/frontend-utils/api_form/fields/select/ApiFormSelect";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { Entity } from "src/frontend-utils/types/entity";
import { useAppSelector } from "src/store/hooks";
import { fDate } from "src/utils/formatTime";
// components
import ReactApexChart, { BaseOptionChart } from "../../components/chart";

// ----------------------------------------------------------------------

export default function ProductPriceHistoryChart({ name }: { name: string }) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const context = useContext(ApiFormContext);
  let currentResult = context.currentResult;
  if (currentResult === null) currentResult = [];

  const field = context.getField(name) as ApiFormSelect | undefined;
  if (typeof field === "undefined") {
    throw `Invalid field name: ${name}`;
  }

  let useOfferPrice = false;
  if (
    typeof field.cleanedData !== "undefined" &&
    field.cleanedData.length !== 0
  ) {
    useOfferPrice = field.cleanedData[0].value === "offer";
  }

  const fieldTimestamp = context.getField("timestamp") as
    | ApiFormDateRangePicker
    | undefined;

  if (typeof fieldTimestamp === "undefined") {
    throw `Invalid field name: timestamp`;
  }

  const cleanedData =
    typeof fieldTimestamp.cleanedData !== "undefined"
      ? fieldTimestamp.cleanedData
      : [null, null];

  let days: Date[] = [];
  if (cleanedData[0] !== null && cleanedData[1] !== null) {
    var day = cleanedData[0];
    day.setHours(0, 0, 0);
    while (day <= cleanedData[1]) {
      days.push(day);
      day = addDays(day, 1);
    }
  }

  const finalData = [];

  for (const pricingEntry of currentResult as {
    entity: Entity;
    pricing_history: any[];
  }[]) {
    if (pricingEntry.entity.condition != "https://schema.org/NewCondition")
      continue;

    const newData = {
      entity: pricingEntry.entity,
      normalized_pricing_history: {
        normalPrices: {} as Record<
          string,
          { timestamp: string; normalPrice: currency }
        >,
        offerPrices: {} as Record<
          string,
          { timestamp: string; offerPrice: currency }
        >,
      },
    };

    for (const priceHistory of pricingEntry.pricing_history) {
      if (!priceHistory.is_available) continue;

      const timestamp = fDate(new Date(priceHistory.timestamp));
      const normalPrice = currency(priceHistory.normal_price, {
        precision: 0,
      });
      const offerPrice = currency(priceHistory.offer_price, {
        precision: 0,
      });

      newData.normalized_pricing_history.normalPrices[timestamp] = {
        timestamp,
        normalPrice,
      };
      newData.normalized_pricing_history.offerPrices[timestamp] = {
        timestamp,
        offerPrice,
      };
    }

    finalData.push(newData);
  }

  const CHART_DATA: any = [];

  finalData.map((d) =>
    CHART_DATA.push({
      name: apiResourceObjects[d.entity.store].name,
      data: days.map((day) => {
        const pricing = useOfferPrice
          ? d.normalized_pricing_history.offerPrices[fDate(day)]
          : d.normalized_pricing_history.normalPrices[fDate(day)];
        if (pricing) {
          return useOfferPrice
            ? (pricing as { timestamp: string; offerPrice: currency })
                .offerPrice.value
            : (pricing as { timestamp: string; normalPrice: currency })
                .normalPrice.value;
        } else {
          return null;
        }
      }),
      type: "line",
    })
  );

  const chartOptions = merge(BaseOptionChart(), {
    markers: {
      size: 3,
    },
    xaxis: {
      type: "datetime",
      categories: days.map((d) => d.toISOString()),
    },
    yaxis: {
      title: {
        text: "Precio",
      },
      labels: {
        formatter: (value: number) =>
          currency(value, { precision: 0 }).format(),
      },
    },
    tooltip: {
      shared: false,
      intersect: true,
    },
  });

  return (
    <Box margin="auto" textAlign="center" maxWidth={1000}>
      {context.isLoading ? (
        <CircularProgress color="inherit" />
      ) : (
        <ReactApexChart
          type="line"
          series={CHART_DATA}
          options={chartOptions}
        />
      )}
    </Box>
  );
}
