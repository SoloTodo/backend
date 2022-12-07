import { Card, CardContent, CardHeader, Container } from "@mui/material";
import { GetServerSideProps } from "next";
import { ReactElement, useEffect, useState } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { InstanceMetaModel } from "src/frontend-utils/types/metamodel";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_METAMODEL } from "src/routes/paths";
import MetaModelInstanceForm from "src/sections/metamodel/MetaModelInstanceForm";

// ----------------------------------------------------------------------

MetaModelEditInstance.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function MetaModelEditInstance({
  initialInstance,
}: {
  initialInstance: InstanceMetaModel;
}) {
  const [instance, setInstance] = useState(initialInstance);

  useEffect(() => setInstance(initialInstance), [initialInstance]);

  return (
    <Page title={`${instance.unicode_representation}`}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Modelos", href: PATH_METAMODEL.models },
            {
              name: initialInstance.model.name,
              href: `${PATH_METAMODEL.models}/${initialInstance.model.id}`,
            },
            { name: instance.unicode_representation },
          ]}
        />
        <Card>
          <CardHeader title={instance.unicode_representation} />
          <CardContent>
            <MetaModelInstanceForm
              metaModel={instance.model}
              instanceModel={instance}
            />
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
      `${apiSettings.apiResourceEndpoints.metamodel_instance_models}${context.params?.id}/`
    );
    return {
      props: {
        initialInstance: metaModel,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
