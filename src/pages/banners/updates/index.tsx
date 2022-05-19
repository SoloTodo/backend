import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Link,
  Stack,
} from "@mui/material";
import NextLink from "next/link";
import { ReactElement } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import ApiFormPaginationTable from "src/components/api_form/ApiFormPaginationTable";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormDatePickerComponent from "src/frontend-utils/api_form/fields/date_picker/ApiDatePickerComponent";
import ApiFormSelectComponent, {
  choicesYesNo,
} from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import {
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { apiSettings } from "src/frontend-utils/settings";
import { BannerUpdate, statusCodes } from "src/frontend-utils/types/banner";
import Layout from "src/layouts";
import { PATH_BANNERS, PATH_DASHBOARD } from "src/routes/paths";
import { useAppSelector } from "src/store/hooks";
import { fDateTimeSuffix } from "src/utils/formatTime";

// ----------------------------------------------------------------------

BannerUpdates.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function BannerUpdates() {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const fieldMetadata = [
    {
      fieldType: "pagination" as "pagination",
      name: "banners",
    },
    {
      fieldType: "select" as "select",
      name: "stores",
      label: "Tiendas",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "stores"),
    },
    {
      fieldType: "select" as "select",
      name: "is_active",
      label: "¿Activa?",
      multiple: false,
      choices: choicesYesNo,
    },
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

  const columns: any[] = [
    {
      headerName: "Id",
      field: "id",
      flex: 1,
      renderCell: (row: BannerUpdate) => (
        <NextLink href={`${PATH_BANNERS.banners}?update_id=${row.id}`} passHref>
          <Link>
            {row.id}
          </Link>
        </NextLink>
      ),
    },
    {
      headerName: "Tienda",
      field: "store",
      flex: 1,
      renderCell: (row: BannerUpdate) => apiResourceObjects[row.store].name,
    },
    {
      headerName: "¿Activo?",
      field: "is_active",
      flex: 1,
      renderCell: (row: BannerUpdate) =>
        row.is_active ? <CheckIcon /> : <ClearIcon />,
    },
    {
      headerName: "Estado",
      field: "status",
      renderCell: (row: BannerUpdate) =>
        row.status
          ? statusCodes[row.status]
          : "N/A",
    },
    {
      headerName: "Fecha",
      field: "timestamp",
      renderCell: (row: BannerUpdate) => fDateTimeSuffix(row.timestamp),
    },
  ];

  return (
    <Page title="Actualizaciones de banners">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Actualizaciones de banners" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.banner_updates}?ordering=-timestamp`}
        >
          <Stack spacing={3}>
            <Card>
              <CardHeader title="Filtros" />
              <CardContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 6, md: 12 }}
                >
                  <Grid item xs={3}>
                    <ApiFormDatePickerComponent name="timestamp_after" />
                  </Grid>
                  <Grid item xs={3}>
                    <ApiFormDatePickerComponent name="timestamp_before" />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent name="stores" />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent name="is_active" />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <ApiFormPaginationTable
              columns={columns}
              title="Banners"
              paginationName="banners"
            />
          </Stack>
        </ApiFormComponent>
      </Container>
    </Page>
  );
}
