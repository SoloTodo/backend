import { ReactElement, useState } from "react";
import { GetServerSideProps } from "next/types";
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
} from "@mui/material";
import Layout from "src/layouts";
// utils
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
// paths
import { apiSettings } from "src/frontend-utils/settings";
import { PATH_DASHBOARD, PATH_ENTITY } from "src/routes/paths";
// components
import Page from "src/components/Page";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import CarouselBasic from "src/sections/mui/CarouselBasic";
import GeneralInformation from "src/sections/entities/GeneralInformation";
import PricingInformation from "src/sections/entities/PricingInformation";
import PositionInformation from "src/sections/entities/PositionInformation";
import StaffInformation from "src/sections/entities/StaffInformation";
import ReactMarkdown from "react-markdown";
// types
import { Entity } from "src/frontend-utils/types/entity";
import { User } from "src/frontend-utils/types/user";
import UpdatePricingInformation from "src/sections/entities/UpdatePricingInformation";

// ----------------------------------------------------------------------

EntityPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

type EntityProps = {
  entity: Entity;
  users: User[];
};

// ----------------------------------------------------------------------

export default function EntityPage(props: EntityProps) {
  const { users } = props;
  const [entity, setEntity] = useState<Entity>(props.entity);

  return (
    <Page title={entity.name}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Entidades", href: PATH_ENTITY.root },
            { name: entity.name },
          ]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <Card>
              <CardHeader title="Fotografías" />
              <CardContent>
                <CarouselBasic images={entity.picture_urls} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <UpdatePricingInformation entity={entity} setEntity={setEntity} />
          </Grid>
          <Grid item xs={12} md={6}>
            <GeneralInformation entity={entity} />
          </Grid>
          <Grid item xs={12} md={6}>
            <PricingInformation entity={entity} setEntity={setEntity} />
          </Grid>
          <Grid item xs={12} md={6}>
            <PositionInformation entityId={entity.id} />
          </Grid>
          <Grid item xs={12} md={6}>
            <StaffInformation entity={entity} users={users} />
          </Grid>
          <Grid item xs={24}>
            <Card>
              <CardHeader title="Descripción" />
              <CardContent>
                <ReactMarkdown>
                  {entity.description ? entity.description : ""}
                </ReactMarkdown>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const users = await jwtFetch(
    context,
    apiSettings.apiResourceEndpoints.users_with_staff_actions
  );
  try {
    const entity = await jwtFetch(
      context,
      `${apiSettings.apiResourceEndpoints.entities}${context.params?.id}/`
    );
    return {
      props: {
        entity: entity,
        users: users,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
