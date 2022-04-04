import { ReactElement, useEffect, useState } from "react";
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
    name: "ordering" as "ordering",
  },
  {
    fieldType: "pagination" as "pagination",
    name: "page" as "page",
  },
  {
    fieldType: "pagination" as "pagination",
    name: "page_size" as "page_size",
  },
];

export default function Entities() {
  const [data, setData] = useState({
    results: [],
    count: 0,
  });
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const initialData: any = {
    page_size: 50,
    ordering: "name",
    ...router.query
  }
  const query = Object.keys(initialData).reduce((acc, a) => {
    return (acc = `${acc}${a}=${initialData[a]}&`);
  }, "");

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
    // {
    //   headerName: "Normal (orig.)",
    //   field: "id",
    //   flex: 1,
    //   renderCell: (row: any) => row.is_visible ? <CheckIcon /> : <ClearIcon />
    // },
    // {
    //   headerName: "Oferta (orig.)",
    //   field: "id",
    //   flex: 1,
    //   renderCell: (row: any) => row.is_visible ? <CheckIcon /> : <ClearIcon />
    // },
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

  useEffect(() => {
    setLoading(true);
    fetch(`${apiSettings.apiResourceEndpoints.entities}?${query}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (data.results.length === 0) return <></>;
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
        initialState={{
          initialData: initialData,
          initialResult: data,
        }}
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
          <ApiFormPaginationTable columns={columns} title="Entidades" />
        </Stack>
      </ApiFormComponent>
    </Page>
  );
}
