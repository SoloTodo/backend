import NextLink from "next/link";
import { GridColumns } from "@mui/x-data-grid";
import { Position, Update } from "src/frontend-utils/types/keyword";
import { Link, Typography } from "@mui/material";
import { PATH_ENTITY } from "src/routes/paths";
import CustomTable from "../CustomTable";

export default function KeywordSearchUpdateTable({
  update,
  positions,
  withoutMinWidth,
}: {
  update: Update;
  positions: Position[];
  withoutMinWidth?: boolean;
}) {
  const columns: GridColumns<Position> = [
    {
      headerName: "Sku",
      field: "entity",
      flex: 1,
      renderCell: (params) => (
        <NextLink href={`${PATH_ENTITY.root}/${params.row.entity.id}`} passHref>
          <Link>{params.row.entity.name}</Link>
        </NextLink>
      ),
    },
    {
      headerName: "Posición",
      field: "value",
      flex: 1,
      renderCell: (params) => params.row.value,
    },
  ];

  const SUCESS = 2;
  const ERROR = 3;

  let noProductsMessage = "Búsqueda de keyword en Proceso.";
  // Exitoso
  if (update.status === SUCESS) {
    noProductsMessage = "La búsqueda del keyword no generó ningún resultado.";
  }
  // Error
  if (update.status === ERROR) {
    noProductsMessage = "Ocurrió un error durante la búsqueda del keyword.";
  }

  return positions.length !== 0 ? (
    <CustomTable
      data={positions}
      columns={columns}
      withoutMinWidth={withoutMinWidth}
    />
  ) : (
    <Typography>{noProductsMessage}</Typography>
  );
}
