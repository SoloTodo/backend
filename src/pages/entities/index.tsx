import { ReactElement } from "react";
import NextLink from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Link,
  Stack,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import { Masonry } from "@mui/lab";
// layouts
import Layout from "src/layouts";
// routes
import { PATH_DASHBOARD, PATH_ENTITY, PATH_STORE } from "src/routes/paths";
// components
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormPaginationTable from "src/components/api_form/ApiFormPaginationTable";
// api
import { apiSettings } from "src/frontend-utils/settings";
// currency
import currency from "currency.js";
// redux
import { useAppSelector } from "src/store/hooks";
import {
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { Currency } from "src/frontend-utils/redux/api_resources/types";
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";

// ----------------------------------------------------------------------

Entities.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

const choicesYesNo = [
  { label: "Si", value: 1 },
  { label: "No", value: 0 },
];

export default function Entities() {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const fieldMetadata = [
    {
      fieldType: "pagination" as "pagination",
      name: "entities",
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
      name: "categories",
      label: "Categorías",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "categories"),
    },
    {
      fieldType: "select" as "select",
      name: "is_available",
      label: "¿Disponible?",
      multiple: false,
      choices: choicesYesNo,
    },
  ];

  const columns: any[] = [
    {
      headerName: "Nombre",
      field: "name",
      flex: 1,
    },
    {
      headerName: "Tienda",
      field: "store",
      flex: 1,
      renderCell: (row: any) => (
        <Stack alignItems={"center"} spacing={1}>
          <NextLink
            href={`${PATH_STORE.root}/${apiResourceObjects[row.store].id}`}
            passHref
          >
            <Link>{apiResourceObjects[row.store].name}</Link>
          </NextLink>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={row.external_url}
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
      headerName: "Categoría",
      field: "category",
      flex: 1,
      renderCell: (row: any) => apiResourceObjects[row.category].name,
    },
    {
      headerName: "Producto",
      field: "product",
      flex: 1,
      renderCell: (row: any) => (row.product ? row.product.name : "N/A"),
    },
    {
      headerName: "¿Disp?",
      field: "active_registry",
      flex: 1,
      renderCell: (row: any) =>
        row.active_registry && row.active_registry.is_available ? (
          <CheckIcon />
        ) : (
          <ClearIcon />
        ),
    },
    {
      headerName: "Act?",
      field: "key",
      flex: 1,
      renderCell: (row: any) =>
        row.active_registry ? <CheckIcon /> : <ClearIcon />,
    },
    {
      headerName: "Vis?",
      field: "is_visible",
      flex: 1,
      renderCell: (row: any) =>
        row.is_visible ? <CheckIcon /> : <ClearIcon />,
    },
    {
      headerName: "Normal (orig.)",
      field: "active_registry.normal_price",
      flex: 1,
      renderCell: (row: any) =>
        row.active_registry
          ? currency(row.active_registry.normal_price, {
              precision: 0,
            }).format()
          : "$0",
    },
    {
      headerName: "Oferta (orig.)",
      field: "active_registry.offer_price",
      flex: 1,
      renderCell: (row: any) =>
        row.active_registry
          ? currency(row.active_registry.offer_price, { precision: 0 }).format()
          : "$0",
    },
    {
      headerName: "Normal (USD)",
      field: "active_registry.normal_price_usd",
      flex: 1,
      renderCell: (row: any) =>
        row.active_registry
          ? currency(row.active_registry.normal_price, { precision: 0 })
              .divide(
                (apiResourceObjects[row.currency] as Currency).exchange_rate
              )
              .format()
          : "$0",
    },
    {
      headerName: "Oferta (USD)",
      field: "active_registry.offer_price_usd",
      flex: 1,
      renderCell: (row: any) =>
        row.active_registry
          ? currency(row.active_registry.offer_price, { precision: 0 })
              .divide(
                (apiResourceObjects[row.currency] as Currency).exchange_rate
              )
              .format()
          : "$0",
    },
  ];

  return (
    <Page title="Entidades">
      <Container>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Entidades", href: PATH_ENTITY.root },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldMetadata}
          endpoint={apiSettings.apiResourceEndpoints.entities}
        >
          <Stack spacing={3}>
            <Card>
              <CardHeader title="Filtros" />
              <CardContent>
                <Masonry columns={2} spacing={3}>
                  <ApiFormSelectComponent name="stores" />
                  <ApiFormSelectComponent name="categories" />
                  <ApiFormSelectComponent name="is_available" />
                </Masonry>
              </CardContent>
            </Card>
            <ApiFormPaginationTable
              columns={columns}
              title="Entidades"
              paginationName="entities"
            />
          </Stack>
        </ApiFormComponent>
      </Container>
    </Page>
  );
}
