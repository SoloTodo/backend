import { Card, CardContent, CardHeader, Container, Grid } from "@mui/material";
import { GetServerSideProps } from "next/types";
import { ReactElement } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormDateRangePickerComponent from "src/frontend-utils/api_form/fields/range_picker/ApiFormDateRangePickerComponent";
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
import { useAppSelector } from "src/frontend-utils/redux/hooks";

// ----------------------------------------------------------------------

WebsitesTraffic.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function WebsitesTraffic({ websites }: { websites: Website[] }) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const websiteChoices = websites.map((w) => ({ label: w.name, value: w.id }));

  const fieldsMetadata = [
    {
      fieldType: "date_range" as "date_range",
      name: "timestamp",
      required: true,
    },
    {
      fieldType: "select" as "select",
      name: "categories",
      multiple: true,
      required: true,
      choices: selectApiResourceObjects(apiResourceObjects, "categories"),
    },
    {
      fieldType: "select" as "select",
      name: "currency",
      multiple: false,
      choices: selectApiResourceObjects(apiResourceObjects, "currencies"),
    },
    {
      fieldType: "select" as "select",
      name: "stores",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "stores"),
    },
    {
      fieldType: "select" as "select",
      name: "websites",
      multiple: true,
      choices: websiteChoices,
    },
    {
      fieldType: "select" as "select",
      name: "countries",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "countries"),
    },
    {
      fieldType: "select" as "select",
      name: "store_types",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "types"),
    },
    {
      fieldType: "text" as "text",
      name: "filename_optional",
    },
    {
      fieldType: "submit" as "submit",
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
                  <ApiFormDateRangePickerComponent name="timestamp" label="Rango" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent
                    name="categories"
                    label="Categorías"
                  />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="currency" label="Moneda" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="stores" label="Tiendas" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="websites" label="Sitios" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="countries" label="Países" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="store_types" label="Tipos" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormTextComponent
                    name="filename_optional"
                    label="Nombre de archivo (opcional)"
                  />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSubmitComponent />
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
