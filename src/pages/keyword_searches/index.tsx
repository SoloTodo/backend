import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Link,
  Stack,
} from "@mui/material";
import NextLink from "next/link";
import { GridColDef } from "@mui/x-data-grid";
import { ReactElement } from "react";
import ApiFormStoreTable from "src/components/api_form/ApiFormStoreTable";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import { apiSettings } from "src/frontend-utils/settings";
import { Keyword } from "src/frontend-utils/types/keyword";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_KEYWORD } from "src/routes/paths";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import AddKeywordSearch from "src/sections/keyword_searches/AddKeywordSearch";
import DeleteKeywordSearch from "src/sections/keyword_searches/DeleteKeywordSearch";

// ----------------------------------------------------------------------

KeywordSearches.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function KeywordSearches() {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const columns: GridColDef<Keyword>[] = [
    {
      headerName: "Id",
      field: "id",
      renderCell: (params) => (
        <NextLink href={`${PATH_KEYWORD.root}/${params.row.id}`} passHref>
          <Link>{params.row.id}</Link>
        </NextLink>
      ),
    },
    {
      headerName: "Tienda",
      field: "store",
      flex: 1,
      renderCell: (params) => apiResourceObjects[params.row.store].name,
    },
    {
      headerName: "Categoría",
      field: "category",
      flex: 1,
      renderCell: (params) => apiResourceObjects[params.row.category].name,
    },
    {
      headerName: "Keyword",
      field: "keyword",
      flex: 1,
    },
    {
      headerName: "Umbral",
      field: "threshold",
      flex: 1,
    },
    {
      headerName: "Eliminar",
      field: "delete",
      renderCell: (params) => <DeleteKeywordSearch keyword={params.row} />,
    },
  ];

  return (
    <Page title="Keyword visibility">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Keyword visibility" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={[]}
          endpoint={`${apiSettings.apiResourceEndpoints.keyword_searches}?ordering=id`}
        >
          <Stack spacing={3}>
            <AddKeywordSearch />
            <Card>
              <CardHeader title="Búsquedas por keywords" />
              <CardContent>
                <ApiFormStoreTable columns={columns} />
              </CardContent>
            </Card>
          </Stack>
        </ApiFormComponent>
      </Container>
    </Page>
  );
}
