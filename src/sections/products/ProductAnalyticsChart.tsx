import { Box, CircularProgress, Input, Stack, TextField } from "@mui/material";
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

export default function ProductAnalyticsChart() {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const [buckets, setBuckets] = useState(10);
  const context = useContext(ApiFormContext);

  let currentResult = context.currentResult;
  if (currentResult === null) currentResult = [];

  const retailer_ids: number[] = currentResult.reduce(
    (acc: number[], a: { retailer_id: number }) => {
      if (!acc.includes(a.retailer_id)) {
        acc.push(a.retailer_id);
      }
      return acc;
    },
    []
  );

  let bucketSize = 1;
  if (currentResult.length !== 0) {
    bucketSize =
      (currentResult[currentResult.length - 1].price - currentResult[0].price) /
      buckets;
  }

  const initialArray = new Array(buckets).fill(0);

  const CHART_DATA: ApexAxisChartSeries = retailer_ids.map((id) => ({
    name: getApiResourceObject(apiResourceObjects, "stores", id.toString())
      .name,
    data: currentResult.reduce(
      (acc: number[], a: { price: number; retailer_id: number }) => {
        if (a.retailer_id === id) {
          let p = Math.trunc((a.price - currentResult[0].price) / bucketSize);
          if (p >= initialArray.length) p = p - 1;
          acc[p] = acc[p] + 1;
        }
        return acc;
      },
      initialArray
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
          ? initialArray.map((_, index) => {
              const start = currency(
                currentResult[0].price + index * bucketSize,
                {
                  precision: 0,
                }
              ).format();
              const isLast = index === initialArray.length - 1 ? 0 : 1;
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

  const onChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const n = Number(e.target.value);
    if (n >= 0) {
      setBuckets(n);
    }
  };

  return !context.isLoading ? (
    <Stack spacing={3}>
      <Box>
        <TextField
          label="Número de Buckets"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          value={buckets}
          onChange={onChange}
        />
      </Box>
      <ReactApexChart type="bar" series={CHART_DATA} options={chartOptions} />
    </Stack>
  ) : (
    <Box textAlign="center">
      <CircularProgress color="inherit" />
    </Box>
  );
}
