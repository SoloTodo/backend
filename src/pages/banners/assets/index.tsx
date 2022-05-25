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
import { ReactElement } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import ApiFormPaginationTable from "src/components/api_form/ApiFormPaginationTable";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormSelectComponent, {
  choicesYesNo,
} from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import { apiSettings } from "src/frontend-utils/settings";
import { BannerAsset } from "src/frontend-utils/types/banner";
import Layout from "src/layouts";
import { PATH_BANNERS, PATH_DASHBOARD } from "src/routes/paths";
import { fDateTimeSuffix } from "src/utils/formatTime";

// ----------------------------------------------------------------------

BannerAssets.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function BannerAssets() {
  const fieldMetadata = [
    {
      fieldType: "pagination" as "pagination"
    },
    {
      fieldType: "select" as "select",
      name: "is_active",
      multiple: false,
      choices: choicesYesNo,
    },
    {
      fieldType: "select" as "select",
      name: "is_complete",
      multiple: false,
      choices: choicesYesNo,
    },
  ];

  const columns: any[] = [
    {
      headerName: "Id",
      field: "id",
      flex: 1,
      renderCell: (row: BannerAsset) => (
        <NextLink href={`${PATH_BANNERS.assets}/${row.id}`} passHref>
          <Link>{row.id}</Link>
        </NextLink>
      ),
    },
    {
      headerName: "Key",
      field: "key",
      flex: 1,
    },
    {
      headerName: "Imagen",
      field: "picture_url",
      renderCell: (row: BannerAsset) => (
        <Link target="_blank" rel="noopener noreferrer" href={row.picture_url}>
          Imagen
        </Link>
      )
    },
    {
      headerName: "Fecha creación",
      field: "creation_date",
      renderCell: (row: BannerAsset) => fDateTimeSuffix(row.creation_date),
    },
    {
      headerName: "¿Activo?",
      field: "is_active",
      flex: 1,
      renderCell: (row: BannerAsset) =>
        row.is_active ? <CheckIcon /> : <ClearIcon />,
    },
    {
      headerName: "Completitud",
      field: "total_percentage",
      renderCell: (row: BannerAsset) => `${row.total_percentage || 0}%`,
    },
  ];

  return (
    <Page title="Banner assets">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Banner assets" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.banner_assets}`}
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
                    <ApiFormSelectComponent name="is_active" label="¿Activa?" />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent name="is_complete" label="Completo?" />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
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
