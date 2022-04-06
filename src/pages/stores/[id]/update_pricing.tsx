import { ReactElement, useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";
import { useRouter } from "next/router";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import {
  Store,
  StoreScrapingOptions,
} from "src/frontend-utils/types/store";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_STORE } from "src/routes/paths";
import Options from "src/sections/stores/Options";
import UpdateStorePricingForm from "src/sections/stores/UpdateStorePriceForm";
// redux 
import { useAppSelector } from "src/store/hooks";
import { apiResourceObjectsByIdOrUrl, useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";

// ----------------------------------------------------------------------

UpdateStorePricing.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};


export default function UpdateStorePricing() {
  const [storeScrapingOptions, setStoreScrapingOptions] = useState({
      categories: [],
      prefer_async: false,
    } as unknown as StoreScrapingOptions)
  const [isLoading, setLoading] = useState(false)

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    setLoading(true)
    jwtFetch(null, `${apiSettings.apiResourceEndpoints.stores}${id}/scraper/`)
      .then((data) => {
        setStoreScrapingOptions(data)
        setLoading(false)
      })
  }, [])
  
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const stores: {[key: string]: Store} = apiResourceObjectsByIdOrUrl(apiResourceObjects, "stores", "id");
  let store = {
    name: "",
    id: 0
  }
  if (typeof id === 'string' && stores.hasOwnProperty(id)) {
    store = stores[id];
  }

  if (isLoading) return <p>Loading...</p>
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
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <UpdateStorePricingForm
              store_scraping_options={storeScrapingOptions}
              store_ids={[store.id]}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Options />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
