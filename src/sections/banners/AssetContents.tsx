import { Button, Card, CardContent, CardHeader, Stack } from "@mui/material";
import { GridColumns } from "@mui/x-data-grid";
import { BannerAsset, Content } from "src/frontend-utils/types/banner";
import CustomTable from "../CustomTable";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";

export default function AssetContents({ asset }: { asset: BannerAsset }) {
  const handleDeleteContent = (id: number) => {
    console.log(id);
  };

  const columns: GridColumns<Content> = [
    {
      headerName: "Marca",
      field: "brand.name",
      flex: 1,
      renderCell: (params) => params.row.brand.name,
    },
    {
      headerName: "Categoría",
      field: "category.name",
      flex: 1,
      renderCell: (params) => params.row.category.name,
    },
    {
      headerName: "Porcentaje",
      field: "percentage",
      flex: 1,
      renderCell: (params) => `${params.row.percentage}%`,
    },
    {
      headerName: "Eliminar",
      field: "id",
      flex: 1,
      renderCell: (params) => (
        <Button
          color="error"
          variant="contained"
          onClick={() => handleDeleteContent(params.row.id)}
        >
          <DeleteIcon /> Eliminar
        </Button>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader
        title="Contenidos"
        action={
          <Stack spacing={1} direction="row">
            <Button color="success" variant="contained">
              <CheckIcon /> Completo!
            </Button>
            <Button variant="contained">Ver pendientes</Button>
          </Stack>
        }
      />
      <CardContent>
        <CustomTable data={asset.contents} columns={columns} />
      </CardContent>
    </Card>
  );
}
