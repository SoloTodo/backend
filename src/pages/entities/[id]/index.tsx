import { ReactElement } from "react";
import NextLink from "next/link";
import { apiSettings } from "src/frontend-utils/settings";
import Layout from "src/layouts";
import { wrapper } from "src/store/store";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { Entity } from "src/frontend-utils/types/store";
import Page from "src/components/Page";
import { Button, Container, Grid, Link } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import { PATH_DASHBOARD, PATH_ENTITY, PATH_STORE } from "src/routes/paths";
import Options from "src/sections/stores/Options";
import { Detail, Option } from "src/frontend-utils/types/extras";
import { useRouter } from "next/router";
import { fDateTimeSuffix } from "src/utils/formatTime";
import Details from "src/sections/stores/Details";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
// currency
import currency from "currency.js";
import { Currency } from "src/frontend-utils/redux/api_resources/types";

// ----------------------------------------------------------------------

EntityPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

type EntityProps = {
  entity: Entity;
  apiResourceObjects: any;
  stock: { stock: number };
};

// ----------------------------------------------------------------------

const conditions: any = {
  "https://schema.org/NewCondition": "Nuevo",
};

export default function EntityPage(props: EntityProps) {
  const { entity, apiResourceObjects, stock } = props;
  const router = useRouter();
  const baseRoute = `${PATH_ENTITY.root}/${router.query.id}`;

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
      renderData: (entity: Entity) => entity.product.url,
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
      renderData: (_entity: Entity) => stock.stock,
    },
    {
      key: "last_pricing_update",
      label: "Última actualización",
      renderData: (entity: Entity) => fDateTimeSuffix(entity.last_pricing_update),
    },
  ];

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
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}></Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Options options={options} />
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
        </Grid>
      </Container>
    </Page>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (st) => async (context) => {
    const apiResourceObjects = st.getState().apiResourceObjects;

    let entity: any = {};
    let stock = { stock: 0 };
    if (context.params) {
      entity = await jwtFetch(
        context,
        `${apiSettings.apiResourceEndpoints.entities}${context.params.id}/`
      );
      if (entity.active_registry) {
        stock = await jwtFetch(
          context,
          `${apiSettings.apiResourceEndpoints.entity_histories}${entity.active_registry.id}/stock/`
        );
      }
    }
    return {
      props: {
        entity: entity,
        apiResourceObjects: apiResourceObjects,
        stock: stock,
      },
    };
  }
);
