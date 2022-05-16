import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Link,
  Stack,
} from "@mui/material";
import NextLink from "next/link";
import { GetServerSideProps } from "next/types";
import { ReactElement } from "react";
import ApiFormPaginationTable from "src/components/api_form/ApiFormPaginationTable";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Image from "src/components/Image";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormDatePickerComponent from "src/frontend-utils/api_form/fields/date_picker/ApiDatePickerComponent";
import ApiFormSelectComponent, {
  choicesYesNo,
} from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import {
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { apiSettings } from "src/frontend-utils/settings";
import { Banner } from "src/frontend-utils/types/banner";
import { InLineProduct } from "src/frontend-utils/types/entity";
import Layout from "src/layouts";
import { PATH_BANNERS, PATH_DASHBOARD } from "src/routes/paths";
import { useAppSelector } from "src/store/hooks";

// ----------------------------------------------------------------------

Banners.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Banners({
  brands,
  subsections,
}: {
  brands: InLineProduct[];
  subsections: InLineProduct[];
}) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const brandChoices = brands.map((b) => ({
    label: b.name,
    value: b.id,
  }));

  const subsectionChoices = subsections.map((b) => ({
    label: b.name,
    value: b.id,
  }));

  const fieldMetadata = [
    {
      fieldType: "pagination" as "pagination",
      name: "banners",
    },
    {
      fieldType: "select" as "select",
      name: "brands",
      label: "Marcas",
      multiple: true,
      choices: brandChoices,
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
      name: "stores",
      label: "Tiendas",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "stores"),
    },
    {
      fieldType: "select" as "select",
      name: "types",
      label: "Tipos",
      multiple: true,
      choices: subsectionChoices,
    },
    {
      fieldType: "select" as "select",
      name: "is_active",
      label: "¿Activa?",
      multiple: false,
      choices: choicesYesNo,
    },
    {
      fieldType: "date" as "date",
      name: "creation_date_after",
      label: "Desde (Fecha creación)",
    },
    {
      fieldType: "date" as "date",
      name: "creation_date_before",
      label: "Hasta (Fecha creación)",
    },
  ];

  const columns: any[] = [
    {
      headerName: "Asset",
      field: "asset",
      flex: 1,
      renderCell: (row: Banner) => (
        <NextLink href={`${PATH_BANNERS.assets}/${row.asset.id}`} passHref>
          <Link>
            <Image src={row.asset.picture_url} />
          </Link>
        </NextLink>
      ),
    },
    {
      headerName: "Tienda",
      field: "store",
      flex: 1,
      renderCell: (row: Banner) => apiResourceObjects[row.update.store].name,
    },
    {
      headerName: "Subsección",
      field: "subseccion",
      flex: 1,
      renderCell: (row: Banner) => (
        <Link target="_blank" rel="noopener noreferrer" href={row.external_url}>
          {`${row.subsection.section.name} > ${row.subsection.name}`}
        </Link>
      ),
    },
    {
      headerName: "Destino",
      field: "destiny",
      flex: 1,
      renderCell: (row: Banner) =>
        row.destination_url_list.length !== 0 ? (
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={row.external_url}
          >
            {`${row.subsection.section.name} > ${row.subsection.name}`}
          </Link>
        ) : (
          "Sin link"
        ),
    },
  ];

  return (
    <Page title="Banners">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Banners" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.banners}?ordering=-update__timestamp`}
        >
          <Stack spacing={3}>
            <Card>
              <CardHeader title="Filtros" />
              <CardContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 6, md: 12 }}
                >
                  <Grid item xs={6}>
                    <ApiFormSelectComponent name="brands" />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent name="categories" />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent name="stores" />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent name="types" />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent name="is_active" />
                  </Grid>
                  <Grid item xs={3}>
                    <ApiFormDatePickerComponent name="creation_date_after" />
                  </Grid>
                  <Grid item xs={3}>
                    <ApiFormDatePickerComponent name="creation_date_before" />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <ApiFormPaginationTable
              columns={columns}
              title="Banners"
              paginationName="banners"
            />
          </Stack>
        </ApiFormComponent>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const brands = await jwtFetch(
    context,
    apiSettings.apiResourceEndpoints.brands
  );
  const subsections = await jwtFetch(
    context,
    apiSettings.apiResourceEndpoints.banner_subsection_types
  );
  return {
    props: {
      brands: brands,
      subsections: subsections,
    },
  };
};
