import { Container, Link } from "@mui/material";
import NextLink from "next/link";
import { ReactElement } from "react";
import ApiFormPaginationTable from "src/components/api_form/ApiFormPaginationTable";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { apiSettings } from "src/frontend-utils/settings";
import { Alert } from "src/frontend-utils/types/alert";
import Layout from "src/layouts";
import { PATH_ALERT, PATH_DASHBOARD, PATH_PRODUCT } from "src/routes/paths";
import { fDateTimeSuffix } from "src/utils/formatTime";

// ----------------------------------------------------------------------

Alerts.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Alerts() {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const fieldMetadata = [
    {
      fieldType: "pagination" as "pagination",
    },
  ];

  const columns: any[] = [
    {
      headerName: "Id",
      field: "id",
      flex: 1,
      renderCell: (row: Alert) => (
        <NextLink href={`${PATH_ALERT.root}/${row.id}`} passHref>
          <Link>{row.id || "N/A"}</Link>
        </NextLink>
      ),
    },
    {
      headerName: "Producto",
      field: "product",
      flex: 1,
      renderCell: (row: Alert) => (
        <NextLink href={`${PATH_PRODUCT.root}/${row.product.id}`} passHref>
          <Link>{row.product.name}</Link>
        </NextLink>
      ),
    },
    {
      headerName: "Tiendas",
      field: "stores",
      flex: 1,
      renderCell: (row: Alert) =>
        row.stores.reduce((acc, a) => {
          if (acc === "") {
            return apiResourceObjects[a].name;
          }
          return acc + " / " + apiResourceObjects[a].name;
        }, ""),
    },
    {
      headerName: "Fecha creación",
      field: "creation_date",
      renderCell: (row: Alert) => fDateTimeSuffix(row.creation_date),
      flex: 1,
    },
  ];

  return (
    <Page title="Alertas">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Alertas" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.alerts}?ordering=id`}
        >
          <ApiFormPaginationTable columns={columns} title="Alertas" />
        </ApiFormComponent>
      </Container>
    </Page>
  );
}
