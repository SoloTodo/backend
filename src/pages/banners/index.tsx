import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { GetServerSideProps } from "next/types";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import { ReactElement } from "react";
import ApiFormPaginationTable from "src/components/api_form/ApiFormPaginationTable";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Image from "src/components/Image";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
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
import { fDateTimeSuffix } from "src/utils/formatTime";
import ApiFormRemoveListFieldComponent from "src/frontend-utils/api_form/fields/remove/ApiFormRemoveListFieldComponent";
import { useRouter } from "next/router";
import ApiFormRangePickerComponent from "src/frontend-utils/api_form/fields/range_picker/ApiFormRangePickerComponent";

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
  const router = useRouter();
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
      name: "stores",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "stores"),
    },
    {
      fieldType: "select" as "select",
      name: "types",
      multiple: true,
      choices: subsectionChoices,
    },
    {
      fieldType: "select" as "select",
      name: "is_active",
      multiple: false,
      choices: choicesYesNo,
    },
    {
      fieldType: "date_range" as "date_range",
      name: "creation_date",
    },
    {
      fieldType: "remove" as "remove",
      name: "update_id",
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
          <Stack spacing={1}>
            {row.destination_url_list.map((l) => (
              <Link target="_blank" rel="noopener noreferrer" href={l} key={l}>
                Link
              </Link>
            ))}
          </Stack>
        ) : (
          "Sin link"
        ),
    },
    {
      headerName: "Act?",
      field: "update",
      flex: 1,
      renderCell: (row: Banner) =>
        row.update.is_active ? <CheckIcon /> : <ClearIcon />,
    },
    {
      headerName: "Marca",
      field: "brand",
      flex: 1,
      renderCell: (row: Banner) =>
        row.asset.total_percentage ? (
          <Stack spacing={1}>
            {row.asset.contents.map((c, index) => (
              <Typography key={index}>{c.brand.name}</Typography>
            ))}
          </Stack>
        ) : (
          "Sin contenido"
        ),
    },
    {
      headerName: "Categoría",
      field: "category",
      flex: 1,
      renderCell: (row: Banner) =>
        row.asset.total_percentage ? (
          <Stack spacing={1}>
            {row.asset.contents.map((c, index) => (
              <Typography key={index}>{c.category.name}</Typography>
            ))}
          </Stack>
        ) : (
          "Sin contenido"
        ),
    },
    {
      headerName: "%",
      field: "porcentaje",
      flex: 1,
      renderCell: (row: Banner) =>
        row.asset.total_percentage ? (
          <Stack spacing={1}>
            {row.asset.contents.map((c, index) => (
              <Typography key={index}>{c.percentage}%</Typography>
            ))}
          </Stack>
        ) : (
          "Sin contenido"
        ),
    },
    {
      headerName: "Posición",
      field: "position",
      flex: 1,
    },
    {
      headerName: "Fecha creación",
      field: "last_updated",
      renderCell: (row: Banner) => fDateTimeSuffix(row.update.timestamp),
      flex: 1,
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
                    <ApiFormSelectComponent name="brands" label="Marcas"/>
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent name="categories" label="Categorías"/>
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent name="stores" label="Tiendas"/>
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent name="types" label="Tipos"/>
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent name="is_active" label="¿Activa?"/>
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormRangePickerComponent name="creation_date" label="Fecha creación" />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            {typeof router.query.update_id !== "undefined" ? (
              <Card>
                <CardHeader title="Filtros Extra" />
                <CardContent>
                  <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                    columns={{ xs: 6, md: 12 }}
                  >
                    <Grid item xs={6}>
                      <ApiFormRemoveListFieldComponent name="update_id" label="Banner Update" />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ) : null}
            <ApiFormPaginationTable
              columns={columns}
              title="Banners"
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
