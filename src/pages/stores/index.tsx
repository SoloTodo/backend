import { ReactElement } from "react";
import { Card, CardContent, CardHeader, Container, Stack } from "@mui/material";
import { Masonry } from "@mui/lab";
// layouts
import Layout from "src/layouts";
// sections
import ApiFormResultsTable from "src/components/api_form/ApiFormResultsTable";
// components
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
// endponts
import { apiSettings } from "../../frontend-utils/settings";
// class
import { ApiForm } from "../../frontend-utils/api_form/ApiForm";
// types
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import { ApiFormSelectProps } from "src/frontend-utils/api_form/fields/select/ApiFormSelect";
// redux
import { useAppSelector } from "src/store/hooks";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { wrapper } from "src/store/store";

// ----------------------------------------------------------------------

Stores.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

type StoresProps = {
  initialData: Record<string, any> | null;
  initialResult: any;
  fieldsMetadata: ApiFormSelectProps[];
};

// ----------------------------------------------------------------------

export default function Stores(props: StoresProps) {
  const { initialResult, initialData, fieldsMetadata } = props;
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const initialState = {
    initialResult,
    initialData
  }

  return (
    <Page title="Tiendas">
      <ApiFormComponent
        fieldsMetadata={fieldsMetadata}
        endpoint={apiSettings.apiResourceEndpoints.stores}
        initialState={initialState}
      >
        <Container>
          <Stack spacing={3}>
            <Card>
              <CardHeader title="Filtros" />
              <CardContent>
                <Masonry columns={2} spacing={3}>
                  <ApiFormSelectComponent name="countries" />
                  <ApiFormSelectComponent name="types" />
                </Masonry>
              </CardContent>
            </Card>
            <Card>
              <CardHeader title="Listado de Tiendas" />
              <CardContent>
                <ApiFormResultsTable apiResourceObjects={apiResourceObjects} />
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </ApiFormComponent>
    </Page>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(store => async (context) => {
  const apiResourceObjects = store.getState().apiResourceObjects;

  const fieldsMetadata = [
    {
      fieldType: "select" as "select",
      name: "countries",
      label: "Países",
      multiple: true,
      choices: Object.values(apiResourceObjects).reduce(
        (acc: { label: string; value: number }[], r) => {
          if (r.url.includes("countries")) {
            return [...acc, { label: r.name, value: r.id }];
          }
          return acc;
        },
        []
      ),
    },
    {
      fieldType: "select" as "select",
      name: "types",
      label: "Tipos",
      multiple: true,
      choices: Object.values(apiResourceObjects).reduce(
        (acc: { label: string; value: number }[], r) => {
          if (r.url.includes("types")) {
            return [...acc, { label: r.name, value: r.id }];
          }
          return acc;
        },
        []
      ),
    },
  ];

  const form = new ApiForm(
    fieldsMetadata,
    apiSettings.apiResourceEndpoints.stores
  );
  form.initialize(context);
  const data = form.isValid() ? await form.submit() : null;

  return {
    props: {
      initialResult: data,
      initialData: form.getCleanedData(),
      fieldsMetadata: fieldsMetadata
    },
  };
});
