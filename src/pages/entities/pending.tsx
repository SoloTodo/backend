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
import { PATH_DASHBOARD, PATH_ENTITY, PATH_STORE } from "src/routes/paths";
import { useAppSelector } from "src/store/hooks";
import PendingEntitiesTable from "src/sections/entities/PendingEntitiesTable";

// ----------------------------------------------------------------------

PendingEntities.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function PendingEntities() {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const fieldMetadata = [
    {
      fieldType: "pagination" as "pagination",
      name: "pending_entities",
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
      name: "categories",
      label: "Categorías",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "categories"),
    },
    {
      fieldType: "select" as "select",
      name: "countries",
      label: "Países",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "countries"),
    },
    {
      fieldType: "text" as "text",
      name: "search",
      label: "Palabras clave",
      inputType: "text" as "text",
    },
  ];

  return (
    <Page title="Pendientes">
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
                    <ApiFormSelectComponent name="stores" />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent name="categories" />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent name="countries" />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormTextComponent name="search" />
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
