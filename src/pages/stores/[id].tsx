import { Container, Grid } from "@mui/material";
import { GetServerSideProps } from "next";
import { ReactElement } from "react";
import Page from "src/components/Page";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { Store } from "src/frontend-utils/types/store";
import Layout from "src/layouts";
import Detail from "src/sections/stores/Detail";
import Options from "src/sections/stores/Options";

// ----------------------------------------------------------------------

StorePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

type StoreProps = {
  store: Store;
};

// ----------------------------------------------------------------------

export default function StorePage(props: StoreProps) {
  const { store } = props;

  return (
    <Page title={`${store.name}`}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <Detail store={store} />
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
  let store = {};
  if (context.params) {
    store = await jwtFetch(
      context,
      `${apiSettings.apiResourceEndpoints.stores}${context.params.id}/`
    );
  }
  return {
    props: {
      store: store,
    },
  };
};
