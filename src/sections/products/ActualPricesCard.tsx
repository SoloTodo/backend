import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Link,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";
import NextLink from "next/link";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { Entity } from "src/frontend-utils/types/entity";
import { PATH_ENTITY } from "src/routes/paths";
import { useAppSelector } from "src/store/hooks";
import LinkIcon from "@mui/icons-material/Link";
// currency
import currency from "currency.js";
import { Currency } from "src/frontend-utils/redux/api_resources/types";
import { useState } from "react";
import { apiSettings } from "src/frontend-utils/settings";
import { Store } from "src/frontend-utils/types/store";
import SortingSelecting from "../sorting-selecting";
import { TableHead } from "../sorting-selecting/SortingSelectingHead";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function ActualPricesCard({
  entities,
  loading,
}: {
  entities: Entity[];
  loading: boolean;
}) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const active_entities = entities.filter(
    (entity) => entity.active_registry && entity.active_registry.is_available
  );

  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const columns: TableHead[] = [
    {
      label: "Tienda",
      id: "store",
      renderSort: (row: Entity) => apiResourceObjects[row.store].name,
      renderCell: (row: {
        store: string | number;
        external_url: string | undefined;
        id: number;
      }) => (
        <Stack alignItems={"center"}>
          <NextLink href={`${PATH_ENTITY.root}/${row.id}`} passHref>
            <Link>{apiResourceObjects[row.store].name}</Link>
          </NextLink>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={row.external_url}
          >
            <LinkIcon />
          </Link>
        </Stack>
      ),
    },
    {
      label: "Precio normal",
      id: "active_registry.normal_price",
      renderSort: (row: Entity) =>
        row.active_registry && currency(row.active_registry.normal_price).value,
      renderCell: (row: { active_registry: { normal_price: currency.Any } }) =>
        currency(row.active_registry.normal_price, {
          precision: 0,
        }).format(),
    },
    {
      label: "Precio oferta",
      id: "active_registry.offer_price",
      renderSort: (row: Entity) =>
        row.active_registry && currency(row.active_registry.offer_price).value,
      renderCell: (row: { active_registry: { offer_price: currency.Any } }) =>
        currency(row.active_registry.offer_price, {
          precision: 0,
        }).format(),
    },
    {
      label: "Precio normal (USD)",
      id: "normal_price_usd",
      sortField: "active_registry.normal_price",
      renderSort: (row: Entity) =>
        row.active_registry && currency(row.active_registry.normal_price).value,
      renderCell: (row: {
        active_registry: { normal_price: currency.Any };
        currency: string | number;
      }) =>
        currency(row.active_registry.normal_price)
          .divide((apiResourceObjects[row.currency] as Currency).exchange_rate)
          .format(),
    },
    {
      label: "Precio oferta (USD)",
      id: "offer_price_usd",
      sortField: "active_registry.offer_price",
      renderSort: (row: Entity) =>
        row.active_registry && currency(row.active_registry.offer_price).value,
      renderCell: (row: {
        active_registry: { offer_price: currency.Any };
        currency: string | number;
      }) =>
        currency(row.active_registry.offer_price)
          .divide((apiResourceObjects[row.currency] as Currency).exchange_rate)
          .format(),
    },
  ];

  const retail_and_wholesaler_entities = [];
  const mobile_network_operators_entities: { [key: string]: any[] } = {};

  for (const entity of active_entities) {
    const store = apiResourceObjects[entity.store] as Store;
    if (
      apiResourceObjects[store.type].id === apiSettings.mobileNetworkOperatorId
    ) {
      if (typeof mobile_network_operators_entities[store.url] === "undefined") {
        mobile_network_operators_entities[store.url] = [];
      }

      mobile_network_operators_entities[store.url].push(entity);
    } else {
      retail_and_wholesaler_entities.push(entity);
    }
  }

  const columnsRetail: TableHead[] = [
    ...columns.slice(0, 1),
    {
      label: "Plan celular",
      id: "cell_plan.name",
      renderSort: (row: Entity) => (row.cell_plan ? row.cell_plan.name : "N/A"),
      renderCell: (row: { cell_plan: { name: string | undefined } }) =>
        row.cell_plan ? row.cell_plan.name : "N/A",
    },
    ...columns.slice(1),
  ];

  const columnsStores: TableHead[] = [
    ...columnsRetail.slice(0, 4),
    {
      label: "Cuota mensual",
      id: "active_registry.cell_monthly_payment",
      renderSort: (row: Entity) =>
        row.active_registry &&
        row.active_registry.cell_monthly_payment !== null &&
        currency(row.active_registry.cell_monthly_payment).value,
      renderCell: (row: {
        active_registry: { cell_monthly_payment: currency.Any };
      }) =>
        currency(row.active_registry.cell_monthly_payment, {
          precision: 0,
        }).format(),
    },
    ...columnsRetail.slice(4),
    {
      label: "Cuota mensual (USD)",
      id: "cell_plan.id",
      sortField: "active_registry.cell_monthly_payment",
      renderSort: (row: Entity) =>
        row.active_registry &&
        row.active_registry.cell_monthly_payment !== null &&
        currency(row.active_registry.cell_monthly_payment).value,
      renderCell: (row: {
        active_registry: { cell_monthly_payment: currency.Any };
        currency: string | number;
      }) =>
        currency(row.active_registry.cell_monthly_payment)
          .divide((apiResourceObjects[row.currency] as Currency).exchange_rate)
          .format(),
    },
  ];

  return (
    <Card>
      <CardHeader title="Precios actuales" />

      {loading ? (
        <CardContent style={{ textAlign: "center" }}>
          <CircularProgress color="inherit" />
        </CardContent>
      ) : (
        <CardContent>
          {Object.keys(mobile_network_operators_entities).length !== 0 ? (
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs current price"
                >
                  <Tab label="Retail" {...a11yProps(0)} />
                  {Object.keys(mobile_network_operators_entities).map(
                    (storeUrl, index) => (
                      <Tab
                        key={storeUrl}
                        label={apiResourceObjects[storeUrl].name}
                        {...a11yProps(index + 1)}
                      />
                    )
                  )}
                </Tabs>
              </Box>
              <br />
              <TabPanel value={value} index={0}>
                <SortingSelecting
                  TABLE_HEAD={columnsRetail}
                  SORTING_SELECTING_TABLE={retail_and_wholesaler_entities}
                  initialOrder={"active_registry.offer_price"}
                />
              </TabPanel>
              {Object.keys(mobile_network_operators_entities).map(
                (storeUrl, index) => (
                  <TabPanel key={storeUrl} value={value} index={index + 1}>
                    <SortingSelecting
                      TABLE_HEAD={columnsStores}
                      SORTING_SELECTING_TABLE={
                        mobile_network_operators_entities[storeUrl]
                      }
                      initialOrder={"active_registry.offer_price"}
                      initialRenderSort={() => (row: Entity) =>
                        row.active_registry &&
                        parseInt(row.active_registry.offer_price)}
                    />
                  </TabPanel>
                )
              )}
            </Box>
          ) : (
            <SortingSelecting
              TABLE_HEAD={columns}
              SORTING_SELECTING_TABLE={active_entities}
              initialOrder={"active_registry.offer_price"}
              initialRenderSort={() => (row: Entity) =>
                row.active_registry &&
                parseInt(row.active_registry.offer_price)}
            />
          )}
        </CardContent>
      )}
    </Card>
  );
}
