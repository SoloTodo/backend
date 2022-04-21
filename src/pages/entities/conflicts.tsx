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
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import {
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { apiSettings } from "src/frontend-utils/settings";
import Layout from "src/layouts";
import {
  PATH_CATEGORY,
  PATH_DASHBOARD,
  PATH_ENTITY,
  PATH_PRODUCT,
  PATH_STORE,
} from "src/routes/paths";
import { useAppSelector } from "src/store/hooks";
import ApiFormResultsTable from "src/components/api_form/ApiFormResultsTable";
import { GridColDef } from "@mui/x-data-grid";
import { Entity } from "src/frontend-utils/types/entity";

// ----------------------------------------------------------------------

ConflictEntities.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function ConflictEntities() {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const fieldMetadata = [
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
  ];

  const columns: GridColDef[] = [
    {
      headerName: "Tienda",
      field: "store",
      flex: 1,
      renderCell: (params) => (
        <NextLink
          href={`${PATH_STORE.root}/${apiResourceObjects[params.row.store].id}`}
          passHref
        >
          <Link>{apiResourceObjects[params.row.store].name}</Link>
        </NextLink>
      ),
    },
    {
      headerName: "Producto",
      field: "product",
      flex: 1,
      renderCell: (params) => (
        <NextLink
          href={`${PATH_PRODUCT.root}/${params.row.product.id}`}
          passHref
        >
          <Link>{params.row.product.name}</Link>
        </NextLink>
      ),
    },
    {
      headerName: "Plan celular",
      field: "cell_plan",
      flex: 1,
      renderCell: (params) =>
        params.row.cell_plan ? (
          <NextLink
            href={`${PATH_PRODUCT.root}/${params.row.cell_plan.id}`}
            passHref
          >
            <Link>{params.row.cell_plan.name}</Link>
          </NextLink>
        ) : (
          "N/A"
        ),
    },
    {
      headerName: "Categoría",
      field: "category",
      flex: 1,
      renderCell: (params) => (
        <NextLink
          href={`${PATH_CATEGORY.root}/${
            apiResourceObjects[params.row.category].id
          }`}
          passHref
        >
          <Link>{apiResourceObjects[params.row.category].name}</Link>
        </NextLink>
      ),
    },
    {
      headerName: "Entidades",
      field: "name",
      flex: 2,
      renderCell: (params) => (
        <ul>
          {params.row.entities.map((e: Entity) => (
            <li key={e.id}>
              <NextLink href={`${PATH_ENTITY.root}/${e.id}`} passHref>
                <Link>{e.name}</Link>
              </NextLink>
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <Page title="Pendientes">
      <Container>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Entidades", href: PATH_ENTITY.root },
            { name: "Conflictos" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.entities}conflicts/`}
        >
          <Stack spacing={3}>
            <Card>
              <CardHeader title="Filtros" />
              <CardContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 6, sm: 6, md: 12 }}
                >
                  <Grid item xs={6}>
                    <ApiFormSelectComponent name="stores" />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent name="categories" />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card>
              <CardHeader title="Conflictos" />
              <CardContent>
                <ApiFormResultsTable
                  columns={columns}
                  getRowId={(row) => row.product.id}
                />
              </CardContent>
            </Card>
          </Stack>
        </ApiFormComponent>
      </Container>
    </Page>
  );
}
