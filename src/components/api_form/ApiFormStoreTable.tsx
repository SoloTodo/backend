import { useContext } from "react";
// @mui
import { Box, CircularProgress } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
// context
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import CustomTable from "src/sections/CustomTable";

export default function ApiFormResultsTable({
  columns,
}: {
  columns: GridColDef[];
}) {
  const context = useContext(ApiFormContext);
  const data = context.currentResult
    ? Object.values(context.currentResult)
    : [];

  return context.isLoading ? (
    <Box textAlign="center">
      <CircularProgress color="inherit" />
    </Box>
  ) : (
    <CustomTable data={data ? data : []} columns={columns} />
  );
}
