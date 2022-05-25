import { Card, CardContent, CardHeader, Container, Grid } from "@mui/material";
import { useSnackbar } from "notistack";
import { ReactElement } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormRangePickerComponent from "src/frontend-utils/api_form/fields/range_picker/ApiFormRangePickerComponent";
import ApiFormSelectComponent, {
  choicesYesNo,
} from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import ApiFormSubmitComponent from "src/frontend-utils/api_form/fields/submit/ApiFormSubmitComponent";
import ApiFormTextComponent from "src/frontend-utils/api_form/fields/text/ApiFormTextComponent";
import {
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { apiSettings } from "src/frontend-utils/settings";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_REPORTS } from "src/routes/paths";
import { useAppSelector } from "src/store/hooks";

// ----------------------------------------------------------------------

DailyPrices.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function DailyPrices() {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const { enqueueSnackbar } = useSnackbar();

  const fieldsMetadata = [
    {
      fieldType: "date_range" as "date_range",
      name: "timestamp",
      required: true,
    },
    {
      fieldType: "select" as "select",
      name: "category",
      multiple: false,
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
      name: "brand",
    },
    {
      fieldType: "select" as "select",
      name: "exclude_unavailable",
      multiple: false,
      required: true,
      choices: choicesYesNo,
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
    <Page title="Precios diarios | Reportes">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Reportes", href: PATH_REPORTS.root },
            { name: "Precios diarios" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldsMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.reports}daily_prices/`}
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
                  <ApiFormRangePickerComponent name="timestamp" label="Rango" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="category" label="Categoría" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="currency" label="Moneda" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="stores" label="Tiendas" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="countries" label="Países" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="store_types" label="Tipos" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormTextComponent name="brand" label="Marca" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent
                    name="exclude_unavailable"
                    label="¿Excluir no disponibles?"
                  />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormTextComponent
                    name="filename_optional"
                    label="Nombre de archivo (opcional)"
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