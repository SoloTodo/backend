import ReactApexChart, { BaseOptionChart } from "src/components/chart";
import merge from "lodash/merge";
import { useContext } from "react";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import { Box, CircularProgress } from "@mui/material";

export default function CategoryShareOfshelvesChart() {
  const context = useContext(ApiFormContext);
  const data: { label: string; doc_count: number }[] = context.currentResult
    ? context.currentResult.results
    : [];

  const series = data.map((d) => d.doc_count);
  const options = merge(BaseOptionChart(), {
    labels: data.map((d) => d.label),
  });

  return data.length !== 0 ? (
    <ReactApexChart
      options={options}
      series={series}
      type="donut"
      width={"70%"}
    />
  ) : (
    <Box textAlign="center">
      <CircularProgress />
    </Box>
  );
}
