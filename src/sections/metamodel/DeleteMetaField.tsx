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
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";

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

export default function DeleteMetaField({
  metaField,
  setMetaModel,
}: {
  metaField: MetaField;
  setMetaModel: Function;
}) {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.metamodel_meta_fields}${metaField.id}/`,
      {
        method: "delete",
      }
    ).then((res) => setMetaModel(res));
  };

  return (
    <>
      <Button variant="contained" color="error" onClick={() => setOpen(true)}>
        Eliminar
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5">
              Eliminar MetaField: {metaField.name}
            </Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <br />
          <Typography>
            ¿Estás seguro que queires eliminar este MetaField? Este proceso es
            irreversible
          </Typography>
          <br />
          <Stack spacing={1} direction="row">
            <Button variant="contained" color="error" onClick={handleDelete}>
              Eliminar
            </Button>
            <Button
              color="inherit"
              variant="outlined"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
