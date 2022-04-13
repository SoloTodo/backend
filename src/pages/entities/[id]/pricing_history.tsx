import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Stack,
} from "@mui/material";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import ApiFormChartLine from "src/components/api_form/ApiFormChartLine";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormDatePickerComponent from "src/frontend-utils/api_form/fields/date_picker/ApiDatePickerComponent";
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import {
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { apiSettings } from "src/frontend-utils/settings";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_ENTITY } from "src/routes/paths";
import { useAppSelector } from "src/store/hooks";

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
  const [pricingHistory, setPricingHistory] = useState([]);
  const router = useRouter();
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const fieldMetadata = [
    {
      fieldType: "select" as "select",
      name: "currency",
      label: "Moneda",
      multiple: false,
      choices: selectApiResourceObjects(apiResourceObjects, "currencies"),
    },
    {
      fieldType: "date" as "date",
      name: "timestamp_after",
      label: "Desde",
    },
    {
      fieldType: "date" as "date",
      name: "timestamp_before",
      label: "Hasta",
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
    <Page title={entity.name}>
      <Container>
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
                      <Stack spacing={2} direction="row">
                        <ApiFormDatePickerComponent name="timestamp_after" />
                        <ApiFormDatePickerComponent name="timestamp_before" />
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <ApiFormSelectComponent name="currency" />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              <Card>
                <CardHeader title="Resultado" />
                <CardContent>
                  <ApiFormChartLine />
                </CardContent>
              </Card>
            </Stack>
          </ApiFormComponent>
        ) : (
          <p>Loading...</p>
        )}
      </Container>
    </Page>
  );
}
