import { Card, CardContent, CardHeader, Container, Grid } from "@mui/material";
import { NextPageContext } from "next/types";
import { ReactElement } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import ApiFormSubmitComponent from "src/frontend-utils/api_form/fields/submit/ApiFormSubmitComponent";
import ApiFormTextComponent from "src/frontend-utils/api_form/fields/text/ApiFormTextComponent";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import {
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { apiSettings } from "src/frontend-utils/settings";
import { Brand } from "src/frontend-utils/types/banner";
import { Store } from "src/frontend-utils/types/store";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_STORE } from "src/routes/paths";

StoreCurrentSkuPositions.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function StoreCurrentSkuPositions(props: {
  brands: Brand[];
  store: Store;
}) {
  const { brands, store } = props;
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const brandChoices = brands.map((b) => ({ label: b.name, value: b.id }));

  const fieldsMetadata = [
    {
      fieldType: "select" as "select",
      name: "categories",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "categories"),
    },
    {
      fieldType: "select" as "select",
      name: "brands",
      multiple: true,
      choices: brandChoices,
    },
    {
      fieldType: "text" as "text",
      name: "position_threshold",
    },
    {
      fieldType: "submit" as "submit",
    },
  ];

  return (
    <Page title="Posicionamiento actual de SKUs | Reportes">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Tiendas", href: PATH_STORE.root },
            { name: `${store.name}`, href: `${PATH_STORE.root}/${store.id}` },
            { name: "Posicionamiento actual de SKUs" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldsMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.stores}${store.id}/current_entity_positions_report/`}
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
                  <ApiFormSelectComponent name="categories" label="Categorías" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="brands" label="Marcas" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormTextComponent
                    name="position_threshold"
                    label="Umbral"
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

export const getServerSideProps = async (context: NextPageContext) => {
  try {
    const store = await jwtFetch(
      context,
      `${apiSettings.apiResourceEndpoints.stores}${context.query["id"]}`
    );
    const brands = await jwtFetch(
      context,
      apiSettings.apiResourceEndpoints.brands
    );
    return {
      props: {
        store: store,
        brands: brands,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
