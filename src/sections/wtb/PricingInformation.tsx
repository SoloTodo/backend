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
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
// utils
import { useAppSelector } from "src/store/hooks";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
// types
import { Detail } from "src/frontend-utils/types/extras";
import { Category } from "src/frontend-utils/types/store";
// paths
import { PATH_PRODUCT } from "src/routes/paths";
import { apiSettings } from "src/frontend-utils/settings";
// section
import Details from "../Details";
import { WtbEntity } from "src/frontend-utils/types/wtb";
import currency from "currency.js";

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
  entity: WtbEntity;
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
    const myAbortController = new AbortController();
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.entity_histories}${entity.id}/stock/`,
      { signal: myAbortController.signal }
    )
      .then((data) => {
        setStock(data.stock);
      })
      .catch((_) => {});
    return () => {
      myAbortController.abort();
    };
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReason(event.target.value);
  };

  const handleDissociate = async () => {
    await jwtFetch(null, `${entity.url}/dissociate/`, {
      method: "post",
      body: JSON.stringify({ reason: reason }),
    })
      .then((data) => {
        setEntity(data);
      })
      .catch((err) => console.log(err));
  };

  const pricingDetails: Detail[] = [
    {
      key: "product_url",
      label: "Producto",
      renderData: (entity: WtbEntity) =>
        entity.product ? (
          <NextLink href={`${PATH_PRODUCT.root}/${entity.product.id}`} passHref>
            <Link>{entity.product.name}</Link>
          </NextLink>
        ) : (
          "N/A"
        ),
    },
    {
      key: "is_active",
      label: "¿Activa?",
      renderData: (entity: WtbEntity) =>
        entity.is_active ? <CheckIcon /> : <ClearIcon />,
    },
    {
      key: "price",
      label: "Precio",
      renderData: (entity: WtbEntity) =>
        entity.price ? (
          currency(entity.price, { precision: 0 }).format()
        ) : (
          <em>N/A</em>
        ),
    },
  ];

  if (entity.product && hasStaffPermission)
    pricingDetails.splice(1, 0, {
      key: "disociar",
      label: "",
      renderData: (_entity: WtbEntity) => (
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
