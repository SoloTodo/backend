import { GetServerSideProps } from "next/types";
import { ReactElement } from "react";
import Page from "src/components/Page";
import { apiSettings } from "src/frontend-utils/settings";
import Layout from "src/layouts";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { Product, Website } from "src/frontend-utils/types/product";
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import { PATH_DASHBOARD, PATH_PRODUCT } from "src/routes/paths";
import OptionsMenu from "src/sections/products/OptionsMenu";
import CarouselBasic from "src/sections/mui/CarouselBasic";
import ActualPricesCard from "src/sections/products/ActualPricesCard";
import { Entity } from "src/frontend-utils/types/entity";
import { wrapper } from "src/store/store";

// ----------------------------------------------------------------------

ProductPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

type ProductProps = {
  product: Product;
  websites: Website[];
  renderSpecs: { body: string };
  entities: Entity[];
};

// ----------------------------------------------------------------------

export default function ProductPage(props: ProductProps) {
  const { product, websites, renderSpecs, entities } = props;
  return (
    <Page title={product.name}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Productos", href: PATH_PRODUCT.root },
            { name: product.name },
          ]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader title="Fotografías" />
              <CardContent>
                <CarouselBasic images={[product.picture_url]} ratio="4/3" />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <OptionsMenu product={product} websites={websites} />
          </Grid>
          <Grid item xs={12}>
            <ActualPricesCard entities={entities} />
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Especificaciones técnicas" />
              <CardContent>
                <Typography>
                  <b>Creador/a:</b> {product.creator.first_name}{" "}
                  {product.creator.last_name}
                </Typography>
                <br />
                <Container>
                  {renderSpecs.body ? (
                    <div
                      className="product_specs"
                      dangerouslySetInnerHTML={{ __html: renderSpecs.body }}
                    />
                  ) : (
                    <Typography>
                      Las especificaciones técnicas de este producto no están
                      disponibles por ahora.
                    </Typography>
                  )}
                </Container>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((st) => async (context) => {
    const apiResourceObjects = st.getState().apiResourceObjects;
    try {
      const product = await jwtFetch(
        context,
        `${apiSettings.apiResourceEndpoints.products}${context.params?.id}`
      );
      const category_template = await jwtFetch(
        context,
        `${
          apiSettings.apiResourceEndpoints.category_templates
        }?website=1&purpose=1&category=${
          apiResourceObjects[product.category].id
        }`
      );
      const renderSpecs =
        category_template.length !== 0 &&
        (await jwtFetch(
          context,
          `${apiSettings.apiResourceEndpoints.category_templates}${category_template[0].id}/render/?product=${context.params?.id}`
        ));
      const entities = await jwtFetch(
        context,
        `${apiSettings.apiResourceEndpoints.products}${context.params?.id}/entities/`
      );
      const websites = await jwtFetch(
        context,
        `${apiSettings.apiResourceEndpoints.websites}`
      );
      return {
        props: {
          product: product,
          websites: websites,
          renderSpecs: renderSpecs,
          entities: entities,
        },
      };
    } catch {
      return {
        notFound: true,
      };
    }
  });
