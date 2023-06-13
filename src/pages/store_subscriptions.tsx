import { Container, Stack } from "@mui/material";
import { ReactElement } from "react";
import ApiFormPaginationTable from "src/components/api_form/ApiFormPaginationTable";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { apiSettings } from "src/frontend-utils/settings";
import { StoreSubscription } from "src/frontend-utils/types/store_subscription";
import Layout from "src/layouts";
import { PATH_DASHBOARD } from "src/routes/paths";
import AddStoreSubscription from "src/sections/store_subscription/AddStoreSubscription";
import DeleteStoreSubscription from "src/sections/store_subscription/DeleteStoreSubscription";
import { fDateTimeSuffix } from "src/utils/formatTime";

// ----------------------------------------------------------------------

StoreSubscriptionsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function StoreSubscriptionsPage() {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const fieldMetadata = [
    {
      fieldType: "pagination" as "pagination",
    },
  ];

  const columns: any[] = [
    {
      headerName: "Tienda",
      field: "store",
      flex: 1,
      renderCell: (row: StoreSubscription) =>
        apiResourceObjects[row.store].name,
    },
    {
      headerName: "Categorías",
      field: "categories",
      flex: 1,
      renderCell: (row: StoreSubscription) =>
        row.categories.reduce((acc, a) => {
          if (acc === "") {
            return apiResourceObjects[a].name;
          }
          return acc + " / " + apiResourceObjects[a].name;
        }, ""),
    },
    {
      headerName: "Fecha creación",
      field: "creation_date",
      renderCell: (row: StoreSubscription) =>
        fDateTimeSuffix(row.creation_date),
      flex: 1,
    },
    {
      headerName: "Eliminar",
      field: "id",
      renderCell: (row: StoreSubscription) => (
        <DeleteStoreSubscription storeSubscription={row} />
      ),
      flex: 1,
    },
  ];

  return (
    <Page title="Suscripciones a Tiendas">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Suscripciones a Tiendas" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.store_subscriptions}?ordering=id`}
        >
          <Stack spacing={3}>
            <AddStoreSubscription />
            <ApiFormPaginationTable
              columns={columns}
              title="Suscripciones a Tiendas"
            />
          </Stack>
        </ApiFormComponent>
      </Container>
    </Page>
  );
}
