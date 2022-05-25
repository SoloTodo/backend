import { ReactElement } from "react";
import NextLink from "next/link";
// layout
import Layout from "src/layouts";
// hooks
import { useAppSelector } from "src/store/hooks";
// api form
import {
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Link,
  Stack,
} from "@mui/material";
import { PATH_DASHBOARD, PATH_PRODUCT, PATH_RATING } from "src/routes/paths";
import Page from "src/components/Page";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import { apiSettings } from "src/frontend-utils/settings";
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import ApiFormPaginationTable from "src/components/api_form/ApiFormPaginationTable";
import { Rating } from "src/frontend-utils/types/ratings";
import { fDateTimeSuffix } from "src/utils/formatTime";
import { useUser } from "src/frontend-utils/redux/user";

// ----------------------------------------------------------------------

Ratings.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Ratings() {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const user = useAppSelector(useUser);

  const fieldMetadata = [
    {
      fieldType: "pagination" as "pagination",
    },
    {
      fieldType: "select" as "select",
      name: "stores",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "stores"),
    },
    {
      fieldType: "select" as "select",
      name: "categories",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "categories"),
    },
  ];

  const columns: any[] = [
    {
      headerName: "ID",
      field: "id",
      flex: 1,
      renderCell: (row: Rating) => (
        <NextLink href={`${PATH_RATING.root}/${row.id}`} passHref>
          <Link>{row.id}</Link>
        </NextLink>
      ),
    },
    {
      headerName: "Fecha creación",
      field: "creation_date",
      renderCell: (row: Rating) => fDateTimeSuffix(row.creation_date),
      flex: 1,
    },
    {
      headerName: "Última actualización",
      field: "last_updated",
      renderCell: (row: Rating) =>
        row.approval_date ? fDateTimeSuffix(row.approval_date) : "N/A",
      flex: 1,
    },
    {
      headerName: "Producto",
      field: "producto",
      flex: 1,
      renderCell: (row: Rating) => (
        <NextLink href={`${PATH_PRODUCT.root}/${row.product.id}`} passHref>
          <Link>{row.product.name}</Link>
        </NextLink>
      ),
    },
    {
      headerName: "Rating producto",
      field: "product_rating",
      flex: 1,
    },
    {
      headerName: "Tienda",
      field: "store",
      flex: 1,
      renderCell: (row: Rating) => (
        <NextLink
          href={`${PATH_PRODUCT.root}/${apiResourceObjects[row.store].id}`}
          passHref
        >
          <Link>{apiResourceObjects[row.store].name}</Link>
        </NextLink>
      ),
    },
    {
      headerName: "Rating tienda",
      field: "store_rating",
      flex: 1,
    },
  ];

  if (user && user.permissions.includes('solotodo.is_ratings_staff')) {
    columns.push(
      {
        headerName: "IP",
        field: "ip",
        flex: 1,
      },
      {
        headerName: "Usuario",
        field: "usuario",
        flex: 1,
        renderCell: (row: Rating) => row.user.email,
      }
    );
  }

  return (
    <Page title="Ratings">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Ratings", href: PATH_RATING.root },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.ratings}`}
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
                    <ApiFormSelectComponent name="stores" label="Tiendas" />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent name="categories" label="Categorías" />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <ApiFormPaginationTable
              columns={columns}
              title="Ratings"
            />
          </Stack>
        </ApiFormComponent>
      </Container>
    </Page>
  );
}
