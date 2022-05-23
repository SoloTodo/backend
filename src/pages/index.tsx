import { ReactElement } from "react";
import Layout from "src/layouts";
import Page from "src/components/Page";
import { Container, Typography } from "@mui/material";

// ----------------------------------------------------------------------

Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Index() {
  return (
    <Page title="Dashboard">
      <Container maxWidth={false}>
        <Typography variant="h3" component="h1" paragraph>
          Dashboard
        </Typography>
        <Typography gutterBottom>
          Bienvenidos al Dashboard. Puden usar la barra de navegación ubicada a
          la izquierda para consultar la información que necesiten.
        </Typography>
      </Container>
    </Page>
  );
}
