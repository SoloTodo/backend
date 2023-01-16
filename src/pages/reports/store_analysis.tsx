import { Card, CardContent, CardHeader, Container, Grid } from "@mui/material";
import { useSnackbar } from "notistack";
import { ReactElement } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import ApiFormSubmitComponent from "src/frontend-utils/api_form/fields/submit/ApiFormSubmitComponent";
import {
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { apiSettings } from "src/frontend-utils/settings";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_REPORTS } from "src/routes/paths";
import { useAppSelector } from "src/frontend-utils/redux/hooks";

// ----------------------------------------------------------------------

StoreAnalysis.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function StoreAnalysis() {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const { enqueueSnackbar } = useSnackbar();

  const fieldsMetadata = [
    {
      fieldType: "select" as "select",
      name: "store",
      multiple: false,
      required: true,
      choices: selectApiResourceObjects(apiResourceObjects, "stores"),
    },
    {
      fieldType: "select" as "select",
      name: "competing_stores",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "stores"),
    },
    {
      fieldType: "select" as "select",
      name: "categories",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "categories"),
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
      fieldType: "select" as "select",
      name: "price_type",
      multiple: false,
      required: true,
      choices: [
        { label: "Precio normal", value: "normal_price" },
        { label: "Precio oferta", value: "offer_price" },
      ],
    },
    {
      fieldType: "select" as "select",
      name: "layout",
      multiple: false,
      required: true,
      choices: [
        { label: "Layout 1", value: "layout_1" },
        { label: "Layout 2", value: "layout_2" },
      ],
    },
    {
      fieldType: "submit" as "submit",
    },
  ];

  return (
    <Page title="Análisis de tienda | Reportes">
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
          endpoint={`${apiSettings.apiResourceEndpoints.reports}store_analysis/`}
          requiresSubmit={true}
          onResultsChange={() =>
            enqueueSnackbar(
              "El reporte está siendo generado. Una vez finalizado este será enviado a su correo"
            )
          }
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
                  <ApiFormSelectComponent name="store" label="Tienda" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="competing_stores" label="Tiendas para comparar" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="categories" label="Categorías" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="countries" label="Países" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="store_types" label="Tipos" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="price_type" label="Tipo de precio" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="layout" label="Layout" />
                </Grid>
                <Grid item xs={6} />
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
