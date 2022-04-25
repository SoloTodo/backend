import merge from "lodash/merge";
import { useContext } from "react";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import { ApiFormSelect } from "src/frontend-utils/api_form/fields/select/ApiFormSelect";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { Entity } from "src/frontend-utils/types/entity";
import { useAppSelector } from "src/store/hooks";
// components
import ReactApexChart, { BaseOptionChart } from "../../components/chart";

// ----------------------------------------------------------------------

export default function ApiFormChartLine({name}: {name:string}) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const context = useContext(ApiFormContext);
  let currentResult = context.currentResult;
  if (currentResult === null) currentResult = [];

  const field = context.getField(name) as ApiFormSelect | undefined;
  if (typeof field === "undefined") {
    throw `Invalid field name: ${name}`;
  }

  let useOfferPrice = false
  if (typeof field.cleanedData !== "undefined" && field.cleanedData.length !== 0) {
    useOfferPrice = field.cleanedData[0].value === 'offer'
  }

  const CHART_DATA: any = [];

  currentResult.map(({entity, pricing_history}: {entity: Entity, pricing_history: any[]}) =>
    CHART_DATA.push(
      {
        name: apiResourceObjects[entity.store].name,
        data: pricing_history.map((p) => useOfferPrice ? p.offer_price : p.normal_price),
        type: "line",
      }
    )
  );

  const chartOptions = merge(BaseOptionChart(), {
    markers: {
      size: 3,
    },
    xaxis: {
      type: "datetime",
      categories: currentResult.length !== 0 ? currentResult[0].pricing_history.map((p: { timestamp: string }) => p.timestamp) : [],
    },
    tooltip: { x: { format: "dd/MM/yy" }, marker: { show: false } },
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
