import { ReactElement, useEffect, useState } from "react";
import NextLink from "next/link";
import { apiSettings } from "src/frontend-utils/settings";
import Layout from "src/layouts";
import { wrapper } from "src/store/store";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { Entity, StaffInfo } from "src/frontend-utils/types/store";
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
import {
  PATH_DASHBOARD,
  PATH_ENTITY,
  PATH_PRODUCT,
  PATH_STORE,
} from "src/routes/paths";
import Options from "src/sections/Options";
import { Detail, Option } from "src/frontend-utils/types/extras";
import { useRouter } from "next/router";
import { fDateTimeSuffix } from "src/utils/formatTime";
import Details from "src/sections/Details";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
// currency
import currency from "currency.js";
import { Currency } from "src/frontend-utils/redux/api_resources/types";
import CarouselBasic from "src/sections/mui/CarouselBasic";
import { useSnackbar } from "notistack";
import BasicTable from "src/sections/BasicTable";
import { GridColDef } from "@mui/x-data-grid";
import { selectApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";

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

const conditions: any = {
  "https://schema.org/NewCondition": "Nuevo",
};

export default function EntityPage(props: EntityProps) {
  const { apiResourceObjects, users } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setLoading] = useState(true);
  const [entity, setEntity] = useState({
    name: "",
    picture_urls: [],
    description: "",
  });
  const [staffInfo, setStaffInfo] = useState({});
  const [stock, setStock] = useState(0);
  const [positions, setPositions] = useState([]);
  const router = useRouter();
  const baseRoute = `${PATH_ENTITY.root}/${router.query.id}`;

  const userDict = users.reduce(
    (acc: { [x: string]: any }, a: { url: string }) => {
      acc[a.url] = a;
      return acc;
    },
    {}
  );

  const categories = selectApiResourceObjects(apiResourceObjects, "categories");

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
    {
      key: 3,
      text: "Asociar",
      path: `${baseRoute}/associate`,
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

  const generalDietails: Detail[] = [
    {
      key: "name",
      label: "Nombre",
    },
    {
      key: "cell_plan_name",
      label: "Nombre plan celular",
      renderData: (entity: Entity) =>
        entity.cell_plan_name ? entity.cell_plan_name : "N/A",
    },
    {
      key: "store",
      label: "Tienda",
      renderData: (entity: Entity) => (
        <NextLink
          href={`${PATH_STORE.root}/${apiResourceObjects[entity.store].id}`}
          passHref
        >
          <Link>{apiResourceObjects[entity.store].name}</Link>
        </NextLink>
      ),
    },
    {
      key: "seller",
      label: "Vendedor",
      renderData: (entity: Entity) => (entity.seller ? entity.seller : "N/A"),
    },
    {
      key: "external_url",
      label: "URL",
      renderData: (entity: Entity) => (
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={entity.external_url}
        >
          {entity.external_url}
        </Link>
      ),
    },
    {
      key: "cateogry",
      label: "Categoría",
      renderData: (entity: Entity) => apiResourceObjects[entity.category].name,
    },
    {
      key: "condition",
      label: "Condición",
      renderData: (entity: Entity) => conditions[entity.condition],
    },
    {
      key: "scraped_condition",
      label: "Condición Original",
      renderData: (entity: Entity) => conditions[entity.scraped_condition],
    },
    {
      key: "part_number",
      label: "Part Number",
      renderData: (entity: Entity) =>
        entity.part_number ? entity.part_number : "N/A",
    },
    {
      key: "sku",
      label: "SKU",
      renderData: (entity: Entity) => (entity.sku ? entity.sku : "N/A"),
    },
    {
      key: "ean",
      label: "EAN",
      renderData: (entity: Entity) => (entity.ean ? entity.ean : "N/A"),
    },
    {
      key: "creation_date",
      label: "Fecha de detección",
      renderData: (entity: Entity) => fDateTimeSuffix(entity.creation_date),
    },
    {
      key: "is_visible",
      label: "¿Visible?",
      renderData: (entity: Entity) =>
        entity.is_visible ? <CheckIcon /> : <ClearIcon />,
    },
  ];

  const pricingDetails: Detail[] = [
    {
      key: "product_url",
      label: "Producto",
      renderData: (entity: Entity) => (
        entity.product ? <NextLink href={`${PATH_PRODUCT.root}/${entity.product.id}`} passHref>
          <Link>{entity.product.name}</Link>
        </NextLink> : null
      ),
    },
    {
      key: "disociar",
      label: "",
      renderData: (entity: Entity) => (
        <Button variant="contained" color="error">
          Disociar
        </Button>
      ),
    },
    {
      key: "cell_plan",
      label: "Plan celular",
      renderData: (entity: Entity) =>
        entity.cell_plan ? entity.cell_plan : "N/A",
    },
    {
      key: "bundle",
      label: "Bundle",
      renderData: (entity: Entity) => (entity.bundle ? entity.bundle : "N/A"),
    },
    {
      key: "normal_price",
      label: "Precio normal",
      renderData: (entity: Entity) =>
        entity.active_registry
          ? currency(entity.active_registry.normal_price, {
              precision: 0,
            }).format()
          : "$0",
    },
    {
      key: "offer_price",
      label: "Precio oferta",
      renderData: (entity: Entity) =>
        entity.active_registry
          ? currency(entity.active_registry.offer_price, {
              precision: 0,
            }).format()
          : "$0",
    },
    {
      key: "normal_price_usd",
      label: "Precio normal (USD)",
      renderData: (entity: Entity) =>
        entity.active_registry
          ? currency(entity.active_registry.normal_price)
              .divide(
                (apiResourceObjects[entity.currency] as Currency).exchange_rate
              )
              .format()
          : "$0",
    },
    {
      key: "offer_price_usd",
      label: "Precio oferta (USD)",
      renderData: (entity: Entity) =>
        entity.active_registry
          ? currency(entity.active_registry.offer_price)
              .divide(
                (apiResourceObjects[entity.currency] as Currency).exchange_rate
              )
              .format()
          : "$0",
    },
    {
      key: "active_registry.is_active",
      label: "¿Activa?",
      renderData: (entity: Entity) =>
        entity.active_registry ? <CheckIcon /> : <ClearIcon />,
    },
    {
      key: "is_available",
      label: "¿Disponible?",
      renderData: (entity: Entity) =>
        entity.active_registry && entity.active_registry.is_available ? (
          <CheckIcon />
        ) : (
          <ClearIcon />
        ),
    },
    {
      key: "stock",
      label: "Stock",
      renderData: (_entity: Entity) => stock,
    },
    {
      key: "last_pricing_update",
      label: "Última actualización",
      renderData: (entity: Entity) =>
        fDateTimeSuffix(entity.last_pricing_update),
    },
  ];

  const staffDetails: Detail[] = [
    {
      key: "key",
      label: "Llave",
    },
    {
      key: "scraped_category",
      label: "Categoría original",
      renderData: (entityPlus: any) =>
        apiResourceObjects[entityPlus.scraped_category].name,
    },
    {
      key: "discovery_url",
      label: "URL",
      renderData: (entityPlus: any) => (
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
      renderData: (entityPlus: any) => {
        if (userDict[entityPlus.last_association_user]) {
          return `${fDateTimeSuffix(entityPlus.last_association)} (${
            userDict[entityPlus.last_association_user].first_name
          } ${userDict[entityPlus.last_association_user].last_name})`;
        } else {
          return `${fDateTimeSuffix(entityPlus.last_association)}`;
        }
      },
    },
    {
      key: "last_staff_access",
      label: "Último acceso",
      renderData: (entityPlus: any) => {
        if (userDict[entityPlus.last_staff_access_user]) {
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
      renderCell: (params) => params.row.section.name
    },
    {
      headerName: "Posición",
      field: "value",
      flex: 1,
    },
  ]

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
      `${apiSettings.apiResourceEndpoints.entity_histories}${router.query.id}/stock/`
    ).then((data) => {
      setStock(data.stock);
    });
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.entities}${router.query.id}/`
    ).then((data) => {
      setEntity(data);
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
      <Container>
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
                      <Button variant="contained" onClick={handleUpdatePricing}>
                        Actualizar información
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Details
                title="Información general"
                data={entity}
                details={generalDietails}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Details
                title="Información pricing"
                data={entity}
                details={pricingDetails}
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
                <CardContent>{entity.description}</CardContent>
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
