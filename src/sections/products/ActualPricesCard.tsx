import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Link,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";
import NextLink from "next/link";
import { DataGrid, GridColumns } from "@mui/x-data-grid";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { Entity } from "src/frontend-utils/types/entity";
import { PATH_ENTITY } from "src/routes/paths";
import { useAppSelector } from "src/store/hooks";
import LinkIcon from "@mui/icons-material/Link";
import CustomTable from "../CustomTable";
// currency
import currency from "currency.js";
import { Currency } from "src/frontend-utils/redux/api_resources/types";
import { useState } from "react";
import { apiSettings } from "src/frontend-utils/settings";
import { Store } from "src/frontend-utils/types/store";

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

export default function ActualPricesCard({ entities }: { entities: Entity[] }) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const active_entities = entities.filter(
    (entity) => entity.active_registry && entity.active_registry.is_available
  );

  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const columns: GridColumns<any> = [
    {
      headerName: "Tienda",
      field: "store",
      renderCell: (params) => (
        <Stack alignItems={"center"}>
          <NextLink
            href={`${PATH_ENTITY.root}/${
              apiResourceObjects[params.row.store].id
            }`}
            passHref
          >
            <Link>{apiResourceObjects[params.row.store].name}</Link>
          </NextLink>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={params.row.external_url}
          >
            <LinkIcon />
          </Link>
        </Stack>
      ),
    },
    {
      headerName: "Precio normal",
      field: "active_registry.normal_price",
      renderCell: (params) =>
        currency(params.row.active_registry.normal_price, {
          precision: 0,
        }).format(),
    },
    {
      headerName: "Precio oferta",
      field: "active_registry.offer_price",
      renderCell: (params) =>
        currency(params.row.active_registry.offer_price, {
          precision: 0,
        }).format(),
    },
    {
      headerName: "Precio normal (USD)",
      field: "id",
      renderCell: (params) =>
        currency(params.row.active_registry.normal_price)
          .divide(
            (apiResourceObjects[params.row.currency] as Currency).exchange_rate
          )
          .format(),
    },
    {
      headerName: "Precio oferta (USD)",
      field: "key",
      renderCell: (params) =>
        currency(params.row.active_registry.offer_price)
          .divide(
            (apiResourceObjects[params.row.currency] as Currency).exchange_rate
          )
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

  const columnsRetail: GridColumns<any> = [
    ...columns.slice(0, 1),
    {
      headerName: "Plan celular",
      field: "cell_plan.name",
      renderCell: (params) =>
        params.row.cell_plan ? params.row.cell_plan.name : "N/A",
    },
    ...columns.slice(1),
  ];

  const columnsStores: GridColumns<any> = [
    ...columnsRetail.slice(0, 4),
    {
      headerName: "Cuota mensual",
      field: "cell_monthly_payment",
      renderCell: (params) =>
        currency(params.row.active_registry.cell_monthly_payment, {
          precision: 0,
        }).format(),
    },
    ...columnsRetail.slice(4),
    {
      headerName: "Cuota mensual (USD)",
      field: "cell_plan.id",
      renderCell: (params) =>
        currency(params.row.active_registry.cell_monthly_payment)
          .divide(
            (apiResourceObjects[params.row.currency] as Currency).exchange_rate
          )
          .format(),
    },
  ];

  return (
    <Card>
      <CardHeader title="Precios actuales" />
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
              <CustomTable
                columns={columnsRetail}
                data={retail_and_wholesaler_entities}
              />
            </TabPanel>
            {Object.keys(mobile_network_operators_entities).map(
              (storeUrl, index) => (
                <TabPanel key={storeUrl} value={value} index={index + 1}>
                  <CustomTable
                    columns={columnsStores}
                    data={mobile_network_operators_entities[storeUrl]}
                  />
                </TabPanel>
              )
            )}
          </Box>
        ) : (
          <CustomTable columns={columns} data={active_entities} />
        )}
      </CardContent>
    </Card>
  );
}
