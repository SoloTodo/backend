import { ReactElement, useEffect, useState } from "react";
import { Box, CircularProgress, Container, Grid } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { getStore, jwtFetch } from "src/frontend-utils/nextjs/utils";
import { Store, StoreScrapingOptions } from "src/frontend-utils/types/store";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_STORE } from "src/routes/paths";
import UpdateStorePricingForm from "src/sections/stores/UpdateStorePriceForm";
import OptionsMenu from "src/sections/stores/OptionsMenu";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { useAppSelector } from "src/store/hooks";
import { GetServerSidePropsContext, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";

// ----------------------------------------------------------------------

UpdateStorePricing.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function UpdateStorePricing(props: { store: Store }) {
  const { store } = props;
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const [storeScrapingOptions, setStoreScrapingOptions] =
    useState<StoreScrapingOptions>({
      categories: [],
      prefer_async: false,
    });
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    jwtFetch(null, `${store.url}scraper/`).then((res) => {
      const data = {
        ...res,
        categories: res.categories.map((c: string) => apiResourceObjects[c]),
      };
      setStoreScrapingOptions(data);
      setLoading(false);
    });
  }, []);

  return (
    <Page title={`${store.name} | Actualizar pricing`}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Tiendas", href: PATH_STORE.root },
            { name: `${store.name}`, href: `${PATH_STORE.root}/${store.id}` },
            { name: "Actualizar pricing" },
          ]}
        />
        {isLoading ? (
          <Box textAlign="center">
            <CircularProgress color="inherit" />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <UpdateStorePricingForm
                storeScrapingOptions={storeScrapingOptions}
                storeIds={[store.id]}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OptionsMenu store={store} />
            </Grid>
          </Grid>
        )}
      </Container>
    </Page>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) => {
  return await getStore(context);
};
