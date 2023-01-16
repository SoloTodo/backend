import { Container, Grid } from "@mui/material";
import { ReactElement } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_WTB } from "src/routes/paths";
import Details from "src/sections/Details";
import { Detail, Option } from "src/frontend-utils/types/extras";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { Brand } from "src/frontend-utils/types/wtb";
import { GetServerSideProps } from "next/types";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { Website } from "src/frontend-utils/types/product";
import Options from "src/sections/Options";

// ----------------------------------------------------------------------

BrandPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function BrandPage({
  brand,
  websites,
}: {
  brand: Brand;
  websites: Website[];
}) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const details: Detail[] = [
    {
      key: "name",
      label: "Nombre",
    },
    {
      key: "prefered_brand",
      label: "Marca preferida",
    },
    {
      key: "country",
      label: "Sitio",
      renderData: (brand: Brand) =>
        websites.filter((w) => w.url === brand.website)[0].name,
    },
    {
      key: "storescraper_class",
      label: "Scraper",
    },
    {
      key: "stores",
      label: "Tiendas",
      renderData: (brand: Brand) =>
        brand.stores.reduce((acc: string, a: string) => {
          if (acc === "") {
            return apiResourceObjects[a].name;
          }
          return acc + " / " + apiResourceObjects[a].name;
        }, ""),
    },
  ];

  const options: Option[] = [
    {
      text: "Registros de actualización",
      path: `${PATH_WTB.brands}/${brand.id}/update_logs`,
    },
    {
      text: "Entidades",
      path: `${PATH_WTB.entities}/?brands=${brand.id}`,
    },
  ];

  return (
    <Page title={`${brand.name} | Marcas`}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Donde Comprar", href: PATH_WTB.brands },
            { name: "Marcas", href: PATH_WTB.brands },
            { name: `${brand.name}` },
          ]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <Details title={brand.name} data={brand} details={details} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Options options={options} defaultKey="text" />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const websites = await jwtFetch(
    context,
    `${apiSettings.apiResourceEndpoints.websites}`
  );
  try {
    const brand = await jwtFetch(
      context,
      `${apiSettings.apiResourceEndpoints.wtb_brands}${context.params?.id}/`
    );
    return {
      props: {
        brand: brand,
        websites: websites,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
