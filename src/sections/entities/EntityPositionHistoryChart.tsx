import { Box, CircularProgress } from "@mui/material";
import { addDays } from "date-fns";
import { useContext } from "react";
import ReactApexChart, { BaseOptionChart } from "src/components/chart";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import { ApiFormDateRangePicker } from "src/frontend-utils/api_form/fields/range_picker/ApiFormDateRangePicker";
import { fDate, fDateTime } from "src/utils/formatTime";
import merge from "lodash/merge";

type PositionHistory = {
  entity_history: {
    cell_mothley_payment: number | null;
    entity: string;
    id: number;
    is_available: boolean;
    normal_price: string;
    offer_price: string;
    timestamp: string;
    url: string;
  };
  section: {
    id: number;
    name: string;
    store: string;
    url: string;
  };
  url: string;
  value: number;
};

export default function EntityPositionHistoryChart({ name }: { name: string }) {
  const context = useContext(ApiFormContext);
  let position_history: PositionHistory[] = context.currentResult;
  if (position_history === null) position_history = [];

  const field = context.getField(name) as ApiFormDateRangePicker | undefined;

  if (typeof field === "undefined") {
    throw `Invalid field name: ${name}`;
  }

  const cleanedData =
    typeof field.cleanedData !== "undefined" ? field.cleanedData : [null, null];

  let days: Date[] = [];
  if (cleanedData[0] !== null && cleanedData[1] !== null) {
    var day = cleanedData[0];
    day.setHours(0, 0, 0);
    while (day <= cleanedData[1]) {
      days.push(day);
      day = addDays(day, 1);
      day.setHours(0, 0, 0);
    }
  }

  const position_history_dict: Record<string, PositionHistory> = {};
  position_history.map((p) => {
    const d = new Date(p.entity_history.timestamp);
    if (position_history_dict[`${fDate(d)}-${p.section.id}`]) {
      position_history_dict[`${fDateTime(d)}-${p.section.id}`] = p;
      const dayIndex = days.findIndex((v) => fDate(v) === fDate(d));
      days.splice(dayIndex + 1, 0, d);
    } else {
      position_history_dict[`${fDate(d)}-${p.section.id}`] = p;
    }
  });

  const sections = position_history
    .map((p) => p.section.id)
    .filter((v, i, a) => a.indexOf(v) == i);

  const CHART_DATA = sections.map((s) => {
    return {
      name: position_history.find((p) => p.section.id === s)?.section.name,
      data: days.map((day) => {
        const position = position_history_dict[`${fDateTime(day)}-${s}`]
          ? position_history_dict[`${fDateTime(day)}-${s}`]
          : position_history_dict[`${fDate(day)}-${s}`];
        if (position && position.section.id === s) {
          return Number(position.value);
        } else {
          return null;
        }
      }),
      type: "line",
    };
  });

  const chartOptions = merge(BaseOptionChart(), {
    markers: {
      size: [3, 3, 3, 0],
    },
    xaxis: {
      type: "datetime",
      categories: days.map((d) => d.toISOString()),
      tooltip: {
        enabled: false,
      },
    },
    yaxis: [
      {
        title: {
          text: "Posición",
        },
      },
    ],
    fill: {
      opacity: [1, 1, 1, 0.5],
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
