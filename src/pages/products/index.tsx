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
import ApiFormPaginationTable from "src/components/api_form/ApiFormPaginationTable";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormDatePickerComponent from "src/frontend-utils/api_form/fields/date_picker/ApiDatePickerComponent";
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import ApiFormTextComponent from "src/frontend-utils/api_form/fields/text/ApiFormTextComponent";
import {
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { apiSettings } from "src/frontend-utils/settings";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_PRODUCT } from "src/routes/paths";
import { useAppSelector } from "src/store/hooks";
import { fDateTimeSuffix } from "src/utils/formatTime";

// ----------------------------------------------------------------------

Products.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Products() {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const fieldMetadata = [
    {
      fieldType: "pagination" as "pagination",
      name: "products",
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
      name: "availability_countries",
      label: "Disponibilidad en país",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "countries"),
    },
    {
      fieldType: "select" as "select",
      name: "availability_stores",
      label: "Disponibilidad en tienda",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "stores"),
    },
    {
      fieldType: "text" as "text",
      name: "search",
      label: "Palabras clave",
      inputType: "text" as "text",
    },
    {
      fieldType: "date" as "date",
      name: "creation_date_after",
      label: "Desde",
    },
    {
      fieldType: "date" as "date",
      name: "creation_date_before",
      label: "Hasta",
    },
    {
      fieldType: "date" as "date",
      name: "last_updated_after",
      label: "Desde",
    },
    {
      fieldType: "date" as "date",
      name: "last_updated_before",
      label: "Hasta",
    },
  ];

  const columns: any[] = [
    {
      headerName: "Nombre",
      field: "name",
      flex: 1,
      renderCell: (row: any) => (
        <NextLink href={`${PATH_PRODUCT.root}/${row.id}`} passHref>
          <Link>{row.name}</Link>
        </NextLink>
      ),
    },
    {
      headerName: "Categoría",
      field: "category",
      flex: 1,
      renderCell: (row: any) => apiResourceObjects[row.category].name,
    },
    {
      headerName: "Fecha creación",
      field: "creation_date",
      renderCell: (row: any) => fDateTimeSuffix(row.creation_date),
      flex: 1,
    },
    {
      headerName: "Última actualización",
      field: "last_updated",
      renderCell: (row: any) =>
        row.last_updated ? fDateTimeSuffix(row.last_updated) : "Inactiva",
      flex: 1,
    },
  ];

  return (
    <Page title="Productos">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Productos", href: PATH_PRODUCT.root },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.products}?ordering=name`}
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
                    <ApiFormSelectComponent name="categories" />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent name="availability_countries" />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent name="availability_stores" />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormTextComponent name="search" />
                  </Grid>
                  <Grid item xs={3}>
                    <ApiFormDatePickerComponent name="creation_date_after" />
                  </Grid>
                  <Grid item xs={3}>
                    <ApiFormDatePickerComponent name="creation_date_before" />
                  </Grid>
                  <Grid item xs={3}>
                    <ApiFormDatePickerComponent name="last_updated_after" />
                  </Grid>
                  <Grid item xs={3}>
                    <ApiFormDatePickerComponent name="last_updated_before" />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <ApiFormPaginationTable
              columns={columns}
              title="Productos"
              paginationName="products"
            />
          </Stack>
        </ApiFormComponent>
      </Container>
    </Page>
  );
}
