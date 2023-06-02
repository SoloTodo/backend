import {
  Box,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { ChangeEvent, useContext, useState } from "react";
import ReactApexChart, { BaseOptionChart } from "src/components/chart";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import {
  getApiResourceObject,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import merge from "lodash/merge";
import currency from "currency.js";
import { Typography } from "@mui/material";

export default function ProductAnalyticsChart() {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const [buckets, setBuckets] = useState(10);
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const context = useContext(ApiFormContext);

  let currentResult = context.currentResult;
  if (currentResult === null) currentResult = [];

  const retailers: { id: number; count: number }[] = currentResult.reduce(
    (acc: { id: number; count: number }[], a: { retailer_id: number }) => {
      const index = acc.findIndex((v) => v.id == a.retailer_id);
      if (index >= 0) {
        acc[index].count = acc[index].count + 1;
      } else {
        acc.push({ id: a.retailer_id, count: 0 });
      }
      return acc;
    },
    []
  );

  const retailer_ids = retailers
    .sort((a, b) => b.count - a.count)
    .map((r) => r.id);

  let bucketSize = 1;
  if (currentResult.length !== 0) {
    const maxValue =
      maxPrice !== ""
        ? maxPrice
        : currentResult[currentResult.length - 1].price;
    bucketSize = (maxValue - currentResult[0].price) / buckets;
  }

  const CHART_DATA: ApexAxisChartSeries = retailer_ids.map((id) => ({
    name: getApiResourceObject(apiResourceObjects, "stores", id.toString())
      .name,
    data: currentResult.reduce(
      (acc: number[], a: { price: number; retailer_id: number }) => {
        if (
          a.retailer_id === id &&
          ((maxPrice !== "" && a.price < maxPrice) || maxPrice === "")
        ) {
          let p = Math.trunc((a.price - currentResult[0].price) / bucketSize);
          if (p >= buckets) p = p - 1;
          acc[p] = acc[p] + 1;
        }
        return acc;
      },
      new Array(buckets).fill(null)
    ),
  }));

  const chartOptions = merge(BaseOptionChart(), {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10,
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: "13px",
              fontWeight: 900,
            },
          },
        },
      },
    },
    xaxis: {
      type: "number",
      categories:
        currentResult.length !== 0
          ? new Array(buckets).fill(0).map((_, index) => {
              const start = currency(
                currentResult[0].price + index * bucketSize,
                {
                  precision: 0,
                }
              ).format();
              const isLast = index === buckets - 1 ? 0 : 1;
              const end = currency(
                currentResult[0].price + (index + 1) * bucketSize - isLast,
                {
                  precision: 0,
                }
              ).format();
              return `${start} - ${end}`;
            })
          : [],
    },
    legend: {
      position: "right",
      offsetY: 40,
    },
    fill: {
      opacity: 1,
    },
  });

  const onChangeBuckets = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const n = Number(e.target.value);
    if (n >= 0) {
      setBuckets(n);
    }
  };

  const onChangeMaxPrice = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const n = Number(e.target.value);
    if (n > 0) {
      setMaxPrice(n);
    } else {
      setMaxPrice("");
    }
  };

  return !context.isLoading ? (
    <Stack spacing={3}>
      <Stack direction="column" spacing={1}>
        <Stack direction="row" spacing={1}>
          <TextField
            label="Número de Buckets"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            value={buckets}
            onChange={onChangeBuckets}
          />
          <TextField
            label="Precio máximo"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
              type: "number",
            }}
            value={maxPrice}
            onChange={onChangeMaxPrice}
          />
        </Stack>
        {isFinite(bucketSize) && (
          <Typography variant="caption">
            Aumento por bucket:{" "}
            {currency(bucketSize, { precision: 0 }).format()}
          </Typography>
        )}
      </Stack>
      <ReactApexChart type="bar" series={CHART_DATA} options={chartOptions} />
    </Stack>
  ) : (
    <Box textAlign="center">
      <CircularProgress color="inherit" />
    </Box>
  );
}
