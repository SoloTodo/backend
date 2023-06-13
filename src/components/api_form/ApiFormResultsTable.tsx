import { useContext } from "react";
// @mui
import { Box, CircularProgress } from "@mui/material";
import { GridColDef, GridRowIdGetter } from "@mui/x-data-grid";
// components
import Scrollbar from "../Scrollbar";
// context
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import { StyledDataGrid } from "../my_components/StyledDatGrid";

export default function ApiFormResultsTable({
  columns,
  getRowId,
}: {
  columns: GridColDef[];
  getRowId?: GridRowIdGetter<any>;
}) {
  const context = useContext(ApiFormContext);
  const data = context.currentResult;

  return context.isLoading ? (
    <Box textAlign="center">
      <CircularProgress color="inherit" />
    </Box>
  ) : (
    <Scrollbar>
      <Box sx={{ height: "70vh", width: "100%" }}>
        <StyledDataGrid
          columns={columns}
          rows={data ? data : []}
          rowsPerPageOptions={[100]}
          getRowId={getRowId}
          rowHeight={104}
          disableColumnSelector
        />
      </Box>
    </Scrollbar>
  );
  // <CustomTable data={data ? data : []} columns={columns} />
}
