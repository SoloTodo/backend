import { ReactElement } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Stack,
} from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import ApiFormTextComponent from "src/frontend-utils/api_form/fields/text/ApiFormTextComponent";
import {
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { apiSettings } from "src/frontend-utils/settings";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_WTB } from "src/routes/paths";
import { useAppSelector } from "src/store/hooks";
import PendingEntitiesTable from "src/sections/wtb/PendingEntitiesTable";
import { GetServerSideProps } from "next/types";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { Brand } from "src/frontend-utils/types/wtb";

// ----------------------------------------------------------------------

PendingWtbEntities.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function PendingWtbEntities({ brands }: { brands: Brand[] }) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const brandChoices = brands.map((b) => ({
    label: b.name,
    value: b.id,
  }));

  const fieldMetadata = [
    {
      fieldType: "pagination" as "pagination",
      name: "pending_wtb_entities",
    },
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
      fieldType: "text" as "text",
      name: "search",
    },
  ];

  return (
    <Page title="Pendientes | Entidades | Donde Comprar">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Donde Comprar", href: PATH_WTB.entities },
            { name: "Entidades", href: PATH_WTB.entities },
            { name: "Pendientes" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.wtb_entities}pending/?ordering=-id`}
        >
          <Stack spacing={3}>
            <Card>
              <CardHeader title="Filtros" />
              <CardContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 6, sm: 6, md: 12 }}
                >
                  <Grid item xs={6}>
                    <ApiFormSelectComponent name="brands" label="Marcas" />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent
                      name="categories"
                      label="Categorías"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormTextComponent
                      name="search"
                      label="Palabras clave"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <PendingEntitiesTable brands={brands} />
          </Stack>
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
