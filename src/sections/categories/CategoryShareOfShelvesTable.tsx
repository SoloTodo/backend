import { Box, CircularProgress } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useContext } from "react";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import { ApiFormSelect } from "src/frontend-utils/api_form/fields/select/ApiFormSelect";
import CustomTable from "../CustomTable";

export default function CategoryShareOfShelvesTable() {
  const context = useContext(ApiFormContext);
  const field = context.getField("bucketing_field") as
    | ApiFormSelect
    | undefined;

  let name = "Marca";
  if (field?.cleanedData) {
    name = field?.cleanedData[0].label;
  }

  const data = context.currentResult ? context.currentResult.results : [];

  const columns: GridColDef[] = [
    {
      headerName: name,
      field: "label",
    },
    {
      headerName: "Apariciones",
      field: "doc_count",
    },
  ];

  return context.isLoading ? (
    <Box textAlign="center">
      <CircularProgress color="inherit" />
    </Box>
  ) : (
    <CustomTable data={data ? data : []} columns={columns} />
  );
}
