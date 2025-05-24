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
import NextLink from "next/link";

// ----------------------------------------------------------------------

StoreSectionPositionsUpdateLogs.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function StoreSectionPositionsUpdateLogs(props: { store: Store }) {
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
        params.status === 3
          ? "Exitosa"
          : params.status === 2
          ? "En proceso"
          : "Error",
    },
    {
      headerName: "Última actualización",
      field: "last_updated",
      flex: 1,
      renderCell: (params: Update) => fDateTimeSuffix(params.last_updated),
    },
    {
      headerName: "Inicio",
      field: "creation_date",
      flex: 1,
      renderCell: (params: Update) => fDateTimeSuffix(params.creation_date),
    },
    {
      headerName: "Registro",
      field: "updateId",
      flex: 1,
      renderCell: (params: Update) =>
          <NextLink
            href={'/store_section_positions_update_logs/' + params.id}
            passHref
          >
            <Link>Visualizar</Link>
          </NextLink>
    },
  ];

  return (
    <Page title={`${store.name} | Registros de actualización de posicionamiento`}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Tiendas", href: PATH_STORE.root },
            { name: `${store.name}`, href: `${PATH_STORE.root}/${store.id}` },
            { name: "Registros de actualización de posicionamiento" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.store_section_positions_update_logs}?store=${store.id}`}
        >
          <PaginationTable
            title="Registros de actualización de posicionamiento"
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
