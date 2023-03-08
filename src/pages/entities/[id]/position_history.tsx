import { Card, CardContent, CardHeader, Container, Grid, Stack } from "@mui/material";
import { GetServerSideProps } from "next/types";
import { ReactElement } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormDateRangePickerComponent from "src/frontend-utils/api_form/fields/range_picker/ApiFormDateRangePickerComponent";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { Entity } from "src/frontend-utils/types/entity";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_ENTITY } from "src/routes/paths";
import EntityPositionHistoryChart from "src/sections/entities/EntityPositionHistoryChart";

// ----------------------------------------------------------------------

EntityPositionHistory.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function EntityPositionHistory(props: { entity: Entity }) {
  const { entity } = props;

  const fieldMetadata = [
    {
      fieldType: "date_range" as "date_range",
      name: "timestamp",
      required: true,
    },
  ];

  return (
    <Page title={`${entity.name} | Historial pricing`}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Entidades", href: PATH_ENTITY.root },
            { name: entity.name, href: `${PATH_ENTITY.root}/${entity.id}` },
            { name: "Historial positions" },
          ]}
        />
        <ApiFormComponent
            fieldsMetadata={fieldMetadata}
            endpoint={`${apiSettings.apiResourceEndpoints.entities}${entity.id}/position_history/`}
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
                      <ApiFormDateRangePickerComponent
                        name="timestamp"
                        label="Rango"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              <Card>
                <CardHeader title="Resultado" />
                <CardContent>
                  <EntityPositionHistoryChart name="timestamp" />
                </CardContent>
              </Card>
            </Stack>
          </ApiFormComponent>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const entity = await jwtFetch(
      context,
      `${apiSettings.apiResourceEndpoints.entities}${context.params?.id}/`
    );
    return {
      props: {
        entity: entity,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
