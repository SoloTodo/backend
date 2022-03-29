import { Container, Grid } from "@mui/material";
import { ReactElement } from "react";
import Page from "src/components/Page";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { Store } from "src/frontend-utils/types/store";
import Layout from "src/layouts";
import Options from "src/sections/stores/Options";
import { wrapper } from "src/store/store";

// ----------------------------------------------------------------------

UpdateStorePricing.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

type StoreProps = {
  store: Store;
};

// ----------------------------------------------------------------------

export default function UpdateStorePricing(props: StoreProps) {
  const { store } = props;

  return (
    <Page title={`${store.name}`}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            Formulario de Actualización
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Options />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (st) => async (context) => {
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
  }
);
