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
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormDateRangePickerComponent from "src/frontend-utils/api_form/fields/range_picker/ApiFormDateRangePickerComponent";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_ENTITY } from "src/routes/paths";
import EntityPositionHistoryChart from "src/sections/entities/EntityPositionHistoryChart";

// ----------------------------------------------------------------------

EntityPositionHistory.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function EntityPositionHistory() {
  const [isLoading, setLoading] = useState(true);
  const [entity, setEntity] = useState({
    id: "",
    name: "",
  });
  const router = useRouter();

  useEffect(() => {
    const myAbortController = new AbortController();
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.entities}${router.query.id}/`,
      { signal: myAbortController.signal }
    )
      .then((data) => {
        setEntity(data);
        setLoading(false);
      })
      .catch((_) => {});
    return () => {
      myAbortController.abort();
    };
  }, []);

  const fieldMetadata = [
    {
      fieldType: "date_range" as "date_range",
      name: "timestamp",
      required: true,
    },
  ];

  return (
    <Page title={`${entity.name} | Historial positions`}>
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
        {!isLoading ? (
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
        ) : (
          <Box textAlign="center">
            <CircularProgress color="inherit" />
          </Box>
        )}
      </Container>
    </Page>
  );
}
