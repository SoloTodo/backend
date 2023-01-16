import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { useSnackbar } from "notistack";
import { ReactElement, useState } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import ProductSearch from "src/components/my_components/ProductSearch";
import Page from "src/components/Page";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import {
  getApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { apiSettings } from "src/frontend-utils/settings";
import { Product } from "src/frontend-utils/types/product";
import { Category } from "src/frontend-utils/types/store";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_PRODUCT } from "src/routes/paths";
import { useAppSelector } from "src/frontend-utils/redux/hooks";

// ----------------------------------------------------------------------

ProductFuse.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function ProductFuse({ product }: { product: Product }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState(product.category);
  const [selectedProduct, setSelectedProduct] = useState(
    null as { id: number; instance_model_id: number } | null
  );
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const categories = getApiResourceObjects(apiResourceObjects, "categories");

  const handleProductFusionSubmit = () => {
    if (selectedProduct) {
      if (selectedProduct.id === product.id)
        enqueueSnackbar(
          "Por favor seleccione un producto distinto al original.",
          {
            variant: "error",
          }
        );

      const payload = { product: selectedProduct.id };

      const key = enqueueSnackbar("Fusionando, por favor espere!", {
        persist: true,
        variant: "info",
      });
      jwtFetch(null, product.url + "fuse/", {
        method: "POST",
        body: JSON.stringify(payload),
      }).then(() => {
        closeSnackbar(key);
        router.push(`${PATH_PRODUCT.root}/${selectedProduct.id}`);
      });
    }
  };

  return (
    <Page title={`${product.name} | Fusionar`}>
      <Container maxWidth={false}>
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
            <Stack spacing={2}>
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
                {(Object.values(categories) as unknown as Category[]).map(
                  (c) => (
                    <MenuItem key={c.id} value={c.url}>
                      {c.name}
                    </MenuItem>
                  )
                )}
              </Select>
              <ProductSearch
                entityCategory={product.category}
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
              />
              <Stack spacing={1} direction="row">
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    if (!selectedProduct) {
                      enqueueSnackbar(
                        "Por favor seleccione un producto a asociar.",
                        { variant: "warning" }
                      );
                    } else {
                      handleProductFusionSubmit();
                    }
                  }}
                  disableElevation={!selectedProduct}
                >
                  Fusionar
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const product = await jwtFetch(
      context,
      `${apiSettings.apiResourceEndpoints.products}${context.params?.id}`
    );
    return {
      props: {
        product: product,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
