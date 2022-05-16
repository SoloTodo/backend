import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Stack,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { ReactElement } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormDatePickerComponent from "src/frontend-utils/api_form/fields/date_picker/ApiDatePickerComponent";
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

PricesHistory.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function PricesHistory() {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const { enqueueSnackbar } = useSnackbar();

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
      name: "timezone",
      label: "Zona horaria",
      multiple: false,
      choices: [
        { label: "Chile Continental", value: "America/Santiago" },
        { label: "UTC", value: "UTC" },
      ],
    },
    {
      fieldType: "select" as "select",
      name: "exclude_unavailable",
      label: "¿Excluir no disponibles?",
      multiple: false,
      choices: choicesYesNo,
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
    <Page title="Precios históricos | Reportes">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Reportes", href: PATH_REPORTS.root },
            { name: "Precios históricos" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldsMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.reports}current_prices/`}
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
                  <ApiFormSelectComponent name="countries" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="store_types" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="exclude_unavailable" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="timezone" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormTextComponent name="filename_optional" />
                </Grid>
                <Grid item xs={6} />
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
