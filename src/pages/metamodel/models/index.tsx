import { Box, CircularProgress, Container, Link, Stack } from "@mui/material";
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
import AddMetaModel from "src/sections/metamodel/AddMetaModel";
import { MetaModel } from "src/frontend-utils/types/metamodel";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { useUser } from "src/frontend-utils/redux/user";

// ----------------------------------------------------------------------

MetaModels.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function MetaModels() {
  const [isLoading, setLoading] = useState(false);
  const [models, setModels] = useState<MetaModel[]>([]);
  const user = useAppSelector(useUser);

  const addNewModel = (newModel: MetaModel) => {
    const newModels = [...models, newModel];
    newModels.sort((a, b) => {
      if (b.name > a.name) return -1;
      if (b.name < a.name) return 1;
      return 0;
    });
    setModels(newModels);
  };

  useEffect(() => {
    const myAbortController = new AbortController();

    setLoading(true);
    jwtFetch(null, apiSettings.apiResourceEndpoints.metamodel_meta_models, {
      signal: myAbortController.signal,
    })
      .then((res) => {
        setModels(res);
        setLoading(false);
      })
      .catch((_) => {});
    return () => {
      myAbortController.abort();
    };
  }, []);

  const columns: GridColDef[] = [
    {
      headerName: "Nombre",
      field: "name",
      flex: 1,
      renderCell: (params) =>
        user?.is_staff ? (
          <NextLink href={`${PATH_METAMODEL.models}/${params.row.id}`} passHref>
            <Link>{params.row.name}</Link>
          </NextLink>
        ) : (
          params.row.name
        ),
    },
  ];

  return (
    <Page title="Modelos">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Modelos", href: PATH_METAMODEL.models },
          ]}
        />
        {isLoading ? (
          <Box textAlign="center">
            <CircularProgress color="inherit" />
          </Box>
        ) : (
          <Stack spacing={3}>
            {user?.is_superuser && <AddMetaModel addNewModel={addNewModel} />}
            <BasicTable title="Modelos" columns={columns} data={models} />
          </Stack>
        )}
      </Container>
    </Page>
  );
}
