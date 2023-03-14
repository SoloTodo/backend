import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Stack,
} from "@mui/material";
import { GetServerSideProps } from "next/types";
import { ReactElement, useState } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { BrandComparison } from "src/frontend-utils/types/brand_comparison";
import Layout from "src/layouts";
import { PATH_BRAND_COMPARISONS, PATH_DASHBOARD } from "src/routes/paths";
import ListAlerts from "src/sections/brand_comparisons/ListAlerts";
import ListManualProducts from "src/sections/brand_comparisons/ListManualProducts";
import ListPendingProducts from "src/sections/brand_comparisons/ListPendingProducts";
import EditName from "src/sections/brand_comparisons/EditName";
import BrandComparisonTable from "src/sections/brand_comparisons/BrandComparisonTable";
import SelectStores from "src/sections/brand_comparisons/SelectStores";

// ----------------------------------------------------------------------

BrandComparisonDetail.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function BrandComparisonDetail({
  initialBrandComparision,
}: {
  initialBrandComparision: BrandComparison;
}) {
  const [brandComparision, setBrandComparision] = useState(
    initialBrandComparision
  );
  const [displayStores, setDisplayStores] = useState(true);

  return (
    <Page title="Comparación de marcas">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            {
              name: "Comparación de marcas",
              href: PATH_BRAND_COMPARISONS.root,
            },
            { name: brandComparision.name },
          ]}
        />
        <Stack spacing={3}>
          <Card>
            <CardHeader
              title={
                <EditName
                  brandComparision={brandComparision}
                  setBrandComparision={setBrandComparision}
                />
              }
            />
            <CardContent>
              <Grid container spacing={1}>
                <Grid item>
                  <ListAlerts brandComparision={brandComparision} />
                </Grid>
                <Grid item>
                  <ListManualProducts brandComparision={brandComparision} />
                </Grid>
                <Grid item>
                  <ListPendingProducts brandComparision={brandComparision} />
                </Grid>
                <Grid item>
                  <SelectStores
                    brandComparision={brandComparision}
                    setBrandComparision={setBrandComparision}
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={() => setDisplayStores(!displayStores)}
                  >
                    Ocultar tiendas
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <BrandComparisonTable
                brandComparision={brandComparision}
                displayStores={displayStores}
              />
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const brandComparision = await jwtFetch(
      context,
      `${apiSettings.apiResourceEndpoints.brand_comparisons}${context.params?.id}/`
    );
    return {
      props: {
        initialBrandComparision: brandComparision,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
