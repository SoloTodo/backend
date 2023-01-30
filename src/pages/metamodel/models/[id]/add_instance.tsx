import { Card, CardContent, CardHeader, Container } from "@mui/material";
import { ReactElement } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import AccessDenied from "src/components/my_components/AccessDenied";
import Page from "src/components/Page";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { MyNextPageContext } from "src/frontend-utils/redux/with-redux-store";
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

function MetaModelAddInstance({
  metaModel,
  statusCode,
}: {
  metaModel: MetaModel;
  statusCode?: number;
}) {
  return statusCode !== 404 ? (
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
  ) : (
    <AccessDenied />
  );
}

MetaModelAddInstance.getInitialProps = async (context: MyNextPageContext) => {
  const reduxStore = context.reduxStore;
  const user = reduxStore.getState().user;
  const metaModel = await jwtFetch(
    context,
    `${apiSettings.apiResourceEndpoints.metamodel_meta_models}${context.query?.id}/`
  );
  if (typeof user === "undefined" || !user.is_staff) {
    return {
      statusCode: 404,
    };
  } else {
    return {
      metaModel: metaModel,
    };
  }
};

export default MetaModelAddInstance;
