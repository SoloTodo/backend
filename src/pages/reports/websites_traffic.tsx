import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Stack,
} from "@mui/material";
import { GetServerSideProps } from "next/types";
import { useSnackbar } from "notistack";
import { ReactElement } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormDatePickerComponent from "src/frontend-utils/api_form/fields/date_picker/ApiDatePickerComponent";
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import ApiFormSubmitComponent from "src/frontend-utils/api_form/fields/submit/ApiFormSubmitComponent";
import ApiFormTextComponent from "src/frontend-utils/api_form/fields/text/ApiFormTextComponent";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import {
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { apiSettings } from "src/frontend-utils/settings";
import { Website } from "src/frontend-utils/types/product";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_REPORTS } from "src/routes/paths";
import { useAppSelector } from "src/store/hooks";

// ----------------------------------------------------------------------

WebsitesTraffic.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function WebsitesTraffic({ websites }: { websites: Website[] }) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const { enqueueSnackbar } = useSnackbar();

  const websiteChoices = websites.map((w) => ({ label: w.name, value: w.id }));

  const fieldsMetadata = [
    {
      fieldType: "date" as "date",
      name: "timestamp_after",
      label: "Desde",
    },
    {
      fieldType: "date" as "date",
      name: "timestamp_before",
      label: "Hasta",
    },
    {
      fieldType: "select" as "select",
      name: "categories",
      label: "Categorías",
      multiple: true,
      required: true,
      choices: selectApiResourceObjects(apiResourceObjects, "categories"),
    },
    {
      fieldType: "select" as "select",
      name: "currency",
      label: "Moneda",
      multiple: false,
      choices: selectApiResourceObjects(apiResourceObjects, "currencies"),
    },
    {
      fieldType: "select" as "select",
      name: "stores",
      label: "Tiendas",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "stores"),
    },
    {
      fieldType: "select" as "select",
      name: "websites",
      label: "Sitios",
      multiple: true,
      choices: websiteChoices,
    },
    {
      fieldType: "select" as "select",
      name: "countries",
      label: "Países",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "countries"),
    },
    {
      fieldType: "select" as "select",
      name: "store_types",
      label: "Tipos",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "types"),
    },
    {
      fieldType: "text" as "text",
      name: "filename_optional",
      label: "Nombre de archivo (opcional)",
      inputType: "text" as "text",
    },
    {
      fieldType: "submit" as "submit",
      name: "submit",
    },
  ];

  return (
    <Page title="Tráfico en sitios | Reportes">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Reportes", href: PATH_REPORTS.root },
            { name: "Tráfico en sitios" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldsMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.reports}websites_traffic/`}
          requiresSubmit={true}
          onResultsChange={(json: { url: string }) => {
            if (json) window.location.href = json.url;
          }}
        >
          <Card>
            <CardHeader title="Filtros" />
            <CardContent>
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 6, md: 12 }}
              >
                <Grid item xs={6}>
                  <Stack spacing={2} direction="row">
                    <ApiFormDatePickerComponent name="timestamp_after" />
                    <ApiFormDatePickerComponent name="timestamp_before" />
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="categories" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="currency" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="stores" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="websites" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="countries" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="store_types" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormTextComponent name="filename_optional" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSubmitComponent name="submit" />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </ApiFormComponent>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const websites = await jwtFetch(
    context,
    apiSettings.apiResourceEndpoints.websites
  );
  return {
    props: {
      websites: websites,
    },
  };
};
