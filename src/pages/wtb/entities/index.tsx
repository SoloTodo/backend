import { ReactElement } from "react";
import NextLink from "next/link";
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
// layouts
import Layout from "src/layouts";
// routes
import { PATH_DASHBOARD, PATH_PRODUCT, PATH_WTB } from "src/routes/paths";
// components
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormPaginationTable from "src/components/api_form/ApiFormPaginationTable";
// api
import { apiSettings } from "src/frontend-utils/settings";
// redux
import { useAppSelector } from "src/store/hooks";
import {
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import ApiFormSelectComponent, {
  choicesYesNo,
} from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import ApiFormTextComponent from "src/frontend-utils/api_form/fields/text/ApiFormTextComponent";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { GetServerSideProps } from "next/types";
import { Brand, WtbEntity } from "src/frontend-utils/types/wtb";

// ----------------------------------------------------------------------

WtbEntities.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function WtbEntities({ brands }: { brands: Brand[] }) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const brandChoices = brands.map((b) => ({
    label: b.name,
    value: b.id,
  }));

  const fieldMetadata = [
    {
      fieldType: "pagination" as "pagination",
    },
    {
      fieldType: "select" as "select",
      name: "brands",
      multiple: true,
      choices: brandChoices,
    },
    {
      fieldType: "select" as "select",
      name: "categories",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "categories"),
    },
    {
      fieldType: "select" as "select",
      name: "is_active",
      multiple: false,
      choices: choicesYesNo,
    },
    {
      fieldType: "select" as "select",
      name: "is_visible",
      multiple: false,
      choices: choicesYesNo,
    },
    {
      fieldType: "select" as "select",
      name: "is_associated",
      multiple: false,
      choices: choicesYesNo,
    },
    {
      fieldType: "text" as "text",
      name: "search",
    },
  ];

  const columns: any[] = [
    {
      headerName: "Nombre",
      field: "name",
      flex: 1,
      renderCell: (row: { id: string; name: string }) => (
        <NextLink href={`${PATH_WTB.entities}/${row.id}`} passHref>
          <Link>{row.name}</Link>
        </NextLink>
      ),
    },
    {
      headerName: "Marca",
      field: "brand",
      flex: 1,
      renderCell: (row: WtbEntity) => {
        const brand = brands.filter((b) => b.url === row.brand)[0];
        return (
          <Stack alignItems={"center"} spacing={1}>
            <NextLink href={`${PATH_WTB.brands}/${brand.id}`} passHref>
              <Link>{brand.name}</Link>
            </NextLink>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={row.external_url}
            >
              <LinkIcon />
            </Link>
          </Stack>
        );
      },
    },
    {
      headerName: "Llave",
      field: "key",
      flex: 1,
    },
    {
      headerName: "Categoría",
      field: "category",
      flex: 1,
      renderCell: (row: WtbEntity) => apiResourceObjects[row.category].name,
    },
    {
      headerName: "Producto",
      field: "product",
      flex: 1,
      renderCell: (row: WtbEntity) =>
        row.product ? (
          <NextLink href={`${PATH_PRODUCT.root}/${row.product.id}`} passHref>
            <Link>{row.product.name}</Link>
          </NextLink>
        ) : (
          "N/A"
        ),
    },
    {
      headerName: "Act?",
      field: "is_active",
      flex: 1,
      renderCell: (row: WtbEntity) =>
        row.is_active ? <CheckIcon /> : <ClearIcon />,
    },
    {
      headerName: "Vis?",
      field: "is_visible",
      flex: 1,
      renderCell: (row: WtbEntity) =>
        row.is_visible ? <CheckIcon /> : <ClearIcon />,
    },
  ];

  return (
    <Page title="Entidades">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Donde Comprar", href: PATH_WTB.entities },
            { name: "Entidades" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.wtb_entities}?ordering=name`}
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
                  <Grid item xs={6}>
                    <ApiFormSelectComponent name="brands" label="Marcas" />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent
                      name="categories"
                      label="Categorías"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <ApiFormSelectComponent name="is_active" label="¿Activa?" />
                  </Grid>
                  <Grid item xs={2}>
                    <ApiFormSelectComponent
                      name="is_visible"
                      label="¿Visible?"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <ApiFormSelectComponent
                      name="is_associated"
                      label="¿Asociada?"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormTextComponent
                      name="search"
                      label="Palabras clave"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <ApiFormPaginationTable columns={columns} title="Entidades" />
          </Stack>
        </ApiFormComponent>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const brands = await jwtFetch(
    context,
    apiSettings.apiResourceEndpoints.wtb_brands
  );
  return {
    props: {
      brands: brands,
    },
  };
};
