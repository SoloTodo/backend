import merge from "lodash/merge";
import { useContext } from "react";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
// components
import ReactApexChart, { BaseOptionChart } from "../../components/chart";

// ----------------------------------------------------------------------

export default function EntityPriceHistoryChart() {
  const context = useContext(ApiFormContext);
  let pricing_history = context.currentResult;
  if (pricing_history === null) pricing_history = [];

  const CHART_DATA = [
    {
      name: "Precio normal",
      data: pricing_history.map(
        (p: { normal_price: string }) => p.normal_price
      ),
      type: "line",
    },
    {
      name: "Precio oferta",
      data: pricing_history.map((p: { offer_price: string }) => p.offer_price),
      type: "line",
    },
    {
      name: "Stock",
      data: pricing_history.map((p: { stock: number }) =>
        p.stock > 0 ? p.stock : NaN
      ),
      type: "line",
    },
    {
      name: "No disponible",
      data: pricing_history.map((p: { is_available: boolean }) =>
        p.is_available ? null : 1
      ),
      type: "area",
    },
  ];

  const chartOptions = merge(BaseOptionChart(), {
    markers: {
      size: 3,
    },
    xaxis: {
      type: "datetime",
      categories: pricing_history.map(
        (p: { timestamp: string }) => p.timestamp
      ),
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
    tooltip: { x: { format: "dd/MM/yy" }, marker: { show: false } },
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
