import { ReactElement } from "react";
import { Card, CardContent, CardHeader, Container, Stack } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import { Masonry } from "@mui/lab";
// layouts
import Layout from "src/layouts";
// routes
import { PATH_DASHBOARD, PATH_ENTITY } from "src/routes/paths";
// components
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormPaginationTable from "src/components/api_form/ApiFormPaginationTable";
// api
import { apiSettings } from "src/frontend-utils/settings";
import { useRouter } from "next/router";

// ----------------------------------------------------------------------

Entities.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

const fieldMetadata = [
  {
    fieldType: "pagination" as "pagination",
    name: "entities",
  },
];

export default function Entities() {
  const columns: any[] = [
    {
      headerName: "Nombre",
      field: "name",
      flex: 1,
    },
    {
      headerName: "Tienda",
      field: "store",
      flex: 1,
    },
    {
      headerName: "SKU",
      field: "sku",
      flex: 1,
    },
    {
      headerName: "Categoría",
      field: "category",
      flex: 1,
    },
    {
      headerName: "Producto",
      field: "product",
      flex: 1,
      renderCell: (row: any) => (row.product ? row.product.name : "N/A"),
    },
    {
      headerName: "¿Disp?",
      field: "active_registry",
      flex: 1,
      renderCell: (row: any) =>
        row.active_registry && row.active_registry.is_available ? (
          <CheckIcon />
        ) : (
          <ClearIcon />
        ),
    },
    {
      headerName: "Act?",
      field: "key",
      flex: 1,
      renderCell: (row: any) =>
        row.active_registry ? (
          <CheckIcon />
        ) : (
          <ClearIcon />
        ),
    },
    {
      headerName: "Vis?",
      field: "is_visible",
      flex: 1,
      renderCell: (row: any) =>
        row.is_visible ? <CheckIcon /> : <ClearIcon />,
    },
    {
      headerName: "Normal (orig.)",
      field: "active_registry.normal_price",
      flex: 1,
      renderCell: (row: any) => row.active_registry ? <CheckIcon /> : "$ 0"
    },
    {
      headerName: "Oferta (orig.)",
      field: "active_registry.offer_price",
      flex: 1,
      renderCell: (row: any) => row.active_registry ? <CheckIcon /> : "$ 0"
    },
    // {
    //   headerName: "Normal (USD)",
    //   field: "id",
    //   flex: 1,
    //   renderCell: (row: any) => row.is_visible ? <CheckIcon /> : <ClearIcon />
    // },
    // {
    //   headerName: "Oferta (USD)",
    //   field: "id",
    //   flex: 1,
    //   renderCell: (row: any) => row.is_visible ? <CheckIcon /> : <ClearIcon />
    // },
  ];

  return (
    <Page title="Entidades">
      <Container>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Entidades", href: PATH_ENTITY.root },
          ]}
        />
      </Container>
      <ApiFormComponent
        fieldsMetadata={fieldMetadata}
        endpoint={apiSettings.apiResourceEndpoints.entities}
      >
        <Stack spacing={3}>
          <Card>
            <CardHeader title="Filtros" />
            <CardContent>
              {/* <Masonry columns={2} spacing={3}>
                <ApiFormSelectComponent name="countries" />
                <ApiFormSelectComponent name="types" />
              </Masonry> */}
            </CardContent>
          </Card>
          <ApiFormPaginationTable columns={columns} title="Entidades" paginationName="entities" />
        </Stack>
      </ApiFormComponent>
    </Page>
  );
}
