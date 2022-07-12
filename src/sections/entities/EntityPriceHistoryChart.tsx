import currency from "currency.js";
import { addDays } from "date-fns";
import merge from "lodash/merge";
import { useContext } from "react";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import { ApiFormDateRangePicker } from "src/frontend-utils/api_form/fields/range_picker/ApiFormDateRangePicker";
import { fDate } from "src/utils/formatTime";
// components
import ReactApexChart, { BaseOptionChart } from "../../components/chart";

type PricingHistory = {
  timestamp: string;
  normal_price: string;
  offer_price: string;
  stock: number;
  is_available: boolean;
};

// ----------------------------------------------------------------------

export default function EntityPriceHistoryChart({ name }: { name: string }) {
  const context = useContext(ApiFormContext);
  let pricing_history = context.currentResult;
  if (pricing_history === null) pricing_history = [];

  const field = context.getField(name) as ApiFormDateRangePicker | undefined;

  if (typeof field === "undefined") {
    throw `Invalid field name: ${name}`;
  }

  const cleanedData =
    typeof field.cleanedData !== "undefined" ? field.cleanedData : [null, null];

  let days = [];
  if (cleanedData[0] !== null && cleanedData[1] !== null) {
    var day = cleanedData[0];
    day.setHours(0, 0, 0);
    while (day <= cleanedData[1]) {
      days.push(day);
      day = addDays(day, 1);
    }
  }

  const pricing_history_dict: Record<string, PricingHistory> = {};
  pricing_history.map((p: PricingHistory) => {
    const d = new Date(p.timestamp);
    pricing_history_dict[fDate(d)] = p;
  });

  const CHART_DATA = [
    {
      name: "Precio normal",
      data: days.map((day) => {
        const pricing = pricing_history_dict[fDate(day)];
        if (pricing) {
          return Number(pricing.normal_price);
        } else {
          return null;
        }
      }),
      type: "line",
    },
    {
      name: "Precio oferta",
      data: days.map((day) => {
        const pricing = pricing_history_dict[fDate(day)];
        if (pricing) {
          return Number(pricing.offer_price);
        } else {
          return null;
        }
      }),
      type: "line",
    },
    {
      name: "Stock",
      data: days.map((day) => {
        const pricing = pricing_history_dict[fDate(day)];
        if (pricing) {
          return pricing.stock > 0 ? pricing.stock : null;
        } else {
          return null;
        }
      }),
      type: "line",
    },
    {
      name: "No disponible",
      data: days.map((day) => {
        const pricing = pricing_history_dict[fDate(day)];
        if (pricing) {
          return pricing.is_available ? null : 1;
        } else {
          return null;
        }
      }),
      type: "area",
    },
  ];

  const chartOptions = merge(BaseOptionChart(), {
    markers: {
      size: [3, 3, 3, 0],
    },
    xaxis: {
      type: "datetime",
      categories: days.map((d) => d.toISOString()),
    },
    yaxis: [
      {
        title: {
          text: "Precio",
        },
        labels: {
          formatter: (value: number) =>
            currency(value, { precision: 0 }).format(),
        },
      },
      {
        show: false,
        labels: {
          formatter: (value: number) =>
            currency(value, { precision: 0 }).format(),
        },
      },
      {
        opposite: true,
        title: {
          text: "Stock",
        },
      },
      {
        show: false,
        labels: {
          formatter: (_) => null,
        },
      },
    ],
    fill: {
      opacity: [1, 1, 1, 0.5],
    },
  });

  return (
    <ReactApexChart
      type="line"
      series={CHART_DATA}
      options={chartOptions}
      // height={400}
    />
  );
}
