import { useContext } from "react";
// @mui
import { Box } from "@mui/material";
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
  const stores = context.currentResult;

  return (
    <Scrollbar>
      <Box sx={{ height: "70vh", width: "100%" }}>
        <StyledDataGrid
          columns={columns}
          rows={stores ? stores : []}
          rowsPerPageOptions={[100]}
          getRowId={getRowId}
          rowHeight={104}
        />
      </Box>
    </Scrollbar>
  );
}
