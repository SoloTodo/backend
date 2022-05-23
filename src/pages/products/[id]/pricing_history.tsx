import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Link,
  Stack,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import NextLink from "next/link";
import { GetServerSideProps } from "next/types";
import { ReactElement } from "react";
import ProductPriceHistoryChart from "src/sections/products/ProductPriceHistoryChart";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { ApiFormFieldMetadata } from "src/frontend-utils/api_form/ApiForm";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormDatePickerComponent from "src/frontend-utils/api_form/fields/date_picker/ApiDatePickerComponent";
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import {
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { apiSettings } from "src/frontend-utils/settings";
import { Product } from "src/frontend-utils/types/product";
import Layout from "src/layouts";
import {
  PATH_DASHBOARD,
  PATH_ENTITY,
  PATH_PRODUCT,
  PATH_STORE,
} from "src/routes/paths";
import { useAppSelector } from "src/store/hooks";
import ProductEntitiesTable from "src/sections/products/ProductEntitiesTable";
import { GridColDef } from "@mui/x-data-grid";

// ----------------------------------------------------------------------

ProductPricingHistory.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function ProductPricingHistory({
  product,
}: {
  product: Product;
}) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const fieldsMetadata: ApiFormFieldMetadata[] = [
    {
      fieldType: "date" as "date",
      name: "timestamp_after",
      label: "Desde",
    },
    {
      fieldType: "date" as "date",
      name: "timestamp_before",
      label: "Hasta",
    },
    {
      fieldType: "select" as "select",
      name: "countries",
      label: "Países",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "countries"),
    },
    {
      fieldType: "select" as "select",
      name: "stores",
      label: "Tiendas",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "stores"),
    },
    {
      fieldType: "select" as "select",
      name: "exclude_unavailable",
      label: "Ver",
      multiple: false,
      choices: [{ label: "Sólo cuando disponible", value: 1 }],
    },
    {
      fieldType: "select" as "select",
      name: "price_type",
      label: "Tipo de precio",
      multiple: false,
      required: true,
      choices: [
        { label: "Precio normal", value: "normal" },
        { label: "Precio oferta", value: "offer" },
      ],
    },
  ];

  const columns: GridColDef[] = [
    {
      headerName: "Nombre",
      field: "name",
      flex: 1,
      renderCell: (params) => (
        <NextLink href={`${PATH_ENTITY.root}/${params.row.id}`} passHref>
          <Link>{params.row.name}</Link>
        </NextLink>
      ),
    },
    {
      headerName: "Tienda",
      field: "store",
      flex: 1,
      renderCell: (params) => (
        <Stack>
          <NextLink
            href={`${PATH_STORE.root}/${
              apiResourceObjects[params.row.store].id
            }`}
            passHref
          >
            <Link>{apiResourceObjects[params.row.store].name}</Link>
          </NextLink>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={params.row.external_url}
          >
            <LinkIcon />
          </Link>
        </Stack>
      ),
    },
    {
      headerName: "SKU",
      field: "sku",
      flex: 1,
    },
    {
      headerName: "¿Disp?",
      field: "active_registry",
      flex: 1,
      renderCell: (params) =>
        params.row.active_registry &&
        params.row.active_registry.is_available ? (
          <CheckIcon />
        ) : (
          <ClearIcon />
        ),
    },
    {
      headerName: "Act?",
      field: "key",
      flex: 1,
      renderCell: (params) =>
        params.row.active_registry ? <CheckIcon /> : <ClearIcon />,
    },
  ];

  return (
    <Page title={`${product.name} | Historial pricing`}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Productos", href: PATH_PRODUCT.root },
            { name: product.name, href: `${PATH_PRODUCT.root}/${product.id}` },
            { name: "Historial pricing" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldsMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.products}${product.id}/pricing_history/?price_type=normal`}
        >
          <Stack spacing={3}>
            <Card>
              <CardHeader title="Filtros" />
              <CardContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 6, md: 12 }}
                >
                  <Grid item xs={6} md={4}>
                    <Stack spacing={2} direction="row">
                      <ApiFormDatePickerComponent name="timestamp_after" />
                      <ApiFormDatePickerComponent name="timestamp_before" />
                    </Stack>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <ApiFormSelectComponent name="countries" />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <ApiFormSelectComponent name="stores" />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <ApiFormSelectComponent name="exclude_unavailable" />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <ApiFormSelectComponent name="price_type" />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card>
              <CardHeader title="Gráfico" />
              <CardContent>
                <ProductPriceHistoryChart name="price_type" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader title="Entidades encontradas" />
              <CardContent>
                <ProductEntitiesTable columns={columns} />
              </CardContent>
            </Card>
          </Stack>
        </ApiFormComponent>
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
