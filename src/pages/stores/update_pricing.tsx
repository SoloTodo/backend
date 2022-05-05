import { ReactElement, useEffect, useState } from "react";
import NextLink from "next/link";
import { Container, Link, Stack } from "@mui/material";
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

import { Store, Update, STATUS } from "src/frontend-utils/types/store";
import { PATH_DASHBOARD, PATH_STORE } from "src/routes/paths";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import UpdateStorePricingForm from "src/sections/stores/UpdateStorePriceForm";
// redux
import { useAppSelector } from "src/store/hooks";
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
  const [selectedStores, setSelectedStores] = useState([]);

  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const categories = Object.keys(
    getApiResourceObjects(apiResourceObjects, "categories")
  ) as string[];
  const stores = Object.values(
    getApiResourceObjects(apiResourceObjects, "stores")
  ) as Store[];

  useEffect(() => {
    setLoading(true);
    jwtFetch(
      null,
      apiSettings.apiResourceEndpoints.store_update_logs + "latest/"
    ).then((latest) => {
      const latestActive = stores.reduce((acc: ExtendedUpdate[], a: Store) => {
        if (a.last_activation) {
          const l = latest[a.url];
          const success =
            l.status === STATUS.success && l.available_products_count !== 0;
          return [
            ...acc,
            {
              ...l,
              id: a.id,
              store: a.name,
              updateId: l.id,
              statusText: success
                ? "Exitosa"
                : l.status === STATUS.in_progress
                ? "En proceso"
                : "Error",
              result: success
                ? `${l.available_products_count} / ${l.unavailable_products_count} / ${l.discovery_urls_without_products_count}`
                : "N/A",
            },
          ];
        }
        return acc;
      }, []);
      setLatestActive(latestActive);
      setLoading(false);
    });
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
      field: "registry_file",
      flex: 1,
      renderCell: (params) => (
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={params.row.registry_file}
        >
          {params.row.registry_file ? "Descargar" : "No disponible"}
        </Link>
      ),
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
          <p>Loading...</p>
        ) : (
          <Stack spacing={3}>
            <UpdateStorePricingForm
              storeScrapingOptions={{
                categories: categories,
                prefer_async: true,
              }}
              multi
              storeIds={selectedStores}
            />
            <BasicTable
              title="Tiendas"
              columns={columns}
              data={latestActive}
              setSelectedRows={setSelectedStores}
            />
          </Stack>
        )}
      </Container>
    </Page>
  );
}
