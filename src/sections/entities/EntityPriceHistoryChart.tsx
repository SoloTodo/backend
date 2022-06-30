import { addDays } from "date-fns";
import merge from "lodash/merge";
import { useContext } from "react";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import { ApiFormDateRangePicker } from "src/frontend-utils/api_form/fields/range_picker/ApiFormDateRangePicker";
// components
import ReactApexChart, { BaseOptionChart } from "../../components/chart";

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

  let datesBefore = [];
  if (cleanedData[0] !== null && pricing_history.length > 0) {
    var currentDate = cleanedData[0];
    const initDate = new Date(pricing_history[0].timestamp);
    initDate.setHours(0, 0, 0);
    while (currentDate < initDate) {
      datesBefore.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
  }
  let datesAfter = [];
  if (cleanedData[1] !== null && pricing_history.length > 0) {
    var currentDate = addDays(
      new Date(pricing_history[pricing_history.length - 1].timestamp),
      1
    );
    const finalDate = cleanedData[1];
    while (currentDate < finalDate) {
      datesAfter.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
  }

  const CHART_DATA = [
    {
      name: "Precio normal",
      data: [
        ...datesBefore.map((_) => null),
        ...pricing_history.map((p: { normal_price: string }) => p.normal_price),
        ...datesAfter.map((_) => null),
      ],
      type: "line",
    },
    {
      name: "Precio oferta",
      data: [
        ...datesBefore.map((_) => null),
        ...pricing_history.map((p: { offer_price: string }) => p.offer_price),
        ...datesAfter.map((_) => null),
      ],
      type: "line",
    },
    {
      name: "Stock",
      data: [
        ...datesBefore.map((_) => null),
        ...pricing_history.map((p: { stock: number }) =>
          p.stock > 0 ? p.stock : NaN
        ),
        ...datesAfter.map((_) => null),
      ],
      type: "line",
    },
    {
      name: "No disponible",
      data: [
        ...datesBefore.map((_) => null),
        ...pricing_history.map((p: { is_available: boolean }) =>
          p.is_available ? null : 1
        ),
        ...datesAfter.map((_) => null),
      ],
      type: "area",
    },
  ];

  const chartOptions = merge(BaseOptionChart(), {
    markers: {
      size: 3,
    },
    xaxis: {
      type: "datetime",
      categories: [
        ...datesBefore.map((d) => d.toISOString()),
        ...pricing_history.map((p: { timestamp: string }) =>
          p.timestamp
        ),
        ...datesAfter.map((d) => d.toISOString()),
      ],
    },
    yaxis: [
      {
        title: {
          text: "Precio",
        },
      },
      {
        show: false,
      },
      {
        opposite: true,
        title: {
          text: "Stock",
        },
      },
      {
        show: false,
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
