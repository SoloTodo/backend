import { Container, Link, Stack } from "@mui/material";
import NextLink from "next/link";
import { GetServerSideProps } from "next/types";
import { ReactElement } from "react";
import ApiFormPaginationTable from "src/components/api_form/ApiFormPaginationTable";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { Keyword, Update } from "src/frontend-utils/types/keyword";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_KEYWORD } from "src/routes/paths";
import { fDateTimeSuffix } from "src/utils/formatTime";

// ----------------------------------------------------------------------

KeywordSearchUpdates.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

const status_dict = {
  1: "En proceso",
  2: "Exitosa",
  3: "Error",
};

// ----------------------------------------------------------------------

export default function KeywordSearchUpdates({
  keyword,
}: {
  keyword: Keyword;
}) {
  const fieldsMetadata = [
    {
      fieldType: "pagination" as "pagination",
    },
  ];

  const columns: any[] = [
    {
      headerName: "Nombre",
      field: "name",
      flex: 1,
      renderCell: (row: Update) => (
        <NextLink href={`${PATH_KEYWORD.updates}/${row.id}`} passHref>
          <Link>{row.id}</Link>
        </NextLink>
      ),
    },
    {
      headerName: "Fecha",
      field: "creation_date",
      flex: 1,
      renderCell: (row: Update) => fDateTimeSuffix(row.creation_date),
    },
    {
      headerName: "Estado",
      field: "status",
      flex: 1,
      renderCell: (row: Update) => status_dict[row.status],
    },
  ];

  return (
    <Page title="Actualizaciones">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Keyword visibility", href: PATH_KEYWORD.root },
            { name: keyword.id.toString() },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldsMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.keyword_search_updates}?searches=${keyword.id}`}
        >
          <Stack spacing={3}>
            <ApiFormPaginationTable columns={columns} title="Actualizaciones" />
          </Stack>
        </ApiFormComponent>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const keyword = await jwtFetch(
    context,
    `${apiSettings.apiResourceEndpoints.keyword_searches}${context.params?.id}/`
  );
  return {
    props: {
      keyword: keyword,
    },
  };
};
