import { Container, Grid } from "@mui/material";
import { ReactElement } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { Store } from "src/frontend-utils/types/store";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_STORE } from "src/routes/paths";
import Detail from "src/sections/stores/Detail";
import Options from "src/sections/stores/Options";
import { wrapper } from "src/store/store";

// ----------------------------------------------------------------------

StorePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

type StoreProps = {
  store: Store;
  apiResourceObjects: any;
};

// ----------------------------------------------------------------------

export default function StorePage(props: StoreProps) {
  const { store, apiResourceObjects } = props;

  return (
    <Page title={`${store.name}`}>
      <Container>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Tiendas", href: PATH_STORE.root },
            { name: `${store.name}` },
          ]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <Detail store={store} apiResourceObjects={apiResourceObjects} />
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
    const apiResourceObjects = st.getState().apiResourceObjects;

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
        apiResourceObjects: apiResourceObjects,
      },
    };
  }
);
