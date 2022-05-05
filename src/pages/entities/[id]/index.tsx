import { ReactElement, useEffect, useState } from "react";
import { apiSettings } from "src/frontend-utils/settings";
import Layout from "src/layouts";
import { wrapper } from "src/store/store";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { Entity, StaffInfo } from "src/frontend-utils/types/entity";
import Page from "src/components/Page";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import { PATH_DASHBOARD, PATH_ENTITY } from "src/routes/paths";
import Options from "src/sections/Options";
import { Detail, Option } from "src/frontend-utils/types/extras";
import { useRouter } from "next/router";
import { fDateTimeSuffix } from "src/utils/formatTime";
import Details from "src/sections/Details";
import CarouselBasic from "src/sections/mui/CarouselBasic";
import { useSnackbar } from "notistack";
import BasicTable from "src/sections/BasicTable";
import { GridColDef } from "@mui/x-data-grid";
import GeneralInformation from "src/sections/entities/GeneralInformation";
import ReactMarkdown from "react-markdown";
import PricingInformation from "src/sections/entities/PricingInformation";

// ----------------------------------------------------------------------

EntityPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

type EntityProps = {
  apiResourceObjects: any;
  users: any;
};

// ----------------------------------------------------------------------

export default function EntityPage(props: EntityProps) {
  const { apiResourceObjects, users } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setLoading] = useState(true);
  const [entity, setEntity] = useState({
    name: "",
    picture_urls: [],
    description: "",
    store: "",
    category: "",
  });
  const [staffInfo, setStaffInfo] = useState({});
  const [positions, setPositions] = useState([]);
  const [hasStaffPermission, setHasStaffPermission] = useState(false);
  const router = useRouter();
  const baseRoute = `${PATH_ENTITY.root}/${router.query.id}`;

  const userDict = users.reduce(
    (acc: { [x: string]: any }, a: { url: string }) => {
      acc[a.url] = a;
      return acc;
    },
    {}
  );

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
    // {
    //   key: 4,
    //   text: "Leads (listado)",
    //   path: `${baseRoute}`,
    // },
    // {
    //   key: 5,
    //   text: "Leads (estadísticas)",
    //   path: `${baseRoute}`,
    // },
    // {
    //   key: 6,
    //   text: "Ventas estimadas",
    //   path: `${baseRoute}`,
    // },
  ];

  if (hasStaffPermission)
    options.push({
      key: 3,
      text: "Asociar",
      path: `${baseRoute}/associate`,
    });

  const staffDetails: Detail[] = [
    {
      key: "key",
      label: "Llave",
    },
    {
      key: "scraped_category",
      label: "Categoría original",
      renderData: (entityPlus: Entity & StaffInfo) =>
        apiResourceObjects[entityPlus.scraped_category].name,
    },
    {
      key: "discovery_url",
      label: "URL",
      renderData: (entityPlus: Entity & StaffInfo) => (
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={entityPlus.discovery_url}
        >
          {entityPlus.discovery_url}
        </Link>
      ),
    },
    {
      key: "last_association",
      label: "Última asociación",
      renderData: (entityPlus: Entity & StaffInfo) => {
        if (
          entityPlus.last_association !== null &&
          entityPlus.last_association_user !== null
        ) {
          return `${fDateTimeSuffix(entityPlus.last_association)} (${
            userDict[entityPlus.last_association_user].first_name
          } ${userDict[entityPlus.last_association_user].last_name})`;
        } else {
          return;
        }
      },
    },
    {
      key: "last_staff_access",
      label: "Último acceso",
      renderData: (entityPlus: Entity & StaffInfo) => {
        if (
          entityPlus.last_staff_access !== null &&
          entityPlus.last_staff_access_user !== null
        ) {
          return `${fDateTimeSuffix(entityPlus.last_staff_access)} (${
            userDict[entityPlus.last_staff_access_user].first_name
          } ${userDict[entityPlus.last_staff_access_user].last_name})`;
        } else {
          return;
        }
      },
    },
  ];

  const positionsColumns: GridColDef[] = [
    {
      headerName: "Sección",
      field: "section",
      flex: 1,
      renderCell: (params) => params.row.section.name,
    },
    {
      headerName: "Posición",
      field: "value",
      // flex: 1,
    },
  ];

  useEffect(() => {
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.entities}${router.query.id}/staff_info/`
    )
      .then((data) => {
        setStaffInfo(data);
      })
      .catch((err) => console.log(err));
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.entities}${router.query.id}/`
    ).then((data) => {
      setEntity(data);
      setHasStaffPermission(
        apiResourceObjects[data.category].permissions.includes(
          "is_category_staff"
        )
      );
      setLoading(false);
    });
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.entity_section_positions}?entities=${router.query.id}&is_active=1`
    ).then((data) => {
      setPositions(data.results);
    });
  }, []);

  const handleUpdatePricing = () => {
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.entities}${router.query.id}/update_pricing/`,
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
        {!isLoading ? (
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
                        Obtiene la información actualizada de la entidad desde
                        el sitio de la tienda
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={handleUpdatePricing}
                        disabled={
                          hasStaffPermission ||
                          apiResourceObjects[entity.store].permissions.includes(
                            "update_store_pricing"
                          ) ||
                          apiResourceObjects[
                            entity.category
                          ].permissions.includes(
                            "update_category_entities_pricing"
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
              <GeneralInformation
                entity={entity as unknown as Entity}
                apiResourceObjects={apiResourceObjects}
                hasStaffPermission={hasStaffPermission}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <PricingInformation
                entity={entity as unknown as Entity}
                apiResourceObjects={apiResourceObjects}
                setEntity={setEntity}
                hasStaffPermission={hasStaffPermission}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <BasicTable
                title="Posicionamiento actual"
                columns={positionsColumns}
                data={positions}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Details
                title="Información staff"
                data={
                  Object.keys(staffInfo).length !== 0 &&
                  Object.keys(entity).length !== 0
                    ? { ...entity, ...staffInfo }
                    : {}
                }
                details={staffDetails}
              />
            </Grid>
            <Grid item xs={24}>
              <Card>
                <CardHeader title="Descripción" />
                <CardContent>
                  <ReactMarkdown>{entity.description}</ReactMarkdown>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <p>Loading...</p>
        )}
      </Container>
    </Page>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (st) => async (context) => {
    const apiResourceObjects = st.getState().apiResourceObjects;

    const users = await jwtFetch(
      context,
      apiSettings.apiResourceEndpoints.users_with_staff_actions
    );
    return {
      props: {
        apiResourceObjects: apiResourceObjects,
        users: users,
      },
    };
  }
);
