import { ReactElement } from "react";
import NextLink from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Stack,
  Link,
  Grid,
  Typography,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { fDateTimeSuffix } from "src/utils/formatTime";
// layouts
import Layout from "src/layouts";
// sections
import ApiFormStoreTable from "src/components/api_form/ApiFormStoreTable";
// components
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
// endponts
import { apiSettings } from "../../frontend-utils/settings";
// types
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
// redux
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import {
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { PATH_DASHBOARD, PATH_STORE } from "src/routes/paths";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import { STATUS, Store, Update } from "src/frontend-utils/types/store";

// ----------------------------------------------------------------------

Stores.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Stores() {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const fieldsMetadata = [
    {
      fieldType: "select" as "select",
      name: "countries",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "countries"),
    },
    {
      fieldType: "select" as "select",
      name: "types",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "types"),
    },
  ];

  const columns: GridColDef<Update>[] = [
    {
      headerName: "Nombre",
      field: "name",
      flex: 1,
      renderCell: (params) => (
        <NextLink
          href={`${PATH_STORE.root}/${apiResourceObjects[params.row.store].id}`}
          passHref
        >
          <Link>{apiResourceObjects[params.row.store].name}</Link>
        </NextLink>
      ),
    },
    {
      headerName: "País",
      field: "country",
      flex: 1,
      renderCell: (params) =>
        apiResourceObjects[
          (apiResourceObjects[params.row.store] as Store).country
        ].name,
    },
    {
      headerName: "Tipo",
      field: "type",
      flex: 1,
      renderCell: (params) =>
        apiResourceObjects[(apiResourceObjects[params.row.store] as Store).type]
          .name,
    },
    {
      headerName: "Última Actualización",
      field: "last_updated",
      renderCell: (params) =>
        params.row.last_updated
          ? fDateTimeSuffix(params.row.last_updated)
          : "Inactiva",
      flex: 1,
    },
    // {
    //   headerName: "Scraper",
    //   field: "storescraper_class",
    //   flex: 1,
    //   renderCell: (params) =>
    //     (apiResourceObjects[params.row.store] as Store).storescraper_class,
    // },
    {
      headerName: "Estado",
      field: "state",
      flex: 1,
      renderCell: (params) =>
        params.row.status === 3 && !params.row.available_products_count
          ? "Error"
          : STATUS[params.row.status as 1 | 2 | 3 | 4],
    },
    {
      headerName: "Result",
      field: "result",
      flex: 1,
      renderCell: (params) => {
        const l = params.row;
        const text = l.available_products_count
          ? `${l.available_products_count} / ${l.unavailable_products_count} / ${l.discovery_urls_without_products_count}`
          : "N/A";
        return (
          <Typography noWrap variant="body2">
            {text}
          </Typography>
        );
      },
    },
  ];

  return (
    <Page title="Tiendas">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Tiendas", href: PATH_STORE.root },
          ]}
        />

        <ApiFormComponent
          fieldsMetadata={fieldsMetadata}
          endpoint={
            apiSettings.apiResourceEndpoints.store_update_logs + "latest/"
          }
        >
          <Stack spacing={3}>
            <Card>
              <CardHeader title="Filtros" />
              <CardContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 6, md: 12 }}
                >
                  <Grid item xs={6}>
                    <ApiFormSelectComponent name="countries" label="Países" />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent name="types" label="Tipos" />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card>
              <CardHeader title="Listado de Tiendas" />
              <CardContent>
                <ApiFormStoreTable columns={columns} />
              </CardContent>
            </Card>
          </Stack>
        </ApiFormComponent>
      </Container>
    </Page>
  );
}
