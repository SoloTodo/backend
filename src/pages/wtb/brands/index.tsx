import NextLink from "next/link";
import { Card, CardContent, CardHeader, Container, Link } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { GetServerSideProps } from "next/types";
import { ReactElement } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { Brand } from "src/frontend-utils/types/wtb";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_WTB } from "src/routes/paths";
import CustomTable from "src/sections/CustomTable";

// ----------------------------------------------------------------------

Brands.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Brands({ brands }: { brands: Brand[] }) {
  const columns: GridColDef[] = [
    {
      headerName: "Id",
      field: "id",
      flex: 1,
    },
    {
      headerName: "Nombre",
      field: "name",
      flex: 1,
      renderCell: (params) => (
        <NextLink href={`${PATH_WTB.brands}/${params.row.id}`} passHref>
          <Link>{params.row.name}</Link>
        </NextLink>
      ),
    },
  ];

  return (
    <Page title="Marcas | Donde Comprar">
      <Container>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Donde Comprar", href: PATH_WTB.brands },
            { name: "Marcas" },
          ]}
        />
        <Card>
          <CardHeader title="Marcas" />
          <CardContent>
            <CustomTable columns={columns} data={brands} />
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const brands = await jwtFetch(
    context,
    apiSettings.apiResourceEndpoints.wtb_brands
  );
  return {
    props: {
      brands: brands,
    },
  };
};
