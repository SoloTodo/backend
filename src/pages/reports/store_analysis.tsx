import { Card, CardContent, CardHeader, Container, Grid } from "@mui/material";
import { ReactElement } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import {
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { apiSettings } from "src/frontend-utils/settings";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_REPORTS } from "src/routes/paths";
import ApiFormSubmitButton from "src/sections/reports/ApiFormSubmitButton";
import { useAppSelector } from "src/store/hooks";

// ----------------------------------------------------------------------

StoreAnalysis.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function StoreAnalysis() {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const fieldsMetadata = [
    {
      fieldType: "select" as "select",
      name: "store",
      label: "Tiendas",
      multiple: false,
      required: true,
      choices: selectApiResourceObjects(apiResourceObjects, "stores"),
    },
    {
      fieldType: "select" as "select",
      name: "competing_stores",
      label: "Tiendas",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "stores"),
    },
    {
      fieldType: "select" as "select",
      name: "categories",
      label: "Categorías",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "categories"),
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
      fieldType: "select" as "select",
      name: "price_type",
      label: "Tipo de precio",
      multiple: false,
      required: true,
      choices: [
        { label: "Precio normal", value: "normal" },
        { label: "Precio oferta", value: "offer" },
      ],
    },
    {
      fieldType: "select" as "select",
      name: "layout",
      label: "Layout",
      multiple: false,
      required: true,
      choices: [
        { label: "Layout 1", value: "layout_1" },
        { label: "Layout 2", value: "layout_2" },
      ],
    },
  ];

  return (
    <Page title="Análisis de tienda">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Reportes", href: PATH_REPORTS.root },
            { name: "Análisis de tienda" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldsMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.reports}`}
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
                  <ApiFormSelectComponent name="store" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="competing_stores" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="categories" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="countries" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="store_types" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="price_type" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="layout" />
                </Grid>
                <Grid item xs={6}></Grid>
                <Grid item xs={6}>
                  <ApiFormSubmitButton
                    fields={[
                      "store",
                      "competing_stores",
                      "categories",
                      "countries",
                      "store_types",
                      "price_type",
                      "layout",
                    ]}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </ApiFormComponent>
      </Container>
    </Page>
  );
}
