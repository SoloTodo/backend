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
import { PATH_DASHBOARD, PATH_KEYWORD, PATH_REPORTS } from "src/routes/paths";
import { useAppSelector } from "src/frontend-utils/redux/hooks";

// ----------------------------------------------------------------------

ReportActive.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function ReportActive({ brands }: { brands: Brand[] }) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const brandChoices = brands.map((b) => ({ label: b.name, value: b.id }));

  const fieldsMetadata = [
    {
      fieldType: "select" as "select",
      name: "brands",
      multiple: true,
      choices: brandChoices,
    },
    {
      fieldType: "select" as "select",
      name: "categories",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "categories"),
    },
    {
      fieldType: "select" as "select",
      name: "store",
      multiple: false,
      choices: selectApiResourceObjects(apiResourceObjects, "stores"),
    },
    {
      fieldType: "submit" as "submit",
    },
  ];

  return (
    <Page title="Keyword visibility | Reporte actual">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Keyword visibility", href: PATH_KEYWORD.root },
            { name: "Reporte actual" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldsMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.keyword_searches}active_positions_report/`}
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
                  <ApiFormSelectComponent name="store" label="Tienda" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent
                    name="categories"
                    label="Categorías"
                  />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="brands" label="Marcas" />
                </Grid>
                <Grid item xs={6}></Grid>

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
  const brands = await jwtFetch(
    context,
    apiSettings.apiResourceEndpoints.brands
  );
  return {
    props: {
      brands: brands,
    },
  };
};
