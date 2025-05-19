import { ReactElement, useEffect, useState } from "react";
import NextLink from "next/link";
import { Box, CircularProgress, Container, Link, Stack } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
// layout
import Layout from "src/layouts";
// components
import Page from "src/components/Page";
import BasicTable from "src/sections/BasicTable";
// settings
import { apiSettings } from "src/frontend-utils/settings";
// fetch
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { fDateTimeSuffix } from "src/utils/formatTime";

import {
  Store,
  Update,
  STATUS,
  Category,
} from "src/frontend-utils/types/store";
import { PATH_DASHBOARD, PATH_STORE } from "src/routes/paths";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import UpdateStorePricingForm from "src/sections/stores/UpdateStorePriceForm";
// redux
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import {
  getApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";

// ----------------------------------------------------------------------

interface ExtendedUpdate extends Update {
  updateId: number;
  statusText: string;
  result: string;
}

// ----------------------------------------------------------------------

UpdatePricing.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function UpdatePricing() {
  const [latestActive, setLatestActive] = useState<ExtendedUpdate[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [selectedStoresIds, setSelectedStoresIds] = useState<number[]>([]);

  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const categories = getApiResourceObjects(
    apiResourceObjects,
    "categories"
  ) as Category[];
  const stores = getApiResourceObjects(apiResourceObjects, "stores") as Store[];

  useEffect(() => {
    const myAbortController = new AbortController();

    setLoading(true);
    jwtFetch(
      null,
      apiSettings.apiResourceEndpoints.store_update_logs + "latest/",
      { signal: myAbortController.signal }
    )
      .then((latest) => {
        const latestActive = stores.reduce(
          (acc: ExtendedUpdate[], a: Store) => {
            if (a.last_activation) {
              const l = latest[a.url];
              return [
                ...acc,
                {
                  ...l,
                  id: a.id,
                  store: a.name,
                  updateId: l.id,
                  statusText:
                    l.status === 3 && !l.available_products_count
                      ? "Error"
                      : STATUS[l.status as 1 | 2 | 3 | 4],
                  result: l.available_products_count
                    ? `${l.available_products_count} / ${l.unavailable_products_count} / ${l.discovery_urls_without_products_count}`
                    : "N/A",
                },
              ];
            }
            return acc;
          },
          []
        );
        setLatestActive(latestActive);
        setLoading(false);
      })
      .catch((_) => {});
    return () => {
      myAbortController.abort();
    };
  }, []);

  const columns: GridColDef[] = [
    {
      headerName: "Nombre",
      field: "store",
      flex: 1,
      renderCell: (params) => (
        <NextLink href={`${PATH_STORE.root}/${params.row.id}`} passHref>
          <Link>{params.row.store}</Link>
        </NextLink>
      ),
    },
    {
      headerName: "Estado",
      field: "statusText",
      flex: 1,
    },
    {
      headerName: "Resultado",
      field: "result",
      flex: 1,
    },
    {
      headerName: "Última actualización",
      field: "last_updated",
      flex: 1,
      renderCell: (params) => fDateTimeSuffix(params.row.last_updated),
    },
    {
      headerName: "Inicio",
      field: "creation_date",
      flex: 1,
      renderCell: (params) => fDateTimeSuffix(params.row.creation_date),
    },
    {
      headerName: "Registro",
      field: "updateId",
      flex: 1,
      renderCell: (params) =>
          <NextLink
            href={'/store_update_logs/' + params.row.updateId}
            passHref
          >
            <Link>Visualizar</Link>
          </NextLink>
    },
  ];

  return (
    <Page title="Actualizar Pricing">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Tiendas", href: PATH_STORE.root },
            { name: "Actualizar pricing" },
          ]}
        />
        {isLoading ? (
          <Box textAlign="center">
            <CircularProgress color="inherit" />
          </Box>
        ) : (
          <Stack spacing={3}>
            <UpdateStorePricingForm
              storeScrapingOptions={{
                categories: categories,
                prefer_async: true,
              }}
              multi
              storeIds={selectedStoresIds}
            />
            <BasicTable
              title="Tiendas"
              columns={columns}
              data={latestActive}
              setSelectedRows={setSelectedStoresIds}
            />
          </Stack>
        )}
      </Container>
    </Page>
  );
}
