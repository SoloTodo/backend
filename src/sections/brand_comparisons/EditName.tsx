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
import { BrandComparison } from "src/frontend-utils/types/brand_comparison";

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
  
  export default function EditName({
    brandComparision,
    setBrandComparision,
  }: {
    brandComparision: BrandComparison;
    setBrandComparision: Function;
  }) {
    const [openModal, setOpenModal] = useState(false);
    const [name, setName] = useState<string>(brandComparision.name);
  
    const handleClose = () => {
      setOpenModal(false);
      setName(brandComparision.name);
    };
  
    const handleSubmit = () => {
      if (name !== "" && name !== brandComparision.name) {
        const formData = {
          name: name,
        };
  
        fetchAuth(null, `brand_comparisons/${brandComparision.id}/`, {
          method: "PATCH",
          body: JSON.stringify(formData),
        }).then((json) => {
          handleClose();
          setBrandComparision(json);
        });
      }
    };
  
    return (
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="h5">{brandComparision.name}</Typography>
        <IconButton onClick={() => setOpenModal(true)}>
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
      </Stack>
    );
  }
  