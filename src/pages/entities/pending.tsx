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
import ApiFormSelectComponent, { choicesYesNo } from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import ApiFormTextComponent from "src/frontend-utils/api_form/fields/text/ApiFormTextComponent";
import {
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { apiSettings } from "src/frontend-utils/settings";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_ENTITY } from "src/routes/paths";
import { useAppSelector } from "src/store/hooks";
import PendingEntitiesTable from "src/sections/entities/PendingEntitiesTable";
import { GetServerSideProps } from "next/types";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";

// ----------------------------------------------------------------------

PendingEntities.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function PendingEntities({
  categoryStats,
}: {
  categoryStats: Record<number, number>;
}) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const categoriasChoices = selectApiResourceObjects(
    apiResourceObjects,
    "categories"
  ).map((c) => ({
    label: `${c.label} (${
      categoryStats[c.value] ? categoryStats[c.value] : 0
    })`,
    value: c.value,
  }));

  const fieldMetadata = [
    {
      fieldType: "pagination" as "pagination",
      name: "pending_entities",
    },
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
      choices: categoriasChoices,
    },
    {
      fieldType: "select" as "select",
      name: "countries",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "countries"),
    },
    {
      fieldType: "select" as "select",
      name: "is_marketplace",
      multiple: false,
      choices: choicesYesNo,
    },
    {
      fieldType: "text" as "text",
      name: "search",
    },
  ];

  return (
    <Page title="Pendientes | Entidades">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Entidades", href: PATH_ENTITY.root },
            { name: "Pendientes" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.entities}pending/?ordering=-id`}
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
                    <ApiFormSelectComponent name="stores" label="Tiendas" />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent
                      name="categories"
                      label="Categorías"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent name="countries" label="Países" />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent
                      name="is_marketplace"
                      label="¿Marketplace?"
                      selectOnly
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <ApiFormTextComponent
                      name="search"
                      label="Palabras clave"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <PendingEntitiesTable />
          </Stack>
        </ApiFormComponent>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const categoryStats = await jwtFetch(
    context,
    `${apiSettings.apiResourceEndpoints.entities}pending_stats/`
  );
  return {
    props: {
      categoryStats: categoryStats,
    },
  };
};
