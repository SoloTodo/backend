import { Card, CardContent, CardHeader, Container, Grid, Stack } from "@mui/material";
import { GetServerSideProps } from "next/types";
import { ReactElement } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { BrandComparison } from "src/frontend-utils/types/brand_comparison";
import Layout from "src/layouts";
import { PATH_BRAND_COMPARISONS, PATH_DASHBOARD } from "src/routes/paths";
import ListAlerts from "src/sections/brand_comparisons/ListAlerts";

// ----------------------------------------------------------------------

BrandComparisonDetail.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function BrandComparisonDetail({
  brandComparision,
}: {
  brandComparision: BrandComparison;
}) {
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
            <CardHeader title={brandComparision.name} />
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={6} sm={4} md={2.4}>
                  <ListAlerts brandComparision={brandComparision} />
                </Grid>
                <Grid item xs={6} sm={4} md={2.4}>

                </Grid>
              </Grid>
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
        brandComparision: brandComparision,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
