import { ReactElement, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, Container, Grid } from "@mui/material";
// layout
import Layout from "src/layouts";
// components
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ReactMarkdown from "react-markdown";
// sections
import AssociateInformation from "src/sections/entities/AssociateInformation";
import AssociateForm from "src/sections/entities/AssociateForm";
// types
import { Entity } from "src/frontend-utils/types/entity";
import { GetServerSideProps } from "next/types";
// paths
import { apiSettings } from "src/frontend-utils/settings";
import { PATH_DASHBOARD, PATH_ENTITY } from "src/routes/paths";
// utils
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { differenceInMilliseconds, millisecondsToMinutes } from "date-fns";
import { useSnackbar } from "notistack";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { useUser } from "src/frontend-utils/redux/user";
import { useRouter } from "next/router";
import ImageGallery from "react-image-gallery";

// ----------------------------------------------------------------------

EntityAssociate.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

type EntityAssociateProps = {
  entity: Entity;
};

export default function EntityAssociate(props: EntityAssociateProps) {
  const { enqueueSnackbar } = useSnackbar();
  const user = useAppSelector(useUser);
  const router = useRouter();
  const [entity, setEntity] = useState(props.entity);

  useEffect(() => {
    if (!entity.is_visible) {
      enqueueSnackbar(
        "Esta entidad no está visible, así que no puede ser asociada. Márquela como visible si desea asociarla.",
        { persist: true, variant: "warning" }
      );
      router.push(`${PATH_ENTITY.root}/${entity.id}`);
      return;
    }
    const myAbortController = new AbortController();
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.entities}${entity.id}/staff_info/`,
      { signal: myAbortController.signal }
    )
      .then((data) => {
        let registerStaffAccess = false;

        if (data.last_staff_access) {
          const durationSinceLastStaffAccess = differenceInMilliseconds(
            new Date(),
            new Date(data.last_staff_access)
          );
          if (millisecondsToMinutes(durationSinceLastStaffAccess) < 10) {
            if (data.last_staff_access_user?.id !== user?.id) {
              enqueueSnackbar(
                "Alguien ha estado trabajando en esta entidad hace poco. ¡Cuidado!",
                { persist: true, variant: "warning" }
              );
            }
          } else {
            registerStaffAccess = true;
          }
        } else {
          registerStaffAccess = true;
        }

        if (registerStaffAccess) {
          jwtFetch(null, `${entity.url}register_staff_access/`, {
            method: "POST",
          }).then((json) => {
            setEntity(json);
          });
        }
      })
      .catch((_) => {});
    return () => {
      myAbortController.abort();
    };
  }, []);

  return (
    <Page title={`${entity.name} | Asociar`}>
      <Container maxWidth={false}>
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
            <AssociateInformation entity={entity} setEntity={setEntity} />
          </Grid>
          <Grid item xs={12}>
            <AssociateForm entity={entity} setEntity={setEntity} />
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
            {entity.picture_urls &&
            <Card>
              <CardHeader title="Fotografías" />
              <CardContent>
                <ImageGallery items={entity.picture_urls.map(url => {return {'original': url, 'thumbnail': url}})} />
              </CardContent>
            </Card>
            }
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
      `${apiSettings.apiResourceEndpoints.entities}${context.params?.id}/`
    );
    return {
      props: {
        entity: entity,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
