import { ReactElement, useState } from "react";
import { Card, CardContent, CardHeader, Container, Grid } from "@mui/material";
// layout
import Layout from "src/layouts";
// components
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
// sections
import CarouselBasic from "src/sections/mui/CarouselBasic";
import AssociateInformation from "src/sections/wtb/AssociateInformation";
import AssociateForm from "src/sections/wtb/AssociateForm";
// types
import { GetServerSideProps } from "next/types";
// paths
import { apiSettings } from "src/frontend-utils/settings";
import { PATH_DASHBOARD, PATH_WTB } from "src/routes/paths";
// utils
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { Brand, WtbEntity } from "src/frontend-utils/types/wtb";

// ----------------------------------------------------------------------

EntityAssociate.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

type EntityAssociateProps = {
  entity: WtbEntity;
  brand: Brand;
};

export default function EntityAssociate(props: EntityAssociateProps) {
  const [entity, setEntity] = useState(props.entity);

  return (
    <Page title={`${entity.name} | Asociar`}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Donde Comprar", href: PATH_WTB.entities },
            { name: "Entidades", href: PATH_WTB.entities },
            { name: entity.name, href: `${PATH_WTB.entities}/${entity.id}` },
            { name: "Asociar" },
          ]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AssociateInformation entity={entity} setEntity={setEntity} brand={props.brand} />
          </Grid>
          <Grid item xs={12}>
            <AssociateForm entity={entity} setEntity={setEntity} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Fotografías" />
              <CardContent>
                <CarouselBasic images={[entity.picture_url]} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const entity = await jwtFetch(
      context,
      `${apiSettings.apiResourceEndpoints.wtb_entities}${context.params?.id}/`
    );
    const brand = await jwtFetch(context, (entity as WtbEntity).brand);
    return {
      props: {
        entity: entity,
        brand: brand,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
