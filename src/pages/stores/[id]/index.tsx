import { Container, Grid } from "@mui/material";
import { ReactElement } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { Store } from "src/frontend-utils/types/store";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_STORE } from "src/routes/paths";
import Details from "src/sections/Details";
import { Detail } from "src/frontend-utils/types/extras";
import { fDateTimeSuffix } from "src/utils/formatTime";
import {
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { useAppSelector } from "src/store/hooks";
import { getStore } from "src/frontend-utils/nextjs/utils";
import { wrapper } from "src/store/store";
import OptionsMenu from "src/sections/stores/OptionsMenu";

// ----------------------------------------------------------------------

StorePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function StorePage(props: { store: Store }) {
  const { store } = props;
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const details: Detail[] = [
    {
      key: "name",
      label: "Nombre",
    },
    {
      key: "type",
      label: "Tipo",
      renderData: (store: Store) => apiResourceObjects[store.type].name,
    },
    {
      key: "country",
      label: "País",
      renderData: (store: Store) => apiResourceObjects[store.country].name,
    },
    {
      key: "last_activation",
      label: "Última Activación",
      renderData: (store: Store) => fDateTimeSuffix(store.last_activation),
    },
    {
      key: "storescraper_class",
      label: "Scraper",
    },
  ];

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
            <Details title={store.name} data={store} details={details} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <OptionsMenu store={store} />
          </Grid>
        </Grid>
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
