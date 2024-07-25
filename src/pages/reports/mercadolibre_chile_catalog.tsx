import { Card, CardContent, CardHeader, Container, Grid } from "@mui/material";
import { ReactElement } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import ApiFormSubmitComponent from "src/frontend-utils/api_form/fields/submit/ApiFormSubmitComponent";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { apiSettings } from "src/frontend-utils/settings";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_REPORTS } from "src/routes/paths";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { useSnackbar } from "notistack";
import ApiFormTextComponent from "../../frontend-utils/api_form/fields/text/ApiFormTextComponent";

// ----------------------------------------------------------------------

MercadoLibreChileCatalog.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function MercadoLibreChileCatalog() {
  const { enqueueSnackbar } = useSnackbar();

  const fieldsMetadata = [
    {
      fieldType: "select" as "select",
      name: "seller_id",
      multiple: false,
      required: true,
      choices: [
        {
          value: "176688303",
          label: "Dreamtec (176688303)",
        },
      ],
    },
    {
      fieldType: "submit" as "submit",
    },
  ];

  return (
    <Page title="Análisis de Catálogo en MercadoLibre | Reportes">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Reportes", href: PATH_REPORTS.root },
            { name: "Análisis de catálogo en MercadoLibre" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldsMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.reports}mercadolibre_chile_catalog_report/`}
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
                  <ApiFormSelectComponent name="seller_id" label="Seller" />
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
