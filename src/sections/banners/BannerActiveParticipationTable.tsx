import { GridColDef } from "@mui/x-data-grid";
import { useContext } from "react";
import ApiFormStoreTable from "src/components/api_form/ApiFormStoreTable";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import { ApiFormSelect } from "src/frontend-utils/api_form/fields/select/ApiFormSelect";
import { Participation } from "src/frontend-utils/types/banner";

export default function BannerActiveParticipationTable() {
  const context = useContext(ApiFormContext);
  const field = context.getField("grouping_field") as ApiFormSelect | undefined;

  let name = "Marca";
  if (field?.cleanedData) {
    name = field?.cleanedData[0].label;
  }

  const columns: GridColDef<Participation>[] = [
    {
      headerName: name,
      field: "grouping_label",
    },
    {
      headerName: "Participación (puntaje)",
      field: "participation_score",
    },
    {
      headerName: "Participación (%)",
      field: "participation_percentage",
      renderCell: (params) => params.row.participation_percentage.toFixed(2),
    },
    {
      headerName: "Posición promedio",
      field: "position_avg",
      renderCell: (params) => params.row.position_avg.toFixed(2),
    },
  ];

  return <ApiFormStoreTable columns={columns} />;
}
