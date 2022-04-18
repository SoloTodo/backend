import { ReactElement } from "react";
import { Card, CardContent, CardHeader, Container, Grid } from "@mui/material";
import { useAppSelector } from "src/store/hooks";
// layout
import Layout from "src/layouts";
// components
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ReactMarkdown from "react-markdown";
// sections
import CarouselBasic from "src/sections/mui/CarouselBasic";
import AssociateIntoformation from "src/sections/entities/AssociateInformation";
import AssociateForm from "src/sections/entities/AssociateForm";
// types
import { Entity } from "src/frontend-utils/types/entity";
import { GetServerSideProps } from "next/types";
// paths
import { apiSettings } from "src/frontend-utils/settings";
import { PATH_DASHBOARD, PATH_ENTITY } from "src/routes/paths";
// utils
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";

// ----------------------------------------------------------------------

EntityAssociate.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

type EntityAssociateProps = {
  entity: Entity;
};

export default function EntityAssociate(props: EntityAssociateProps) {
  const { entity } = props;
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  return (
    <Page title={entity.name}>
      <Container>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Entidades", href: PATH_ENTITY.root },
            { name: entity.name, href: `${PATH_ENTITY.root}/${entity.id}` },
            { name: "Asociar" },
          ]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AssociateIntoformation
              entity={entity}
              apiResourceObjects={apiResourceObjects}
            />
          </Grid>
          <Grid item xs={12}>
            <AssociateForm entity={entity} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Descripción" />
              <CardContent>
                <ReactMarkdown>
                  {typeof entity.description !== "undefined"
                    ? entity.description
                    : ""}
                </ReactMarkdown>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Fotografías" />
              <CardContent>
                <CarouselBasic images={entity.picture_urls} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let entity = {};
  if (context.params) {
    entity = await jwtFetch(
      context,
      `${apiSettings.apiResourceEndpoints.entities}${context.params.id}/`
    );
  }
  return {
    props: {
      entity: entity,
    },
  };
};
