import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Link,
  Stack,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { ReactElement, useEffect, useState } from "react";
import NextLink from "next/link";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_METAMODEL } from "src/routes/paths";
import BasicTable from "src/sections/BasicTable";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import {
  InstanceMetaModel,
  MetaModel,
} from "src/frontend-utils/types/metamodel";
import { GetServerSideProps } from "next/types";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

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
  const [isLoading, setLoading] = useState(false);
  const [modelInstances, setModelInstances] = useState<InstanceMetaModel[]>([]);

  useEffect(() => {
    const myAbortController = new AbortController();

    setLoading(true);
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.metamodel_instance_models}?models=${metaModel.id}`,
      {
        signal: myAbortController.signal,
      }
    )
      .then((res) => {
        setModelInstances(res);
        setLoading(false);
      })
      .catch((_) => {});
    return () => {
      myAbortController.abort();
    };
  }, []);

  const columns: GridColDef[] = [
    {
      headerName: "Instancias",
      field: "unicode_representation",
      flex: 1,
      renderCell: (params) => (
        <NextLink
          href={`${PATH_METAMODEL.instances}/${params.row.id}`}
          passHref
        >
          <Link>
            {params.row.unicode_representation
              ? params.row.unicode_representation
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
        {isLoading ? (
          <Box textAlign="center">
            <CircularProgress color="inherit" />
          </Box>
        ) : (
          <Stack spacing={3}>
            <Card>
              <CardContent>
                <Stack spacing={2} direction="row">
                  <NextLink
                    href={`${PATH_METAMODEL.models}/${metaModel.id}/add_instance`}
                    passHref
                  >
                    <Button startIcon={<AddIcon />} variant="contained">
                      Agregar nueva instancia
                    </Button>
                  </NextLink>
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
                </Stack>
              </CardContent>
            </Card>
            <BasicTable
              title={metaModel.name}
              columns={columns}
              data={modelInstances}
            />
          </Stack>
        )}
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
