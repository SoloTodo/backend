import { ReactElement } from "react";
import NextLink from "next/link";
import { GetServerSideProps } from "next/types";
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Link,
  Stack,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import Layout from "src/layouts";
// components
import Page from "src/components/Page";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormActionsSummaryTable from "src/sections/users/ApiFormActionsSummaryTable";
import ApiFormRangePickerComponent from "src/frontend-utils/api_form/fields/range_picker/ApiFormRangePickerComponent";
// utils
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { fDateTimeSuffix } from "src/utils/formatTime";
// paths
import { apiSettings } from "src/frontend-utils/settings";
import {
  PATH_DASHBOARD,
  PATH_ENTITY,
  PATH_PRODUCT,
  PATH_USER,
} from "src/routes/paths";
// types
import { User } from "src/frontend-utils/types/user";

// ----------------------------------------------------------------------

ActionsSummary.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function ActionsSummary(props: { userDetail: User }) {
  const { userDetail } = props;

  const fieldMetadata = [
    {
      fieldType: "date_range" as "date_range",
      name: "timestamp",
    },
  ];

  const entityColumns: GridColDef[] = [
    {
      headerName: "Entidad",
      field: "id",
      flex: 1,
      renderCell: (params) => (
        <NextLink href={`${PATH_ENTITY.root}/${params.row.entity_id}`} passHref>
          <Link>{params.row.name}</Link>
        </NextLink>
      ),
    },
    {
      headerName: "Fecha",
      field: "date",
      flex: 1,
      renderCell: (params) => fDateTimeSuffix(params.row.date),
    },
  ];

  const productColumns: GridColDef[] = [
    {
      headerName: "Producto",
      field: "id",
      flex: 1,
      renderCell: (params) => (
        <NextLink href={`${PATH_PRODUCT.root}/${params.row.id}`} passHref>
          <Link>{params.row.name}</Link>
        </NextLink>
      ),
    },
    {
      headerName: "Fecha",
      field: "date",
      flex: 1,
      renderCell: (params) => fDateTimeSuffix(params.row.date),
    },
  ];

  const wtbEntityColumns: GridColDef[] = [
    {
      headerName: "Entidad",
      field: "id",
      flex: 1,
      renderCell: (params) => (
        <NextLink href={`${PATH_ENTITY.root}/${params.row.id}`} passHref>
          <Link>{params.row.name}</Link>
        </NextLink>
      ),
    },
    {
      headerName: "Fecha",
      field: "date",
      flex: 1,
      renderCell: (params) => fDateTimeSuffix(params.row.date),
    },
  ];

  return (
    <Page title={`${userDetail.email} | Acciones staff`}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Usuarios", href: PATH_USER.root },
            {
              name: userDetail.email,
              href: `${PATH_USER.root}/${userDetail.id}`,
            },
            { name: "Acciones staff" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.users}${userDetail.id}/staff_actions/`}
        >
          <Stack spacing={3}>
            <Card>
              <CardHeader title="Filtros" />
              <CardContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 6, md: 12 }}
                >
                  <Grid item xs={6}>
                    <ApiFormRangePickerComponent
                      name="timestamp"
                      label="Rango"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card>
              <CardHeader title="Enitidades trabajadas" />
              <CardContent>
                <ApiFormActionsSummaryTable
                  columns={entityColumns}
                  dataKey="entities"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader title="Productos creados" />
              <CardContent>
                <ApiFormActionsSummaryTable
                  columns={productColumns}
                  dataKey="products"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader title="WTB Enitidades asociadas" />
              <CardContent>
                <ApiFormActionsSummaryTable
                  columns={wtbEntityColumns}
                  dataKey="wtb_entities"
                />
              </CardContent>
            </Card>
          </Stack>
        </ApiFormComponent>
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
