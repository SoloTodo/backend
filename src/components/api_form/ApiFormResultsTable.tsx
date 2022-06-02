import { useContext } from "react";
// @mui
import { Box, CircularProgress } from "@mui/material";
import { GridColDef, GridRowIdGetter } from "@mui/x-data-grid";
// components
import Scrollbar from "../Scrollbar";
// context
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import { StyledDataGrid } from "../my_components/StyledDatGrid";
import CustomTable from "src/sections/CustomTable";

export default function ApiFormResultsTable({
  columns,
  getRowId,
  withPagination=true,
}: {
  columns: GridColDef[];
  getRowId?: GridRowIdGetter<any>;
  withPagination?: Boolean
}) {
  const context = useContext(ApiFormContext);
  const data = context.currentResult;

  return (
    context.isLoading ? (
      <Box textAlign="center">
        <CircularProgress color="inherit" />
      </Box>
    )
    : withPagination ? 
      <Scrollbar>
        <Box sx={{ height: "70vh", width: "100%" }}>
          <StyledDataGrid
            columns={columns}
            rows={data ? data : []}
            rowsPerPageOptions={[100]}
            getRowId={getRowId}
            rowHeight={104}
          />
        </Box>
      </Scrollbar>
    :
      <CustomTable data={data ? data : []} columns={columns} />
  );
}
