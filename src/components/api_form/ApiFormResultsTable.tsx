import { useContext } from "react";
// @mui
import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
// components
import Scrollbar from "../Scrollbar";
// context
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";


export default function ApiFormResultsTable({columns}: { columns: GridColDef[] }) {
  const context = useContext(ApiFormContext);
  const stores = context.currentResult;

  return (
    <Scrollbar>
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid columns={columns} rows={stores ? stores : []} rowsPerPageOptions={[100]} />
      </Box>
    </Scrollbar>
  );
}
