import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  Stack,
} from "@mui/material";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import EntityPriceHistoryChart from "src/sections/entities/EntityPriceHistoryChart";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_ENTITY } from "src/routes/paths";
import ApiFormDateRangePickerComponent from "src/frontend-utils/api_form/fields/range_picker/ApiFormDateRangePickerComponent";

// ----------------------------------------------------------------------

EntityPriceHistory.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function EntityPriceHistory() {
  const [isLoading, setLoading] = useState(true);
  const [entity, setEntity] = useState({
    id: "",
    name: "",
  });
  const router = useRouter();

  const fieldMetadata = [
    {
      fieldType: "date_range" as "date_range",
      name: "timestamp",
      required: true,
    },
  ];

  useEffect(() => {
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.entities}${router.query.id}/`
    ).then((data) => {
      setEntity(data);
      setLoading(false);
    });
  }, []);

  return (
    <Page title={`${entity.name} | Historial pricing`}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Entidades", href: PATH_ENTITY.root },
            { name: entity.name, href: `${PATH_ENTITY.root}/${entity.id}` },
            { name: "Historial pricing" },
          ]}
        />
        {!isLoading ? (
          <ApiFormComponent
            fieldsMetadata={fieldMetadata}
            endpoint={`${apiSettings.apiResourceEndpoints.entities}${entity.id}/pricing_history/`}
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
                  <EntityPriceHistoryChart name="timestamp" />
                </CardContent>
              </Card>
            </Stack>
          </ApiFormComponent>
        ) : (
          <Box textAlign="center">
            <CircularProgress color="inherit" />
          </Box>
        )}
      </Container>
    </Page>
  );
}
