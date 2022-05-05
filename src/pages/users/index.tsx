import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import { Container } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
// layout
import Layout from "src/layouts";
// components
import Page from "src/components/Page";
// settings
import { apiSettings } from "src/frontend-utils/settings";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import BasicTable from "src/sections/BasicTable";

// ----------------------------------------------------------------------

Users.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Users(props: Record<string, any>) {
  const { users } = props;

  const columns: GridColDef[] = [
    {
      headerName: "Email",
      field: "email",
      flex: 1,
    },
    {
      headerName: "Nombre",
      field: "name",
      flex: 1,
      renderCell: params => `${params.row.first_name} ${params.row.last_name}`
    },
  ];

  return (
    <Page title="Usuarios">
      <Container maxWidth={false}>
        <BasicTable
          title="Usuarios"
          columns={columns}
          data={users}
        />
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const users = await jwtFetch(
    context,
    apiSettings.apiResourceEndpoints.users_with_staff_actions
  );
  return {
    props: {
      users: users,
    },
  };
};
