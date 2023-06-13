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

KeywordSearchUpdateDetail.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function KeywordSearchUpdateDetail({
  keyword,
  update,
  positions,
}: {
  keyword: Keyword;
  update: Update;
  positions: Position[];
}) {
  return (
    <Page title={update.id.toString()}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: update.id.toString() },
          ]}
        />
        <Card>
          <CardHeader title="Última actualización" />
          <CardContent>
            <KeywordSearchUpdateTable update={update} positions={positions} />
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const update = await jwtFetch(
      context,
      `${apiSettings.apiResourceEndpoints.keyword_search_updates}${context.params?.id}/`
    );
    const positions = await jwtFetch(context, `${update.url}positions/`);
    return {
      props: {
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
