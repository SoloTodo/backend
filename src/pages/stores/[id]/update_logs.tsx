import { ReactElement } from "react";
import { useRouter } from "next/router";
import { Container, Link } from "@mui/material";
import { GetServerSideProps } from "next/types";
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
import { ApiForm } from "src/frontend-utils/api_form/ApiForm";
import { PATH_DASHBOARD, PATH_STORE } from "src/routes/paths";
// redux
import { useAppSelector } from "src/store/hooks";
import { apiResourceObjectsByIdOrUrl, useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";

// ----------------------------------------------------------------------

StoreUpdateLogs.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function StoreUpdateLogs(props: Record<string, any>) {
  const { initialResult, initialData, fieldMetadata } = props;
  const initialState = {
    initialResult,
    initialData,
  };

  const router = useRouter();
  const { id } = router.query;
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const stores: {[key: string]: Store} = apiResourceObjectsByIdOrUrl(apiResourceObjects, "stores", "id");
  let store = {
    name: "",
    id: 0
  }
  if (typeof id === 'string' && stores.hasOwnProperty(id)) {
    store = stores[id];
  }

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
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Tiendas", href: PATH_STORE.root },
            { name: `${store.name}`, href: `${PATH_STORE.root}/${store.id}` },
            { name: "Registros de Actualización" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.store_update_logs}?store=${store.id}`}
          initialState={initialState}
        >
          <PaginationTable
            title="Registros de Actualización"
            paginationName="udpate_logs"
            columns={columns}
          />
        </ApiFormComponent>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (context.params) {
    const fieldMetadata = [
      {
        fieldType: "pagination" as "pagination",
        name: "udpate_logs",
      },
    ];
    const form = new ApiForm(
      fieldMetadata,
      `${apiSettings.apiResourceEndpoints.store_update_logs}?store=${context.params.id}`
    );
    form.initialize(context);
    const data = form.isValid()
      ? await form.submit()
      : null;
    return {
      props: {
        initialResult: data,
        initialData: form.getCleanedData(),
        fieldMetadata: fieldMetadata,
      },
    };
  } else {
    return {
      props: {
        initialResult: [],
        initialData: [],
        fieldMetadata: [],
      },
    };
  }
};
