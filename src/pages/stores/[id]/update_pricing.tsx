import { ReactElement, useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { getStore, jwtFetch } from "src/frontend-utils/nextjs/utils";
import { Store, StoreScrapingOptions } from "src/frontend-utils/types/store";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_STORE } from "src/routes/paths";
import UpdateStorePricingForm from "src/sections/stores/UpdateStorePriceForm";
import { wrapper } from "src/store/store";
import OptionsMenu from "src/sections/stores/OptionsMenu";

// ----------------------------------------------------------------------

UpdateStorePricing.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default function UpdateStorePricing(props: { store: Store }) {
  const { store } = props;

  const [storeScrapingOptions, setStoreScrapingOptions] = useState<StoreScrapingOptions>({
    categories: [],
    prefer_async: false,
  });
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    jwtFetch(
      null,
      `${store.url}scraper/`
    ).then((data) => {
      setStoreScrapingOptions(data);
      setLoading(false);
    });
  }, []);

  return (
    <Page title={`${store.name}`}>
      <Container>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Tiendas", href: PATH_STORE.root },
            { name: `${store.name}`, href: `${PATH_STORE.root}/${store.id}` },
            { name: "Actualizar Pricing" },
          ]}
        />
        {isLoading ? (
          <p>Loading...</p>
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

export const getServerSideProps = wrapper.getServerSideProps(
  (st) => async (context) => {
    return {
      props: {
        store: getStore(st, context),
      },
    };
  }
);
