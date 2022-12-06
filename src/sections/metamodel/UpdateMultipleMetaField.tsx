import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { MetaField } from "src/frontend-utils/types/metamodel";
import { LoadingButton } from "@mui/lab";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "100%", md: "70%" },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function UpdateMultipleMetaField({
  metaField,
  updateMetaModelField,
}: {
  metaField: MetaField;
  updateMetaModelField: Function;
}) {
  const [openMultiple, setOpenMultiple] = useState(false);
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    setOpenMultiple(false);
  };

  const handleMultiple = () => {
    setLoading(true);
    jwtFetch(null, metaField.url!, {
      method: "patch",
      body: JSON.stringify({ multiple: true }),
    })
      .then((res) => {
        updateMetaModelField(res);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Button
        variant="outlined"
        color="info"
        onClick={() => setOpenMultiple(true)}
      >
        Hacer multiple
      </Button>
      <Modal open={openMultiple} onClose={closeModal}>
        <Box sx={style}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5">Hacer Múltiple</Typography>
            <IconButton onClick={closeModal}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <br />
          <Typography>
            Desde esta interfaz puedes marcar un campo como múltiple, de modo
            que a las instancias futuras de este campo se les puedan asignar
            múltiples valores en sus formularios.
          </Typography>
          <br />
          <Typography fontWeight={600}>
            Tenga en cuenta que este proceso es irreversible.
          </Typography>
          <br />
          <Stack spacing={1} direction="row">
            <LoadingButton
              onClick={handleMultiple}
              variant="contained"
              loading={loading}
            >
              Hacer Meta Field Múltiple
            </LoadingButton>
            <Button color="inherit" variant="outlined" onClick={closeModal}>
              Cancelar
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
