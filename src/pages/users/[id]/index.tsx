import { ReactElement } from "react";
import { GetServerSideProps } from "next/types";
import { Container, Grid } from "@mui/material";
import Layout from "src/layouts";
// components
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import Details from "src/sections/Details";
import Options from "src/sections/Options";
// utils
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { useUser } from "src/frontend-utils/redux/user";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
// paths
import { apiSettings } from "src/frontend-utils/settings";
import { PATH_DASHBOARD, PATH_USER } from "src/routes/paths";
// types
import { Detail, Option } from "src/frontend-utils/types/extras";
import { User } from "src/frontend-utils/types/user";

// ----------------------------------------------------------------------

UserPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function UserPage(props: { userDetail: User }) {
  const me = useAppSelector(useUser);
  const { userDetail } = props;

  const baseRoute = `${PATH_USER.root}/${userDetail.id}`;

  const details: Detail[] = [
    {
      key: "email",
      label: "Email",
    },
    {
      key: "full_name",
      label: "Nombre completo",
      renderData: (user: User) => `${user.first_name} ${user.last_name}`,
    },
  ];

  const options: Option[] = []

  if (me && (me.is_superuser || me.id == userDetail.id || me.permissions.includes('solotodo.is_staff_manager'))) {
    options.push({
      text: "Métricas staff",
      path: `${baseRoute}/staff_metrics`,
    })
    options.push({
        text: "Acciones staff",
        path: `${baseRoute}/staff_actions`,
      })
  }

  return (
    <Page title={`${userDetail.email}`}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Usuarios", href: PATH_USER.root },
            { name: `${userDetail.email}` },
          ]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <Details title={""} data={userDetail} details={details} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Options options={options} defaultKey="text" />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const userDetail = await jwtFetch(
      context,
      `${apiSettings.apiResourceEndpoints.users}${context.params?.id}/`
    );
    return {
      props: {
        userDetail: userDetail,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
