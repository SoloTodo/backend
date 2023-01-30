import {
  Button,
  Card,
  CardContent,
  Container,
  Link,
  Stack,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { ReactElement } from "react";
import NextLink from "next/link";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_METAMODEL } from "src/routes/paths";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { MetaModel } from "src/frontend-utils/types/metamodel";
import { GetServerSideProps } from "next/types";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ApiFormPaginationTable from "src/components/api_form/ApiFormPaginationTable";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { useUser } from "src/frontend-utils/redux/user";

// ----------------------------------------------------------------------

MetaModelinstanceList.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function MetaModelinstanceList({
  metaModel,
}: {
  metaModel: MetaModel;
}) {
  const user = useAppSelector(useUser);

  const fieldMetadata = [
    {
      fieldType: "pagination" as "pagination",
    },
    {
      fieldType: "text" as "text",
      name: "search",
    },
  ];

  const columns: GridColDef[] = [
    {
      headerName: "Instancias",
      field: "unicode_representation",
      flex: 1,
      renderCell: (row: any) => (
        <NextLink href={`${PATH_METAMODEL.instances}/${row.id}`} passHref>
          <Link>
            {row.unicode_representation
              ? row.unicode_representation
              : "[Sin Unicode Representation]"}
          </Link>
        </NextLink>
      ),
    },
  ];

  return (
    <Page title={metaModel.name}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Modelos", href: PATH_METAMODEL.models },
            { name: metaModel.name },
          ]}
        />
        <Stack spacing={3}>
          <ApiFormComponent
            fieldsMetadata={fieldMetadata}
            endpoint={`${apiSettings.apiResourceEndpoints.metamodel_instance_models}?models=${metaModel.id}`}
          >
            <Card>
              <CardContent>
                <Stack spacing={2} direction="row">
                  {user?.is_staff && (
                    <NextLink
                      href={`${PATH_METAMODEL.models}/${metaModel.id}/add_instance`}
                      passHref
                    >
                      <Button startIcon={<AddIcon />} variant="contained">
                        Agregar nueva instancia
                      </Button>
                    </NextLink>
                  )}
                  {user?.is_superuser && (
                    <NextLink
                      href={`${PATH_METAMODEL.models}/${metaModel.id}/edit`}
                      passHref
                    >
                      <Button
                        startIcon={<EditIcon />}
                        variant="contained"
                        color="info"
                      >
                        Editar estructura
                      </Button>
                    </NextLink>
                  )}
                </Stack>
              </CardContent>
            </Card>
            <ApiFormPaginationTable
              columns={columns}
              title={metaModel.name}
              withSearch
            />
          </ApiFormComponent>
        </Stack>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const metaModel = await jwtFetch(
      context,
      `${apiSettings.apiResourceEndpoints.metamodel_meta_models}${context.params?.id}/`
    );
    return {
      props: {
        metaModel: metaModel,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
