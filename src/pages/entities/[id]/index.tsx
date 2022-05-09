import { ReactElement, useState } from "react";
import { GetServerSideProps } from "next/types";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import Layout from "src/layouts";
// utils
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
// hooks
import { useAppSelector } from "src/store/hooks";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
// paths
import { apiSettings } from "src/frontend-utils/settings";
import { PATH_DASHBOARD, PATH_ENTITY } from "src/routes/paths";
// components
import Page from "src/components/Page";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import CarouselBasic from "src/sections/mui/CarouselBasic";
import Options from "src/sections/Options";
import GeneralInformation from "src/sections/entities/GeneralInformation";
import PricingInformation from "src/sections/entities/PricingInformation";
import PositionInformation from "src/sections/entities/PositionInformation";
import StaffInformation from "src/sections/entities/StaffInformation";
import ReactMarkdown from "react-markdown";
// types
import { Entity } from "src/frontend-utils/types/entity";
import { Option } from "src/frontend-utils/types/extras";
import { User } from "src/frontend-utils/types/user";
import { Category, Store } from "src/frontend-utils/types/store";

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
  const { enqueueSnackbar } = useSnackbar();
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const hasStaffPermission = (
    apiResourceObjects[entity.category] as Category
  ).permissions.includes("is_category_staff");
  const baseRoute = `${PATH_ENTITY.root}/${entity.id}`;

  const options: Option[] = [
    {
      key: 1,
      text: "Eventos",
      path: `${baseRoute}/events`,
    },
    {
      key: 2,
      text: "Historial pricing",
      path: `${baseRoute}/pricing_history`,
    },
  ];

  if (hasStaffPermission)
    options.push({
      key: 3,
      text: "Asociar",
      path: `${baseRoute}/associate`,
    });

  const handleUpdatePricing = () => {
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.entities}${entity.id}/update_pricing/`,
      {
        method: "POST",
      }
    )
      .then((data) => {
        setEntity(data);
        enqueueSnackbar(
          "La información de pricing ha sido actualizada y debiera mostrarse en los paneles inferiores. Si está incorrecta por favor contacte a nuestro staff",
          { persist: true }
        );
      })
      .catch((err) => {
        enqueueSnackbar(
          "Error al ejecutar la petición, por favor intente de nuevo",
          { variant: "error" }
        );
        console.log(err);
      });
  };

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
            <Stack spacing={2}>
              <Options options={options} />
              <Card>
                <CardHeader title="Actualizar información" />
                <CardContent>
                  <Stack spacing={2}>
                    <Typography>
                      Obtiene la información actualizada de la entidad desde el
                      sitio de la tienda
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={handleUpdatePricing}
                      disabled={
                        !(
                          hasStaffPermission ||
                          (
                            apiResourceObjects[entity.store] as Store
                          ).permissions.includes("update_store_pricing") ||
                          (
                            apiResourceObjects[entity.category] as Category
                          ).permissions.includes(
                            "update_category_entities_pricing"
                          )
                        )
                      }
                    >
                      Actualizar información
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <GeneralInformation entity={entity as unknown as Entity} />
          </Grid>
          <Grid item xs={12} md={6}>
            <PricingInformation
              entity={entity as unknown as Entity}
              setEntity={setEntity}
            />
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
  let entity = {};
  if (context.params) {
    try {
      entity = await jwtFetch(
        context,
        `${apiSettings.apiResourceEndpoints.entities}${context.params.id}/`
      );
    } catch {
      return {
        notFound: true,
      };
    }
  }
  return {
    props: {
      entity: entity,
      users: users,
    },
  };
};
