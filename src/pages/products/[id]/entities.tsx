import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Link,
  Stack,
} from "@mui/material";
import NextLink from "next/link";
import { GridColDef } from "@mui/x-data-grid";
import { GetServerSideProps } from "next/types";
import { ReactElement } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { Entity } from "src/frontend-utils/types/entity";
import { Product } from "src/frontend-utils/types/product";
import Layout from "src/layouts";
import {
  PATH_DASHBOARD,
  PATH_ENTITY,
  PATH_PRODUCT,
  PATH_STORE,
} from "src/routes/paths";
import CustomTable from "src/sections/CustomTable";
import LinkIcon from "@mui/icons-material/Link";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import { useAppSelector } from "src/store/hooks";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { fDateTimeSuffix } from "src/utils/formatTime";
import { Currency } from "src/frontend-utils/redux/api_resources/types";
import currency from "currency.js";

// ----------------------------------------------------------------------

ProductEntities.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function ProductEntities({
  product,
  entities,
}: {
  product: Product;
  entities: Entity[];
}) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const columns: GridColDef[] = [
    {
      headerName: "Id",
      field: "id",
      flex: 1,
    },
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
      renderCell: (params) => (params.row.sku ? params.row.sku : "N/A"),
    },
    {
      headerName: "Part number",
      field: "part_number",
      flex: 1,
      renderCell: (params) =>
        params.row.part_number ? params.row.part_number : "N/A",
    },
    {
      headerName: "EAN",
      field: "cell_plan_name",
      flex: 1,
      renderCell: (params) => (params.row.ean ? params.row.ean : "N/A"),
    },
    {
      headerName: "Nombre plan celular",
      field: "ean",
      flex: 1,
      renderCell: (params) =>
        params.row.cell_plan_name ? params.row.cell_plan_name : "N/A",
    },
    {
      headerName: "Plan celular",
      field: "cell_plan",
      flex: 1,
      renderCell: (params) =>
        params.row.cell_plan ? (
          <NextLink
            href={`${PATH_PRODUCT.root}/${params.row.cell_plan.id}/`}
            passHref
          >
            <Link>{params.row.name}</Link>
          </NextLink>
        ) : (
          "N/A"
        ),
    },
    {
      headerName: "Última actualización",
      field: "last_updated",
      flex: 1,
      renderCell: (params) => fDateTimeSuffix(params.row.last_updated),
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
    {
      headerName: "Moneda",
      field: "currency",
      flex: 1,
      renderCell: (params) =>
        (apiResourceObjects[params.row.currency] as Currency).iso_code,
    },
    {
      headerName: "Precio normal",
      field: "active_registry.normal_price",
      renderCell: (params) =>
        params.row.active_registry
          ? currency(params.row.active_registry.normal_price, {
              precision: 0,
            }).format()
          : "N/A",
    },
    {
      headerName: "Precio oferta",
      field: "active_registry.offer_price",
      renderCell: (params) =>
        params.row.active_registry
          ? currency(params.row.active_registry.offer_price, {
              precision: 0,
            }).format()
          : "N/A",
    },
    {
      headerName: "Cuota mensual",
      field: "cell_monthly_payment",
      renderCell: (params) =>
        params.row.active_registry
          ? currency(params.row.active_registry.cell_monthly_payment, {
              precision: 0,
            }).format()
          : "N/A",
    },
  ];

  return (
    <Page title={product.name}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Productos", href: PATH_PRODUCT.root },
            { name: product.name, href: `${PATH_PRODUCT.root}/${product.id}` },
            { name: "Enitidades" },
          ]}
        />
        <Card>
          <CardHeader title="Entidades" />
          <CardContent>
            <CustomTable data={entities} columns={columns} />
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let product = {};
  let entities = [];
  if (context.params) {
    product = await jwtFetch(
      context,
      `${apiSettings.apiResourceEndpoints.products}${context.params.id}`
    );
    entities = await jwtFetch(
      context,
      `${apiSettings.apiResourceEndpoints.products}${context.params.id}/entities/`
    );
  }
  return {
    props: {
      product: product,
      entities: entities,
    },
  };
};
