import NextLink from "next/link";
import { Card, CardContent, CardHeader, Container, Link } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { GetServerSideProps } from "next/types";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { Report } from "src/frontend-utils/types/report";
import { PATH_DASHBOARD, PATH_REPORTS } from "src/routes/paths";
import CustomTable from "src/sections/CustomTable";
import { ReactElement } from "react";
import Layout from "src/layouts";

// ----------------------------------------------------------------------

Reports.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Reports({ reports }: { reports: Report[] }) {
  const columns: GridColDef[] = [
    {
      headerName: "Nombre",
      field: "name",
      flex: 1,
      renderCell: (params) => (
        <NextLink href={`${PATH_REPORTS.root}/${params.row.slug}`} passHref>
          <Link>{params.row.name}</Link>
        </NextLink>
      ),
    },
  ];

  return (
    <Page title="Reportes">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Reportes" },
          ]}
        />
        <Card>
          <CardHeader title="Reportes" />
          <CardContent>
            <CustomTable data={reports} columns={columns} />
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const reports = await jwtFetch(
    context,
    apiSettings.apiResourceEndpoints.reports
  );
  return {
    props: {
      reports: reports,
    },
  };
};
