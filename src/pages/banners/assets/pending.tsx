import { Button, Container, Link, Typography } from "@mui/material";
import { ReactElement } from "react";
import ApiFormPaginationTable from "src/components/api_form/ApiFormPaginationTable";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import { apiSettings } from "src/frontend-utils/settings";
import { BannerAsset } from "src/frontend-utils/types/banner";
import Layout from "src/layouts";
import { PATH_BANNERS, PATH_DASHBOARD } from "src/routes/paths";
import { fDateTimeSuffix } from "src/utils/formatTime";

// ----------------------------------------------------------------------

BannerAssetsPending.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function BannerAssetsPending() {
  const fieldMetadata = [
    {
      fieldType: "pagination" as "pagination",
    },
  ];

  const columns: any[] = [
    {
      headerName: "Id",
      field: "id",
      flex: 1,
    },
    {
      headerName: "Key",
      field: "key",
      flex: 1,
      renderCell: (row: BannerAsset) => (
        <Typography variant="body2" gutterBottom>
          {row.key}
        </Typography>
      ),
    },
    {
      headerName: "Imagen",
      field: "picture_url",
      flex: 1,
      renderCell: (row: BannerAsset) => (
        <Link target="_blank" rel="noopener noreferrer" href={row.picture_url}>
          Imagen
        </Link>
      ),
    },
    {
      headerName: "Fecha creación",
      field: "creation_date",
      flex: 1,
      renderCell: (row: BannerAsset) => fDateTimeSuffix(row.creation_date),
    },
    {
      headerName: "Completitud",
      field: "total_percentage",
      flex: 1,
      renderCell: (row: BannerAsset) => `${row.total_percentage || 0}%`,
    },
    {
      headerName: "Completar",
      field: "is_complete",
      flex: 1,
      renderCell: (row: BannerAsset) => (
        <Button variant="contained" href={`${PATH_BANNERS.assets}/${row.id}`}>
          Completar
        </Button>
      ),
    },
  ];

  return (
    <Page title="Pendientes | Banner assets">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Banner assets", href: PATH_BANNERS.assets },
            { name: "Pendientes" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.banner_assets}?is_complete=0`}
        >
          <ApiFormPaginationTable
            columns={columns}
            title="Pendientes"
          />
        </ApiFormComponent>
      </Container>
    </Page>
  );
}
