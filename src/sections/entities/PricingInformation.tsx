import { useEffect, useState } from "react";
import NextLink from "next/link";
import {
  Box,
  Button,
  Divider,
  Link,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
// utils
import { useAppSelector } from "src/store/hooks";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import currency from "currency.js";
import { fDateTimeSuffix } from "src/utils/formatTime";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
// types
import { Detail } from "src/frontend-utils/types/extras";
import { Entity } from "src/frontend-utils/types/entity";
import { Currency } from "src/frontend-utils/redux/api_resources/types";
import { Category } from "src/frontend-utils/types/store";
// paths
import { PATH_PRODUCT } from "src/routes/paths";
import { apiSettings } from "src/frontend-utils/settings";
// section
import Details from "../Details";

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

export default function PricingInformation({
  entity,
  setEntity,
}: {
  entity: Entity;
  setEntity: Function;
}) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const hasStaffPermission = (
    apiResourceObjects[entity.category] as Category
  ).permissions.includes("is_category_staff");

  const [stock, setStock] = useState(0);

  const [reason, setReason] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setReason("");
  };

  useEffect(() => {
    entity.active_registry &&
      jwtFetch(null, `${entity.active_registry.url}stock/`).then((data) => {
        setStock(data.stock);
      });
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReason(event.target.value);
  };

  const handleDissociate = async () => {
    await jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.entities}${entity.id}/dissociate/`,
      {
        method: "post",
        body: JSON.stringify({ reason: reason }),
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
          <Stack direction="row" alignItems="center" spacing={1}>
            <NextLink
              href={`${PATH_PRODUCT.root}/${entity.product.id}`}
              passHref
            >
              <Link>{entity.product.name}</Link>
            </NextLink>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={entity.external_url}
            >
              <LinkIcon fontSize="small" />
            </Link>
          </Stack>
        ) : (
          "N/A"
        ),
    },
    {
      key: "cell_plan",
      label: "Plan celular",
      renderData: (entity: Entity) =>
        entity.cell_plan ? (
          <NextLink
            href={`${PATH_PRODUCT.root}/${entity.cell_plan.id}`}
            passHref
          >
            <Link>{entity.cell_plan.name}</Link>
          </NextLink>
        ) : (
          "N/A"
        ),
    },
    {
      key: "bundle",
      label: "Bundle",
      renderData: (entity: Entity) =>
        entity.bundle ? entity.bundle.name : "N/A",
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
      key: "cell_monthly_payment",
      label: "Precio mensual celular",
      renderData: (entity: Entity) =>
        entity.active_registry && entity.active_registry.cell_monthly_payment
          ? currency(entity.active_registry.cell_monthly_payment, {
              precision: 0,
            }).format()
          : "N/A",
    },
    {
      key: "currency",
      label: "Moneda",
      renderData: (entity: Entity) => apiResourceObjects[entity.currency].name,
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
      key: "cell_monthly_payment_usd",
      label: "Precio mensual celular (USD)",
      renderData: (entity: Entity) =>
        entity.active_registry && entity.active_registry.cell_monthly_payment
          ? currency(entity.active_registry.cell_monthly_payment)
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

  if (entity.product && hasStaffPermission)
    pricingDetails.splice(1, 0, {
      key: "disociar",
      label: "",
      renderData: (_entity: Entity) => (
        <>
          <Button variant="contained" color="error" onClick={handleOpen}>
            Disociar
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Confirme disociación de la entidad
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Por favor confirme la disociación de la entidad
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Esta entidad fue asociada por un usuario distinto. Si es posible
                por favor deje un mensaje para el/ella especificando el motivo
                para disociar la entidad.
              </Typography>
              <br />
              <TextField
                id="reasons"
                label="Motivo de la disociación (opcional)"
                multiline
                rows={3}
                value={reason}
                onChange={handleChange}
                style={{ width: "100%" }}
              />
              <br />
              <br />
              <Stack
                direction="row"
                justifyContent="flex-end"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={2}
              >
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDissociate}
                >
                  Disociar
                </Button>
                <Button variant="contained" onClick={handleClose}>
                  Cancelar
                </Button>
              </Stack>
            </Box>
          </Modal>
        </>
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
