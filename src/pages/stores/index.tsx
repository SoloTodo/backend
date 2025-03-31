import { ReactElement, useEffect, useState } from "react";
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
  CircularProgress,
  Box,
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
import { jwtFetch } from "src/frontend-utils/nextjs/utils";

// ----------------------------------------------------------------------

Stores.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Stores() {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const [lastUpdates, setLastUpdates] = useState<Record<string, Update> | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    jwtFetch(
      null,
      apiSettings.apiResourceEndpoints.store_update_logs + "latest/"
    ).then((res) => {
      setLastUpdates(res);
      setLoading(false);
    });
  }, []);

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

  const columns: GridColDef<Store>[] = [
    {
      headerName: "Nombre",
      field: "name",
      flex: 1,
      renderCell: (params) => (
        <NextLink href={`${PATH_STORE.root}/${params.row.id}`} passHref>
          <Link>{params.row.name}</Link>
        </NextLink>
      ),
    },
    {
      headerName: "País",
      field: "country",
      flex: 1,
      renderCell: (params) => apiResourceObjects[params.row.country].name,
    },
    {
      headerName: "Tipo",
      field: "type",
      flex: 1,
      renderCell: (params) => apiResourceObjects[params.row.type].name,
    },
    {
      headerName: "Última Actualización",
      field: "last_updated",
      renderCell: (params) =>
        !loading && lastUpdates ? (
          lastUpdates[params.row.url] ? (
            <Typography noWrap variant="body2">
              {fDateTimeSuffix(lastUpdates[params.row.url].last_updated)}
            </Typography>
          ) : (
            "Inactiva"
          )
        ) : (
          <Box>
            <CircularProgress />
          </Box>
        ),
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
      renderCell: (params) => {
        if (loading || !lastUpdates) {
          return <Box>
            <CircularProgress />
          </Box>
        } else if (!lastUpdates[params.row.url]) {
          return 'Sin información'
        } else if (lastUpdates[params.row.url].status === 3 &&
          !lastUpdates[params.row.url].available_products_count) {
          return "Error"
        } else {
          return STATUS[lastUpdates[params.row.url].status as 1 | 2 | 3 | 4]
        }}
    },
    {
      headerName: "Result",
      field: "result",
      flex: 1,
      renderCell: (params) => {
        if (loading || !lastUpdates) {
          return (
            <Box>
              <CircularProgress />
            </Box>
          );
        }
        const l = lastUpdates[params.row.url];
        if (!l) {
          return "N/A"
        }
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
          endpoint={apiSettings.apiResourceEndpoints.stores}
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
