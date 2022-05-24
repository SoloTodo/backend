import { Card, CardContent, CardHeader, Container, Grid } from "@mui/material";
import { GetServerSideProps } from "next/types";
import { ReactElement } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import ApiFormSubmitComponent from "src/frontend-utils/api_form/fields/submit/ApiFormSubmitComponent";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import {
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { apiSettings } from "src/frontend-utils/settings";
import { Brand } from "src/frontend-utils/types/wtb";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_REPORTS } from "src/routes/paths";
import { useAppSelector } from "src/store/hooks";

// ----------------------------------------------------------------------

ReportWtbPrices.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function ReportWtbPrices({ brands }: { brands: Brand[] }) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const brandChoices = brands.map((b) => ({ label: b.name, value: b.id }));

  const fieldsMetadata = [
    {
      fieldType: "select" as "select",
      name: "wtb_brand",
      label: "Marcas",
      multiple: false,
      required: true,
      choices: brandChoices,
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
      name: "price_type",
      label: "Tipo de precio",
      multiple: false,
      required: true,
      choices: [
        { label: "Precio normal", value: "normal_price" },
        { label: "Precio oferta", value: "offer_price" },
      ],
    },
    {
      fieldType: "submit" as "submit",
      name: "submit",
    },
  ];

  return (
    <Page title="Precios WTB | Reportes">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Reportes", href: PATH_REPORTS.root },
            { name: "Precios WTB" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldsMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.reports}wtb_prices_report/`}
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
                  <ApiFormSelectComponent name="wtb_brand" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="stores" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="price_type" />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const brands = await jwtFetch(
    context,
    apiSettings.apiResourceEndpoints.wtb_brands
  );
  return {
    props: {
      brands: brands,
    },
  };
};
