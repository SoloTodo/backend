import { Box, Card, CardContent, CardHeader, Link, Stack } from "@mui/material";
import NextLink from "next/link";
import { DataGrid, GridColumns } from "@mui/x-data-grid";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { Entity } from "src/frontend-utils/types/entity";
import { PATH_ENTITY } from "src/routes/paths";
import { useAppSelector } from "src/store/hooks";
import LinkIcon from "@mui/icons-material/Link";
import CustomTable from "../CustomTable";
// currency
import currency from "currency.js";
import { Currency } from "src/frontend-utils/redux/api_resources/types";

export default function ActualPricesCard({ entities }: { entities: Entity[] }) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const active_entities = entities.filter(
    (entity) => entity.active_registry && entity.active_registry.is_available
  );
  const columns: GridColumns<any> = [
    {
      headerName: "Tienda",
      field: "store",
      flex: 1,
      renderCell: (params) => (
        <Stack alignItems={"center"} spacing={1} direction="row">
          <NextLink
            href={`${PATH_ENTITY.root}/${
              apiResourceObjects[params.row.store].id
            }`}
            passHref
          >
            <Link>{apiResourceObjects[params.row.store].name}</Link>
          </NextLink>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={params.row.external_url}
          >
            <LinkIcon />
          </Link>
        </Stack>
      ),
    },
    {
      headerName: "Precio normal",
      field: "active_registry.normal_price",
      flex: 1,
      renderCell: (params) =>
        currency(params.row.active_registry.normal_price, {
          precision: 0,
        }).format(),
    },
    {
      headerName: "Precio oferta",
      field: "active_registry.offer_price",
      flex: 1,
      renderCell: (params) =>
        currency(params.row.active_registry.offer_price, {
          precision: 0,
        }).format(),
    },
    {
      headerName: "Precio normal (USD)",
      field: "id",
      flex: 1,
      renderCell: (params) =>
        currency(params.row.active_registry.normal_price)
          .divide(
            (apiResourceObjects[params.row.currency] as Currency).exchange_rate
          )
          .format(),
    },
    {
      headerName: "Precio oferta (USD)",
      field: "key",
      flex: 1,
      renderCell: (params) =>
        currency(params.row.active_registry.offer_price)
          .divide(
            (apiResourceObjects[params.row.currency] as Currency).exchange_rate
          )
          .format(),
    },
  ];

  return (
    <Card>
      <CardHeader title="Precios actuales" />
      <CardContent>
        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid
            columns={columns}
            rows={active_entities}
            rowsPerPageOptions={[100]}
            disableSelectionOnClick
          />
        </Box>
      </CardContent>
    </Card>
  );
}
