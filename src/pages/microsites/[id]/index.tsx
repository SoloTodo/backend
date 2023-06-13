import NextLink from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Link,
  ListItem,
  ListItemText,
} from "@mui/material";
import { GetServerSideProps } from "next/types";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { PATH_DASHBOARD, PATH_MICROSITE } from "src/routes/paths";
import { ReactElement } from "react";
import Layout from "src/layouts";
import { Microsite } from "src/frontend-utils/types/microsite";

// ----------------------------------------------------------------------

MicrositeDetail.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function MicrositeDetail({ microsite }: { microsite: Microsite }) {
  return (
    <Page title={microsite.name}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Sitios", href: PATH_MICROSITE.root },
            { name: microsite.name },
          ]}
        />
        <Card>
          <CardHeader title={microsite.name} />
          <CardContent>
            <ListItem>
              <ListItemText
                primary={
                  <NextLink
                    href={`${PATH_MICROSITE.root}/${microsite.id}/product_entries`}
                    passHref
                  >
                    <Link>Gestionar Prouctos</Link>
                  </NextLink>
                }
              />
            </ListItem>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const microsite = await jwtFetch(
    context,
    `${apiSettings.apiResourceEndpoints.microsite_brands}${context.params?.id}`
  );
  return {
    props: {
      microsite: microsite,
    },
  };
};
