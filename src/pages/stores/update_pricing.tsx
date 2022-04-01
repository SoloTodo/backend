import { ReactElement } from "react";
import NextLink from "next/link";
import { Container, Link, Stack } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { GetServerSideProps } from "next/types";
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

import { Store } from "src/frontend-utils/types/store";
import { PATH_DASHBOARD, PATH_STORE } from "src/routes/paths";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import UpdateStorePricingForm from "src/sections/stores/UpdateStorePriceForm";

// ----------------------------------------------------------------------

UpdatePricing.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function UpdatePricing(props: Record<string, any>) {
  const { stores, latest, categories } = props;

  const latestActive = stores.reduce((acc: any[], a: Store) => {
    if (a.last_activation) {
      const l = latest[a.url];
      const exito = l.status === 3 && l.available_products_count !== 0;
      acc.push({
        ...l,
        store: a.name,
        storeId: a.id,
        status: exito ? "Exitosa" : l.status === 2 ? "En proceso" : "Error",
        resultado: exito
          ? `${l.available_products_count} / ${l.unavailable_products_count} / ${l.discovery_urls_without_products_count}`
          : "N/A",
      });
    }
    return acc;
  }, []);

  const columns: GridColDef[] = [
    {
      headerName: "Nombre",
      field: "store",
      flex: 1,
      renderCell: (params) => (
        <NextLink href={`${PATH_STORE.root}/${params.row.storeId}`} passHref>
          <Link>{params.row.store}</Link>
        </NextLink>
      ),
    },
    {
      headerName: "Estado",
      field: "status",
      flex: 1,
    },
    {
      headerName: "Resultado",
      field: "resultado",
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
      <Container>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Tiendas", href: PATH_STORE.root },
            { name: "Actualizar pricing" },
          ]}
        />
        <Stack spacing={3}>
          <UpdateStorePricingForm
            store_scraping_options={{
              categories: categories,
              prefer_async: true,
            }}
            multi
            store_ids={[]}
          />
          <BasicTable title="Tiendas" columns={columns} data={latestActive} />
        </Stack>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const stores = await jwtFetch(
    context,
    apiSettings.apiResourceEndpoints.stores
  );
  const latest = await jwtFetch(
    context,
    apiSettings.apiResourceEndpoints.store_update_logs + "latest/"
  );
  const categories = await jwtFetch(
    context,
    apiSettings.apiResourceEndpoints.categories
  );
  return {
    props: {
      stores: Object.values(stores),
      latest: latest,
      categories: categories,
    },
  };
};
