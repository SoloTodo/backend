import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Link,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NextLink from "next/link";
import { ReactElement, useState } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import Layout from "src/layouts";
import {
  PATH_ALERT,
  PATH_DASHBOARD,
  PATH_PRODUCT,
  PATH_STORE,
} from "src/routes/paths";
import Details from "src/sections/Details";
import { Detail } from "src/frontend-utils/types/extras";
import { fDateTimeSuffix } from "src/utils/formatTime";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { GetServerSideProps } from "next/types";
import { Alert } from "src/frontend-utils/types/alert";
import { apiSettings } from "src/frontend-utils/settings";
import Options from "src/sections/Options";
import { Option } from "src/frontend-utils/types/extras";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";

// ----------------------------------------------------------------------

AlertPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

// ----------------------------------------------------------------------

export default function AlertPage(props: { alert: Alert }) {
  const { alert } = props;
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const details: Detail[] = [
    {
      key: "product",
      label: "Producto",
      renderData: (alert: Alert) => (
        <NextLink href={`${PATH_PRODUCT.root}/${alert.product.id}`} passHref>
          <Link>{alert.product.name}</Link>
        </NextLink>
      ),
    },
    {
      key: "stores",
      label: "Tiendas",
      renderData: (alert: Alert) =>
        alert.stores.reduce((acc, a) => {
          if (acc === "") {
            return apiResourceObjects[a].name;
          }
          return acc + " / " + apiResourceObjects[a].name;
        }, ""),
    },
    {
      key: "creation_date",
      label: "Fecha creación",
      renderData: (alert: Alert) => fDateTimeSuffix(alert.creation_date),
    },
  ];

  const options: Option[] = [
    {
      key: 1,
      text: "Eliminar",
      path: "",
      renderObject: (
        <Button variant="contained" color="error" onClick={() => setOpen(true)}>
          Eliminar
        </Button>
      ),
    },
  ];

  const handleDelete = () => {
    setLoading(true);
    jwtFetch(null, `${apiSettings.apiResourceEndpoints.alerts}${alert.id}/`, {
      method: "delete",
    }).then((res) => {
      enqueueSnackbar("Comparación eliminada", {
        variant: "success",
      });
      router.push(PATH_ALERT.root);
    });
  };

  return (
    <Page title={`${alert.id}`}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Tiendas", href: PATH_STORE.root },
            { name: `${alert.id}` },
          ]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <Details
              title={alert.product.name}
              data={alert}
              details={details}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Options options={options} />
          </Grid>
        </Grid>
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box sx={style}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h5">Eliminar alerta: {alert.id}</Typography>
              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Stack>
            <br />
            <Typography>
              ¿Estás seguro que quieres eliminar esta alerta? Este proceso es
              irreversible
            </Typography>
            <br />
            <Stack spacing={1} direction="row">
              <LoadingButton
                onClick={handleDelete}
                color="error"
                variant="contained"
                loading={loading}
              >
                Eliminar
              </LoadingButton>
              <Button
                color="inherit"
                variant="outlined"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
            </Stack>
          </Box>
        </Modal>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const alert = await jwtFetch(
      context,
      `${apiSettings.apiResourceEndpoints.alerts}${context.params?.id}/`
    );
    return {
      props: {
        alert: alert,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
