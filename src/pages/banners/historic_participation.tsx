import { Card, CardContent, CardHeader, Container, Grid } from "@mui/material";
import { ReactElement } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormDateRangePickerComponent from "src/frontend-utils/api_form/fields/range_picker/ApiFormDateRangePickerComponent";
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import ApiFormSubmitComponent from "src/frontend-utils/api_form/fields/submit/ApiFormSubmitComponent";
import {
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { apiSettings } from "src/frontend-utils/settings";
import Layout from "src/layouts";
import { PATH_BANNERS, PATH_DASHBOARD } from "src/routes/paths";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { GetServerSideProps } from "next/types";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { Brand } from "src/frontend-utils/types/banner";
import { InLineProduct } from "src/frontend-utils/types/entity";

// ----------------------------------------------------------------------

HistoricPartipication.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function HistoricPartipication({
  brands,
  bannerSections,
  bannerSubsectionTypes,
}: {
  brands: Brand[];
  bannerSections: InLineProduct[];
  bannerSubsectionTypes: InLineProduct[];
}) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const brandChoices = brands.map((b) => ({ label: b.name, value: b.id }));
  const bannerSectionsChoices = bannerSections.map((b) => ({
    label: b.name,
    value: b.id,
  }));
  const bannerSubsectionTypesChoices = bannerSubsectionTypes.map((b) => ({
    label: b.name,
    value: b.id,
  }));

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
      choices: selectApiResourceObjects(apiResourceObjects, "categories"),
    },
    {
      fieldType: "select" as "select",
      name: "stores",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "stores"),
    },
    {
      fieldType: "select" as "select",
      name: "brands",
      multiple: true,
      choices: brandChoices,
    },
    {
      fieldType: "select" as "select",
      name: "sections",
      multiple: true,
      choices: bannerSectionsChoices,
    },
    {
      fieldType: "select" as "select",
      name: "subsection_types",
      multiple: true,
      choices: bannerSubsectionTypesChoices,
    },
    {
      fieldType: "select" as "select",
      name: "grouping_field",
      multiple: false,
      required: true,
      choices: [
        { value: "brand", label: "Marca" },
        { value: "category", label: "Categoría" },
        { value: "store", label: "Tienda" },
        { value: "section", label: "Section" },
        { value: "subsection_type", label: "Tipo subsección" },
      ],
    },
    {
      fieldType: "submit" as "submit",
    },
  ];

  return (
    <Page title="Historic participation | Reportes">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Banners", href: PATH_BANNERS.banners },
            { name: "Historic participation" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldsMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.banners}historic_active_participation/`}
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
                  <ApiFormDateRangePickerComponent
                    name="timestamp"
                    label="Rango"
                  />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent
                    name="grouping_field"
                    label="Agrupar por"
                  />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="stores" label="Tiendas" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="sections" label="Secciones" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent
                    name="subsection_types"
                    label="Tipos"
                  />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent name="brands" label="Marcas" />
                </Grid>
                <Grid item xs={6}>
                  <ApiFormSelectComponent
                    name="categories"
                    label="Categorías"
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const brands = await jwtFetch(
    context,
    apiSettings.apiResourceEndpoints.brands
  );
  const bannerSections = await jwtFetch(
    context,
    apiSettings.apiResourceEndpoints.banner_sections
  );
  const bannerSubsectionTypes = await jwtFetch(
    context,
    apiSettings.apiResourceEndpoints.banner_subsection_types
  );
  return {
    props: {
      brands: brands,
      bannerSections: bannerSections,
      bannerSubsectionTypes: bannerSubsectionTypes,
    },
  };
};
