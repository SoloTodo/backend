import { ReactElement, useEffect, useState } from "react";
import Page from "src/components/Page";
import { apiSettings } from "src/frontend-utils/settings";
import Layout from "src/layouts";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { Product } from "src/frontend-utils/types/product";
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
import Handlebars from "handlebars";
import { Category } from "src/frontend-utils/types/store";
import { wrapper } from "src/store/store";
import styles from "../../../css/ProductPage.module.css";

// ----------------------------------------------------------------------

ProductPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

type ProductProps = {
  product: Product;
  renderHtml: string;
};

// ----------------------------------------------------------------------

export default function ProductPage(props: ProductProps) {
  const { product, renderHtml } = props;
  const [loading, setLoading] = useState(false);
  const [entities, setEntities] = useState<Entity[]>([]);

  useEffect(() => {
    setLoading(true);
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.products}${product.id}/entities/`
    ).then((response) => {
      setEntities(response);
      setLoading(false);
    });
  }, []);

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
            <OptionsMenu product={product} />
          </Grid>
          <Grid item xs={12}>
            <ActualPricesCard entities={entities} loading={loading} />
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
                  {renderHtml !== "" ? (
                    <div
                      className={styles.product_specs}
                      dangerouslySetInnerHTML={{ __html: renderHtml }}
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

export const getServerSideProps = wrapper.getServerSideProps(
  (st) => async (context) => {
    try {
      const product = await jwtFetch(
        context,
        `${apiSettings.apiResourceEndpoints.products}${context.params?.id}`
      );

      const apiResourceObjects = st.getState().apiResourceObjects;
      const category = apiResourceObjects[product.category] as Category;
      const template = category.detail_template;
      let html = "";
      if (template) {
        const templateHandler = Handlebars.compile(template);
        html = templateHandler(product.specs);
      }

      return {
        props: {
          product: product,
          renderHtml: html,
        },
      };
    } catch {
      return {
        notFound: true,
      };
    }
  }
);
