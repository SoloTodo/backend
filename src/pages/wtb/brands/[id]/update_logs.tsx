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
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import { PATH_DASHBOARD, PATH_WTB } from "src/routes/paths";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
// types
import { Brand, Update } from "src/frontend-utils/types/wtb";
import { GetServerSideProps } from "next/types";

// ----------------------------------------------------------------------

BrandUpdateLogs.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function BrandUpdateLogs({ brand }: { brand: Brand }) {
  const fieldMetadata = [
    {
      fieldType: "pagination" as "pagination",
      name: "udpate_logs",
    },
  ];

  const columns: any[] = [
    {
      headerName: "Estado",
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
    <Page title={`${brand.name} | Registros de actualización`}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Donde Comprar", href: PATH_WTB.brands },
            { name: "Marcas", href: PATH_WTB.brands },
            { name: `${brand.name}`, href: `${PATH_WTB.brands}/${brand.id}` },
            { name: "Registros de actualización" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.wtb_brand_update_logs}?brand=${brand.id}`}
        >
          <PaginationTable
            title="Registros de actualización"
            paginationName="udpate_logs"
            columns={columns}
          />
        </ApiFormComponent>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    let brand = {};
    if (context.params) {
      try {
        brand = await jwtFetch(
          context,
          `${apiSettings.apiResourceEndpoints.wtb_brands}${context.params.id}/`
        );
      } catch {
        return {
          notFound: true,
        };
      }
    }
    return {
      props: {
        brand: brand,
      },
    };
  };