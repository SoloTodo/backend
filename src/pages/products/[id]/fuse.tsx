import {
  Card,
  CardContent,
  CardHeader,
  Container,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { GetServerSideProps } from "next/types";
import { ReactElement, useState } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import {
  apiResourceObjectsByIdOrUrl,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { apiSettings } from "src/frontend-utils/settings";
import { Product } from "src/frontend-utils/types/product";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_PRODUCT } from "src/routes/paths";
import { useAppSelector } from "src/store/hooks";

// ----------------------------------------------------------------------

ProductFuse.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function ProductFuse({ product }: { product: Product }) {
  const [selectedCategory, setSelectedCategory] = useState(product.category);
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const categories = apiResourceObjectsByIdOrUrl(
    apiResourceObjects,
    "categories",
    "url"
  );
  return (
    <Page title={product.name}>
      <Container>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Productos", href: PATH_PRODUCT.root },
            { name: product.name, href: `${PATH_PRODUCT.root}/${product.id}` },
            { name: "Fusionar" },
          ]}
        />
        <Card>
          <CardHeader title="Fusionar producto" />
          <CardContent>
            <Typography>
              Producto a ser eliminado:{" "}
              <strong>
                {product.name} (ID: {product.id})
              </strong>
            </Typography>
            <Typography>
              Por favor seleccione el producto al cual asociar todas las
              entidades y otros objetos actualmente asociados al producto
              original.
            </Typography>
            <br />
            <Select
              value={selectedCategory}
              onChange={(evt) => setSelectedCategory(evt.target.value)}
              style={{ width: "100%" }}
            >
              {Object.values(categories).map((c) => (
                <MenuItem key={c.id} value={c.url}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let product = {};
  if (context.params) {
    product = await jwtFetch(
      context,
      `${apiSettings.apiResourceEndpoints.products}${context.params.id}`
    );
  }
  return {
    props: {
      product: product,
    },
  };
};
