import { ReactElement } from "react";
import { Container, Link } from "@mui/material";
import { GetServerSideProps } from "next/types";
// layout
import Layout from "src/layouts";
// components
import Page from "src/components/Page";
import PaginationTable from "src/sections/PaginationTable";
// settings
import { apiSettings } from "src/frontend-utils/settings";
// fetch
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { fDateTimeSuffix } from "src/utils/formatTime";
import { useRouter } from "next/router";
import { Update } from "src/frontend-utils/types/store";

// ----------------------------------------------------------------------

StoreUpdateLogs.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function StoreUpdateLogs(props: Record<string, any>) {
  const { latest } = props;
  const router = useRouter()

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
      renderCell: (params: Update) => params.categories.length,
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
      renderCell: (params: Update) => (
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={params.registry_file}
        >
          Descargar
        </Link>
      ),
    },
  ];

  return (
    <Page title="Registros de Actualización">
      <Container>
        <PaginationTable
          title="Registros de Actualización"
          columns={columns}
          data={latest}
          query={router.query}
        />
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let latest = {};
  if (context.params) {
    latest = await jwtFetch(
      context,
      apiSettings.apiResourceEndpoints.store_update_logs +
        `?store=${context.params.id}&page_size=5&page=${
          context.query.page ? context.query.page : 1
        }`
    );
  }
  return {
    props: {
      latest: latest,
    },
  };
};
