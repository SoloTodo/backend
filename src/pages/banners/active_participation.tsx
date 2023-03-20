import { ReactElement } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Stack,
} from "@mui/material";
// layouts
import Layout from "src/layouts";
// routes
import { PATH_DASHBOARD } from "src/routes/paths";
// components
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
// api
import { apiSettings } from "src/frontend-utils/settings";
// redux
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import {
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import { InLineProduct } from "src/frontend-utils/types/entity";
import { GetServerSideProps } from "next";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { Brand } from "src/frontend-utils/types/banner";
import BannerActiveParticipationTable from "src/sections/banners/BannerActiveParticipationTable";
import BannerActiveParticipationChart from "src/sections/banners/BannerActiveParticipationChart";
import BannerActiveParticipactionReportButton from "src/sections/banners/BannerActiveParticipactionReportButton";

// ----------------------------------------------------------------------

BannerActiveParticipation.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function BannerActiveParticipation({
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

  const fieldMetadata = [
    {
      fieldType: "select" as "select",
      name: "stores",
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
  ];

  return (
    <Page title="Active participation">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Active participation" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.banners}active_participation/`}
        >
          <Stack spacing={3}>
            <Card>
              <CardHeader title="Filtros" />
              <CardContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 6, md: 12 }}
                >
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
                </Grid>
              </CardContent>
            </Card>
            <Card>
              <CardHeader
                title="Participación"
                action={<BannerActiveParticipactionReportButton />}
              />
              <CardContent>
                <Stack spacing={3}>
                  <ApiFormSelectComponent
                    name="grouping_field"
                    label="Agrupar por"
                  />
                  <BannerActiveParticipationChart />
                  <BannerActiveParticipationTable />
                </Stack>
              </CardContent>
            </Card>
          </Stack>
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
