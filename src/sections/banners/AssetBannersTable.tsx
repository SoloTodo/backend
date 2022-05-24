import { Banner } from "src/frontend-utils/types/banner";
import { fDateTimeSuffix } from "src/utils/formatTime";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import { useAppSelector } from "src/store/hooks";
import { Link, Stack } from "@mui/material";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { apiSettings } from "src/frontend-utils/settings";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormPaginationTable from "src/components/api_form/ApiFormPaginationTable";

export default function AssetBannersTable({ assetId }: { assetId: string }) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const fieldMetadata = [
    {
      fieldType: "pagination" as "pagination",
    },
  ];

  const columns: any[] = [
    {
      headerName: "Tienda",
      field: "store",
      flex: 1,
      renderCell: (row: Banner) => apiResourceObjects[row.update.store].name,
    },
    {
      headerName: "Subsección",
      field: "subseccion",
      flex: 1,
      renderCell: (row: Banner) => (
        <Link target="_blank" rel="noopener noreferrer" href={row.external_url}>
          {`${row.subsection.section.name} > ${row.subsection.name}`}
        </Link>
      ),
    },
    {
      headerName: "Destino",
      field: "destiny",
      flex: 1,
      renderCell: (row: Banner) =>
        row.destination_url_list.length !== 0 ? (
          <Stack spacing={1}>
            {row.destination_url_list.map((l) => (
              <Link target="_blank" rel="noopener noreferrer" href={l} key={l}>
                Link
              </Link>
            ))}
          </Stack>
        ) : (
          "Sin link"
        ),
    },
    {
      headerName: "Act?",
      field: "update",
      flex: 1,
      renderCell: (row: Banner) =>
        row.update.is_active ? <CheckIcon /> : <ClearIcon />,
    },
    {
      headerName: "Posición",
      field: "position",
      flex: 1,
    },
    {
      headerName: "Fecha creación",
      field: "last_updated",
      renderCell: (row: Banner) => fDateTimeSuffix(row.update.timestamp),
      flex: 1,
    },
  ];

  return (
    <ApiFormComponent
      fieldsMetadata={fieldMetadata}
      endpoint={`${apiSettings.apiResourceEndpoints.banners}?ordering=-id&asset=${assetId}`}
    >
      <ApiFormPaginationTable
        columns={columns}
        title="Banners"
      />
    </ApiFormComponent>
  );
}
