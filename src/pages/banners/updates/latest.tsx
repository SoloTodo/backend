import { Card, CardContent, CardHeader, Container } from "@mui/material";
import { GridColumns } from "@mui/x-data-grid";
import { GetServerSideProps } from "next/types";
import { ReactElement } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { apiSettings } from "src/frontend-utils/settings";
import { BannerUpdate, statusCodes } from "src/frontend-utils/types/banner";
import Layout from "src/layouts";
import { PATH_BANNERS, PATH_DASHBOARD } from "src/routes/paths";
import CustomTable from "src/sections/CustomTable";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { fDateTimeSuffix } from "src/utils/formatTime";

// ----------------------------------------------------------------------

BannerUpdatesLatest.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function BannerUpdatesLatest({
  latest,
}: {
  latest: BannerUpdate[];
}) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const columns: GridColumns<BannerUpdate> = [
    {
      headerName: "Tienda",
      field: "store",
      renderCell: (params) => apiResourceObjects[params.row.store].name,
    },
    {
      headerName: "Estado",
      field: "status",
      renderCell: (params) =>
        params.row.status ? statusCodes[params.row.status] : "N/A",
    },
    {
      headerName: "Fecha",
      field: "timestamp",
      renderCell: (params) => fDateTimeSuffix(params.row.timestamp),
    },
    {
      headerName: "Errores",
      field: "status_message",
      renderCell: (params) =>
        params.row.status_message ? params.row.status_message : "N/A",
    },
  ];

  return (
    <Page title="Últimas | Actualizaciones de banners">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Actualizaciones de banners", href: PATH_BANNERS.updates },
            { name: "Últimas" },
          ]}
        />
        <Card>
          <CardHeader title="Últimas actualizaciones" />
          <CardContent>
            <CustomTable
              data={latest.filter((x) => x != null)}
              columns={columns}
            />
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const latest = await jwtFetch(
    context,
    `${apiSettings.apiResourceEndpoints.banner_updates}latest/`
  );
  return {
    props: {
      latest: Object.values(latest),
    },
  };
};
