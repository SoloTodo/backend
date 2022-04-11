import { useEffect, useState } from "react";
import NextLink from "next/link";
import { Button, Link } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
// utils
import { ApiResourceObjectRecord } from "src/frontend-utils/redux/api_resources/apiResources";
import currency from "currency.js";
import { fDateTimeSuffix } from "src/utils/formatTime";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
// types
import { Detail } from "src/frontend-utils/types/extras";
import { Entity } from "src/frontend-utils/types/store";
import { Currency } from "src/frontend-utils/redux/api_resources/types";
// paths
import { PATH_PRODUCT } from "src/routes/paths";
import { apiSettings } from "src/frontend-utils/settings";
// section
import Details from "../Details";

export default function PricingInformation({
  entity,
  apiResourceObjects,
  setEntity,
}: {
  entity: Entity;
  apiResourceObjects: ApiResourceObjectRecord;
  setEntity: Function;
}) {
  const [stock, setStock] = useState(0);

  useEffect(() => {
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.entity_histories}${entity.id}/stock/`
    ).then((data) => {
      setStock(data.stock);
    });
  }, []);

  const handleDissociate = () => {
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.entities}${entity.id}/dissociate/`,
      {
        method: "post",
      }
    )
      .then((data) => {
        setEntity(data);
      })
      .catch((err) => console.log(err));
  };

  const pricingDetails: Detail[] = [
    {
      key: "product_url",
      label: "Producto",
      renderData: (entity: Entity) =>
        entity.product ? (
          <NextLink href={`${PATH_PRODUCT.root}/${entity.product.id}`} passHref>
            <Link>{entity.product.name}</Link>
          </NextLink>
        ) : (
          "N/A"
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
          : "N/A",
    },
    {
      key: "offer_price",
      label: "Precio oferta",
      renderData: (entity: Entity) =>
        entity.active_registry
          ? currency(entity.active_registry.offer_price, {
              precision: 0,
            }).format()
          : "N/A",
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
          : "N/A",
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
          : "N/A",
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

  if (entity.product)
    pricingDetails.splice(1, 0, {
      key: "disociar",
      label: "",
      renderData: (_entity: Entity) => (
        <Button variant="contained" color="error" onClick={handleDissociate}>
          Disociar
        </Button>
      ),
    });

  return (
    <Details
      title="Información pricing"
      data={entity}
      details={pricingDetails}
    />
  );
}
