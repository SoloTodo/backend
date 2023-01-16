import { ReactElement } from "react";
import { Container, Link } from "@mui/material";
// layout
import Layout from "src/layouts";
// components
import Page from "src/components/Page";
import PaginationTable from "src/components/api_form/ApiFormPaginationTable";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
// settings
import { apiSettings } from "src/frontend-utils/settings";
// fetch
import { fDateTimeSuffix } from "src/utils/formatTime";
import { Store, Update } from "src/frontend-utils/types/store";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import { PATH_DASHBOARD, PATH_STORE } from "src/routes/paths";
import { getStore } from "src/frontend-utils/nextjs/utils";
import { NextPageContext } from "next/types";

// ----------------------------------------------------------------------

StoreUpdateLogs.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function StoreUpdateLogs(props: { store: Store }) {
  const { store } = props;
  const fieldMetadata = [
    {
      fieldType: "pagination" as "pagination",
      name: "udpate_logs",
    },
  ];

  const columns: any[] = [
    {
      headerName: "Nombre",
      field: "store",
      flex: 1,
      renderCell: (params: Update) =>
        params.status === 3 && params.available_products_count !== 0
          ? "Exitosa"
          : params.status === 2
          ? "En proceso"
          : "Error",
    },
    {
      headerName: "Resultado",
      field: "resultado",
      flex: 1,
      renderCell: (params: Update) =>
        params.status === 3 && params.available_products_count !== 0
          ? `${params.available_products_count} / ${params.unavailable_products_count} / ${params.discovery_urls_without_products_count}`
          : "N/A",
    },
    {
      headerName: "Última actualización",
      field: "last_updated",
      flex: 1,
      renderCell: (params: Update) => fDateTimeSuffix(params.last_updated),
    },
    {
      headerName: "Categorías",
      field: "id",
      flex: 1,
      renderCell: (params: Update) =>
        params.categories.reduce((acc: string, a: { name: string }) => {
          if (acc === "") {
            return a.name;
          }
          return acc + " / " + a.name;
        }, ""),
    },
    {
      headerName: "Inicio",
      field: "creation_date",
      flex: 1,
      renderCell: (params: Update) => fDateTimeSuffix(params.creation_date),
    },
    {
      headerName: "Registro",
      field: "registry_file",
      flex: 1,
      renderCell: (params: Update) =>
        params.registry_file ? (
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={params.registry_file}
          >
            Descargar
          </Link>
        ) : (
          "No disponible"
        ),
    },
  ];

  return (
    <Page title={`${store.name} | Registros de actualización`}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Tiendas", href: PATH_STORE.root },
            { name: `${store.name}`, href: `${PATH_STORE.root}/${store.id}` },
            { name: "Registros de actualización" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.store_update_logs}?store=${store.id}`}
        >
          <PaginationTable
            title="Registros de actualización"
            columns={columns}
          />
        </ApiFormComponent>
      </Container>
    </Page>
  );
}

export const getServerSideProps = async (context: NextPageContext) => {
  return await getStore(context);
};
