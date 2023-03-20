import { Card, CardContent, CardHeader, Container, Grid } from "@mui/material";
import { GetServerSideProps } from "next";
import { ReactElement } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { Keyword, Position, Update } from "src/frontend-utils/types/keyword";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_KEYWORD } from "src/routes/paths";
import Options from "src/sections/Options";
import { Option } from "src/frontend-utils/types/extras";
import KeywordSearchUpdateTable from "src/sections/keyword_searches/KeywordSearchUpdateTable";

// ----------------------------------------------------------------------

KeywordSearch.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function KeywordSearch({
  keyword,
  update,
  positions,
}: {
  keyword: Keyword;
  update: Update;
  positions: Position[];
}) {
  const baseRoute = `${PATH_KEYWORD.root}/${keyword.id}`;

  const options: Option[] = [
    {
      key: 1,
      text: "Todas las actualizaciones",
      path: `${baseRoute}/updates`,
    },
  ];

  return (
    <Page title={keyword.id.toString()}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Keyword visibility", href: PATH_KEYWORD.root },
            { name: keyword.id.toString() },
          ]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <Card>
              <CardHeader title="Última actualización" />
              <CardContent>
                <KeywordSearchUpdateTable
                update={update}
                  positions={positions}
                  withoutMinWidth
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Options options={options} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const keyword = await jwtFetch(
      context,
      `${apiSettings.apiResourceEndpoints.keyword_searches}${context.params?.id}/`
    );
    const update = await jwtFetch(context, `${keyword.active_update}`);
    const positions = await jwtFetch(
      context,
      `${keyword.active_update}positions/`
    );
    return {
      props: {
        keyword: keyword,
        update: update,
        positions: positions,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
