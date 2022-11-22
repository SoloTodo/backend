import { Card, CardContent, CardHeader, Container } from "@mui/material";
import { GetServerSideProps } from "next/types";
import { ReactElement } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { MetaModel } from "src/frontend-utils/types/metamodel";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_METAMODEL } from "src/routes/paths";
import MetaModelInstanceForm from "src/sections/metamodel/MetaModelInstanceForm";

// ----------------------------------------------------------------------

MetaModelAddInstance.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function MetaModelAddInstance({
  metaModel,
}: {
  metaModel: MetaModel;
}) {
  return (
    <Page title={`${metaModel.name} | Agregar Instancia`}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Modelos", href: PATH_METAMODEL.models },
            {
              name: metaModel.name,
              href: `${PATH_METAMODEL.models}/${metaModel.id}`,
            },
            { name: "Agregar Instancia" },
          ]}
        />
        <Card>
          <CardHeader title={metaModel.name} />
          <CardContent>
            <MetaModelInstanceForm metaModel={metaModel} />
          </CardContent>
        </Card>
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
