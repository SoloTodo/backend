import { GridColDef } from "@mui/x-data-grid";
import { useContext } from "react";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import CustomTable from "../CustomTable";

export default function ApiFormActionsSummaryTable({
  columns,
  dataKey,
}: {
  columns: GridColDef[];
  dataKey: string;
}) {
  const context = useContext(ApiFormContext);
  let currentResult = context.currentResult;
  let currentItems = [];
  if (currentResult !== null) currentItems = currentResult[dataKey];


  return <CustomTable data={currentItems} columns={columns} />;
}
