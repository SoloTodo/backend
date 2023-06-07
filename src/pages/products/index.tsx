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
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import ApiFormTextComponent from "src/frontend-utils/api_form/fields/text/ApiFormTextComponent";
import {
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { apiSettings } from "src/frontend-utils/settings";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_PRODUCT } from "src/routes/paths";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { fDateTimeSuffix } from "src/utils/formatTime";
import ApiFormDateRangePickerComponent from "src/frontend-utils/api_form/fields/range_picker/ApiFormDateRangePickerComponent";

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
    },
    {
      fieldType: "select" as "select",
      name: "categories",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "categories"),
    },
    {
      fieldType: "select" as "select",
      name: "availability_countries",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "countries"),
    },
    {
      fieldType: "select" as "select",
      name: "availability_stores",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "stores"),
    },
    {
      fieldType: "select" as "select",
      name: "exclude_refurbished",
      multiple: false,
      choices: [
          {
            value: '0',
            label: 'Ver todos'
          },
          {
            value: '1',
            label: 'Sólo equipos nuevos'
          }
      ],
    },
    {
      fieldType: "select" as "select",
      name: "exclude_marketplace",
      multiple: false,
      choices: [
          {
            value: '0',
            label: 'Ver todos'
          },
          {
            value: '1',
            label: 'Sólo de venta directa'
          }
      ],
    },
    {
      fieldType: "text" as "text",
      name: "name",
    },
    {
      fieldType: "date_range" as "date_range",
      name: "creation_date",
    }
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
    }
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
                    <ApiFormSelectComponent
                      name="categories"
                      label="Categorías"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent
                      name="availability_countries"
                      label="Disponibilidad en país"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent
                      name="availability_stores"
                      label="Disponibilidad en retailer"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormTextComponent
                      name="name"
                      label="Palabras clave"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent
                      name="exclude_refurbished"
                      label="¿Mostrar reacondicionados?"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent
                      name="exclude_marketplace"
                      label="¿Mostrar productos de marketplace?"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormDateRangePickerComponent
                      name="creation_date"
                      label="Fecha creación"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <ApiFormPaginationTable columns={columns} title="Productos" />
          </Stack>
        </ApiFormComponent>
      </Container>
    </Page>
  );
}
