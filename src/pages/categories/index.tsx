import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import { Container } from "@mui/material";
// layout
import Layout from "src/layouts";
// components
import Page from "src/components/Page";
// settings
import { apiSettings } from "src/frontend-utils/settings";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import BasicTable from "src/sections/BasicTable";

// ----------------------------------------------------------------------

Categories.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Categories(props: Record<string, any>) {
  const { categoriesData } = props;

  const columns = [
    {
      headerName: "Id",
      field: "id",
      flex: 1,
    },
    {
      headerName: "Nombre",
      field: "name",
      flex: 1,
    },
  ];

  return (
    <Page title="Categorías">
      <Container>
        <BasicTable
          title="Categorías"
          columns={columns}
          data={categoriesData}
        />
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const categoriesData = await jwtFetch(
    context,
    apiSettings.apiResourceEndpoints.categories
  );
  return {
    props: {
      categoriesData: categoriesData,
    },
  };
};
