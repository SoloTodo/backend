import { ReactElement } from "react";
import { Card, CardContent, CardHeader, Container, Stack } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { GetServerSideProps } from "next/types";
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
import { ApiForm } from "../../frontend-utils/api_form/api_form";
// types
import { ApiFormInitialState } from "src/frontend-utils/api_form/types";
import ApiFormSelectComponent from "src/frontend-utils/api_form/data_entry/select/ApiFormSelectComponent";
import { Masonry } from "@mui/lab";
// redux
import { useAppSelector } from "src/store/hooks";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";

// ----------------------------------------------------------------------

Stores.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

type StoresProps = {
  initialState: ApiFormInitialState;
};

const fieldsMetadata = [
  {
    fieldType: "select" as "select",
    name: "countries",
    label: "Países",
    multiple: true,
    choices: [
      // {
      //   value: 1,
      //   label: "Chile",
      // },
      // {
      //   value: 2,
      //   label: "Perú",
      // },
    ],
  },
  {
    fieldType: "select" as "select",
    name: "store_types",
    label: "Tipos",
    multiple: true,
    choices: [
     
    ],
  },
];

// ----------------------------------------------------------------------

export default function Stores(props: StoresProps) {
  const initialState = props.initialState;
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

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
      name: "store_types",
      label: "Tipos",
      multiple: true,
      choices: Object.values(apiResourceObjects).reduce(
        (acc: { label: string; value: number }[], r) => {
          if (r.url.includes("store_types")) {
            return [...acc, { label: r.name, value: r.id }];
          }
          return acc;
        },
        []
      ),
    },
  ];

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
                  <ApiFormSelectComponent name="store_types" />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const form = new ApiForm(
    fieldsMetadata,
    apiSettings.apiResourceEndpoints.stores
  );
  form.initialize(context);
  const data = form.isValid() ? await form.submit() : null;

  return {
    props: {
      initialState: {
        initialResult: data,
        initialData: form.getCleanedData(),
      },
    },
  };
};
