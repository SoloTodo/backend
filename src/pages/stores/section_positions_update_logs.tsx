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
import {STATUS, Store, StoreSectionPositionsUpdateLog, Update} from "src/frontend-utils/types/store";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import CustomTable from "../../sections/CustomTable";

// ----------------------------------------------------------------------

Stores.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Stores() {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const [lastUpdates, setLastUpdates] = useState<Record<string, StoreSectionPositionsUpdateLog> | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    jwtFetch(
      null,
      apiSettings.apiResourceEndpoints.store_section_positions_update_logs + "latest/"
    ).then((res) => {
      setLastUpdates(res);
      setLoading(false);
    });
  }, []);

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
    {
      headerName: "Estado",
      field: "state",
      flex: 1,
      renderCell: (params) =>
        !loading && lastUpdates && lastUpdates[params.row.url] ? (
            STATUS[lastUpdates[params.row.url].status as 1 | 2 | 3 | 4]
        ) : (
          <Box>
            <CircularProgress />
          </Box>
        ),
    },
      {
      headerName: "Registro",
      field: "updateId",
      flex: 1,
      renderCell: (params) =>
          !loading && lastUpdates && lastUpdates[params.row.url] ? (
            <NextLink
            href={'/store_section_positions_update_logs/' + lastUpdates[params.row.url].id}
            passHref
          >
            <Link>Visualizar</Link>
          </NextLink>
        ) : (
          <Box>
            <CircularProgress />
          </Box>
        )
    },
  ];

  const stores = lastUpdates ? Object.keys(lastUpdates).map((url) => apiResourceObjects[url]) : [];

  return (
    <Page title="Tiendas - Últimas actualizaciones de posicionamiento">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Tiendas", href: PATH_STORE.root },
            { name: "Últimas actualizaciones de posicionamiento" },
          ]}
        />

          <Stack spacing={3}>
            <Card>
              <CardHeader title="Últimas actualizaciones de posicionamiento" />
              <CardContent>
                <CustomTable data={stores} columns={columns} />
              </CardContent>
            </Card>
          </Stack>
      </Container>
    </Page>
  );
}
