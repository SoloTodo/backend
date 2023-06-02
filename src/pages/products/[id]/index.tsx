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
import styles from "../../../css/ProductPage.module.css";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { GetServerSideProps } from "next/types";

// ----------------------------------------------------------------------

ProductPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

type ProductProps = {
  product: Product;
};

// ----------------------------------------------------------------------

export default function ProductPage({ product }: ProductProps) {
  const [loading, setLoading] = useState(false);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [renderHtml, setRenderHtml] = useState("");
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  useEffect(() => {
    const myAbortController = new AbortController();

    setLoading(true);
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.products}${product.id}/entities/`,
      { signal: myAbortController.signal }
    )
      .then((response) => {
        setEntities(response);
        setLoading(false);
      })
      .catch((_) => {});

    return () => {
      myAbortController.abort();
    };
  }, []);

  useEffect(() => {
    const category = apiResourceObjects[product.category] as Category;
    const template = category.detail_template;
    if (template) {
      const templateHandler = Handlebars.compile(template);
      setRenderHtml(templateHandler(product.specs));
    }
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
                {product.creator &&
                  <Typography>
                    <b>Creador/a:</b> {product.creator.first_name}{" "}
                    {product.creator.last_name}
                  </Typography>
                }
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const product = await jwtFetch(
      context,
      `${apiSettings.apiResourceEndpoints.products}${context.query?.id}`
    );

    return {
      props: { product: product },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
