import { Card, CardContent, CardHeader, Container, Grid } from "@mui/material";
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
import ApiFormDateRangePickerComponent from "src/frontend-utils/api_form/fields/range_picker/ApiFormDateRangePickerComponent";
import { useSnackbar } from "notistack";

// ----------------------------------------------------------------------

StoreAnalytics.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function StoreAnalytics() {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const { enqueueSnackbar } = useSnackbar();

  const fieldsMetadata = [
    {
      fieldType: "select" as "select",
      name: "store",
      multiple: false,
      required: false,
      choices: selectApiResourceObjects(apiResourceObjects, "stores"),
    },
    {
      fieldType: "select" as "select",
      name: "category",
      multiple: false,
      required: false,
      choices: selectApiResourceObjects(apiResourceObjects, "categories"),
    },
    {
      fieldType: "date_range" as "date_range",
      name: "timestamp",
      required: true,
    },
    {
      fieldType: "submit" as "submit",
    },
  ];

  return (
    <Page title="Analytics de tienda | Reportes">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Reportes", href: PATH_REPORTS.root },
            { name: "Analytics de tienda" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldsMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.reports}store_analytics/`}
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
                  <ApiFormSelectComponent name="category" label="Categoría" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormDateRangePickerComponent
                    name="timestamp"
                    label="Rango"
                  />
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
