import { ReactElement } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Stack,
} from "@mui/material";
import { GetServerSideProps } from "next/types";
import { GridColDef } from "@mui/x-data-grid";
import Layout from "src/layouts";
// components
import Page from "src/components/Page";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormDatePickerComponent from "src/frontend-utils/api_form/fields/date_picker/ApiDatePickerComponent";
import ApiFormStaffSummaryTable from "src/sections/users/ApiFormStaffSummaryTable";
// utils
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import currency from "currency.js";
// paths
import { apiSettings } from "src/frontend-utils/settings";
import { PATH_DASHBOARD, PATH_USER } from "src/routes/paths";
// types
import { User } from "src/frontend-utils/types/user";

// ----------------------------------------------------------------------

StaffSummary.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function StaffSummary(props: { userDetail: User }) {
  const { userDetail } = props;

  const fieldMetadata = [
    {
      fieldType: "date" as "date",
      name: "timestamp_after",
      label: "Desde",
    },
    {
      fieldType: "date" as "date",
      name: "timestamp_before",
      label: "Hasta",
    },
  ];

  const columns: GridColDef[] = [
    {
      headerName: "Item",
      field: "id",
      flex: 1,
    },
    {
      headerName: "Conteo",
      field: "count",
      flex: 1,
    },
    {
      headerName: "Monto individual",
      field: "individual_amount",
      flex: 1,
      renderCell: (params) =>
        currency(params.row.individual_amount, {
          precision: 0,
        }).format(),
    },
    {
      headerName: "Monto total",
      field: "total_amount",
      flex: 1,
      renderCell: (params) =>
        currency(params.row.total_amount, {
          precision: 0,
        }).format(),
    },
  ];

  return (
    <Page title={`${userDetail.email} | Resumen staff`}>
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
            { name: "Resumen staff" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.users}${userDetail.id}/staff_summary/`}
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
                    <Stack spacing={2} direction="row">
                      <ApiFormDatePickerComponent name="timestamp_after" />
                      <ApiFormDatePickerComponent name="timestamp_before" />
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card>
              <CardHeader title="Resumen staff" />
              <CardContent>
                <ApiFormStaffSummaryTable columns={columns} />
              </CardContent>
            </Card>
          </Stack>
        </ApiFormComponent>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let userDetail = {};
  if (context.params) {
    try {
      userDetail = await jwtFetch(
        context,
        `${apiSettings.apiResourceEndpoints.users}${context.params.id}/`
      );
    } catch {
      return {
        notFound: true,
      };
    }
  }
  return {
    props: {
      userDetail: userDetail,
    },
  };
};