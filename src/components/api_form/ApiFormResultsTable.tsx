import { FC, useContext } from "react";
// @mui
import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
// components
import Scrollbar from "../Scrollbar";
// context
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import { fDateTimeSuffix } from "src/utils/formatTime";
import { ApiResourceObjectRecord } from "src/frontend-utils/redux/api_resources/apiResources";


export default function ApiFormResultsTable({apiResourceObjects}: { apiResourceObjects: ApiResourceObjectRecord }) {
  const context = useContext(ApiFormContext);
  const stores = context.currentResult;

  const columns: GridColDef[] = [
    {
      headerName: "Nombre",
      field: "name",
      flex: 1,
    },
    {
      headerName: "País",
      field: "country",
      flex: 1,
      renderCell: params => apiResourceObjects[params.row.country].name
    },
    {
      headerName: "Tipo",
      field: "type",
      flex: 1,
      renderCell: params => apiResourceObjects[params.row.type].name
    },
    {
      headerName: "Última Activación",
      field: "last_activation",
      renderCell: params =>
        params.row.last_activation ? fDateTimeSuffix(params.row.last_activation) : "Inactiva",
      flex: 1,
    },
    {
      headerName: "Scraper",
      field: "storescraper_class",
      flex: 1,
    },
  ];

  return (
    <Scrollbar>
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid columns={columns} rows={stores} />
      </Box>
    </Scrollbar>
  );
}
