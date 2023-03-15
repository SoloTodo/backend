import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { fetchAuth } from "src/frontend-utils/nextjs/utils";
import { Segment } from "src/frontend-utils/types/brand_comparison";
import { apiSettings } from "src/frontend-utils/settings";

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
  maxHeight: "80%",
  overflow: "auto",
};

export default function EditSegmentName({
  segment,
  onComparisonChange,
}: {
  segment: Segment;
  onComparisonChange: Function;
}) {
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState<string>(segment.name);

  const handleClose = () => {
    setOpenModal(false);
    setName(segment.name);
  };

  const handleSubmit = () => {
    if (name !== "" && name !== segment.name) {
      const formData = {
        name: name,
      };

      fetchAuth(
        null,
        `${apiSettings.apiResourceEndpoints.brand_comparisons_segments}${segment.id}/`,
        {
          method: "PATCH",
          body: JSON.stringify(formData),
        }
      ).then((json) => {
        handleClose();
        onComparisonChange();
      });
    }
  };

  return (
    <>
      <IconButton onClick={() => setOpenModal(true)} size="small">
        <EditIcon />
      </IconButton>
      <Modal open={openModal} onClose={handleClose}>
        <Box sx={style}>
          <Stack spacing={2}>
            <Typography id="modal-modal-title" variant="h3" component="h2">
              Cambiar nombre
            </Typography>
            <TextField
              label="Nombre"
              value={name}
              fullWidth
              onChange={(e) => setName(e.target.value)}
            />
            <Stack direction="row-reverse" spacing={1}>
              <Button variant="contained" color="error" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
              >
                Guardar
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
