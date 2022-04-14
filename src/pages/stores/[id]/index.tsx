import { Container, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { Store } from "src/frontend-utils/types/store";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_STORE } from "src/routes/paths";
import Details from "src/sections/Details";
import Options from "src/sections/Options";
import { wrapper } from "src/store/store";
import { Detail, Option } from "src/frontend-utils/types/extras";
import { fDateTimeSuffix } from "src/utils/formatTime";
import { apiResourceObjectsByIdOrUrl } from "src/frontend-utils/redux/api_resources/apiResources";

// ----------------------------------------------------------------------

StorePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

type StoreProps = {
  apiResourceObjects: any;
};

// ----------------------------------------------------------------------

export default function StorePage(props: StoreProps) {
  const { apiResourceObjects } = props;
  const router = useRouter();
  const baseRoute = `${PATH_STORE.root}/${router.query.id}`;

  const stores: {[key: string]: Store} = apiResourceObjectsByIdOrUrl(apiResourceObjects, "stores", "id")
  const store = stores[router.query.id as string] ;

  const options: Option[] = [
    {
      key: 1,
      text: "Información general",
      path: baseRoute,
    },
    {
      key: 2,
      text: "Actualizar pricing",
      path: `${baseRoute}/update_pricing`,
    },
    {
      key: 3,
      text: "Registros de actualización",
      path: `${baseRoute}/update_logs`,
    },
    // {
    //   key: 4,
    //   text: "Leads (listado)",
    //   path: `${baseRoute}`,
    // },
    // {
    //   key: 5,
    //   text: "Leads (estadísticas)",
    //   path: `${baseRoute}`,
    // },
    {
      key: 6,
      text: "Entidades en conflicto",
      path: `${baseRoute}`,
    },
    {
      key: 7,
      text: "Ratings",
      path: `${baseRoute}`,
    },
    {
      key: 8,
      text: "Descargar reporte de homologación",
      path: `${baseRoute}/matching_report`,
    },
  ];

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
            <Options options={options} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (st) => async (_context) => {
    const apiResourceObjects = st.getState().apiResourceObjects;

    return {
      props: {
        apiResourceObjects: apiResourceObjects,
      },
    };
  }
);
