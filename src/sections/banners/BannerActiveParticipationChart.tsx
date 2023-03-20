import ReactApexChart, { BaseOptionChart } from "src/components/chart";
import merge from "lodash/merge";
import { useContext } from "react";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import { Participation } from "src/frontend-utils/types/banner";

export default function BannerActiveParticipationChart() {
  const context = useContext(ApiFormContext);
  const data: Participation[] = context.currentResult
    ? Object.values(context.currentResult)
    : [];

  const series = data.map((d) => d.participation_score);
  const options = merge(BaseOptionChart(), {
    labels: data.map((d) => d.grouping_label),
  });

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="donut"
      width={"80%"}
    />
  );
}
