import { ReactElement } from "react";
import { Container, Link } from "@mui/material";
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

// ----------------------------------------------------------------------

UpdatePricing.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function UpdatePricing(props: Record<string, any>) {
  const { latest } = props;

  const columns: GridColDef[] = [
    {
      headerName: "Nombre",
      field: "store",
      flex: 1,
    },
    {
      headerName: "Estado",
      field: "status",
      flex: 1,
    },
    {
      headerName: "Resultado",
      field: "id",
      flex: 1,
    },
    {
      headerName: "Última actualización",
      field: "last_updated",
      flex: 1,
      renderCell: params => fDateTimeSuffix(params.row.last_updated),
    },
    {
      headerName: "Inicio",
      field: "creation_date",
      flex: 1,
      renderCell: params => fDateTimeSuffix(params.row.creation_date),
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
          Descargar
        </Link>
      ),
    },
  ];

  return (
    <Page title="Actualizar Pricing">
      <Container>
        <BasicTable title="Categorías" columns={columns} data={latest} />
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const latest = await jwtFetch(
    context,
    apiSettings.apiResourceEndpoints.store_update_logs + "latest/"
  );
  return {
    props: {
      latest: Object.values(latest),
    },
  };
};
