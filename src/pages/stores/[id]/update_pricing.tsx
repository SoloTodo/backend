import { Container, Grid } from "@mui/material";
import { GetServerSideProps } from "next/types";
import { ReactElement } from "react";
import Page from "src/components/Page";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { Category, Store, StoreScrapingOptions } from "src/frontend-utils/types/store";
import Layout from "src/layouts";
import Options from "src/sections/stores/Options";
import UpdateStorePricingForm from "src/sections/stores/UpdateStorePriceForm";

// ----------------------------------------------------------------------

UpdateStorePricing.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

type StoreProps = {
  store: Store;
  categories: Category[];
  store_scraping_options: StoreScrapingOptions;
};

// ----------------------------------------------------------------------

export default function UpdateStorePricing(props: StoreProps) {
  const { store, store_scraping_options } = props;

  return (
    <Page title={`${store.name}`}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <UpdateStorePricingForm store_scraping_options={store_scraping_options} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Options />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let categories = await jwtFetch(
    context,
    apiSettings.apiResourceEndpoints.categories
  );
  categories = categories.reduce((acc: any, a: Category) => {
    acc[a.url] = a
    return acc;
  }, {})
  let store = {};
  let store_scraping_options: any = {};
  if (context.params) {
    store = await jwtFetch(
      context,
      `${apiSettings.apiResourceEndpoints.stores}${context.params.id}/`
    );
    store_scraping_options = await jwtFetch(
      context,
      `${apiSettings.apiResourceEndpoints.stores}${context.params.id}/scraper/`
    );
    store_scraping_options.categories = store_scraping_options.categories.map(
      (c: string) => categories[c].name
    );
  }
  return {
    props: {
      store: store,
      categories: categories,
      store_scraping_options: store_scraping_options,
    },
  };
};
