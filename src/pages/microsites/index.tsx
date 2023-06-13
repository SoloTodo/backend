import NextLink from "next/link";
import { Card, CardContent, CardHeader, Container, Link } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { GetServerSideProps } from "next/types";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { PATH_DASHBOARD, PATH_MICROSITE } from "src/routes/paths";
import CustomTable from "src/sections/CustomTable";
import { ReactElement } from "react";
import Layout from "src/layouts";
import { Microsite } from "src/frontend-utils/types/microsite";

// ----------------------------------------------------------------------

Microsites.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Microsites({ microsites }: { microsites: Microsite[] }) {
  const columns: GridColDef[] = [
    {
      headerName: "Nombre",
      field: "name",
      flex: 1,
      renderCell: (params) => (
        <NextLink href={`${PATH_MICROSITE.root}/${params.row.id}`} passHref>
          <Link>{params.row.name}</Link>
        </NextLink>
      ),
    },
  ];

  return (
    <Page title="Sitios">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Sitios" },
          ]}
        />
        <Card>
          <CardHeader title="Sitios" />
          <CardContent>
            <CustomTable data={microsites} columns={columns} />
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const microsites = await jwtFetch(
    context,
    apiSettings.apiResourceEndpoints.microsite_brands
  );
  return {
    props: {
      microsites: microsites,
    },
  };
};
