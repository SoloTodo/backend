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
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { Row } from "src/frontend-utils/types/brand_comparison";
import { LoadingButton } from "@mui/lab";

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

export default function DeleteRowButton({
  row,
  disabled,
  onComparisonChange,
}: {
  row: Row;
  disabled: boolean;
  onComparisonChange: Function;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    setLoading(true);
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.brand_comparison_segment_rows}${row.id}/`,
      {
        method: "delete",
      }
    ).then((res) => {
      onComparisonChange();
      setLoading(false);
      setOpen(false);
    });
  };

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        size="small"
        disabled={disabled}
      >
        <CloseIcon sx={{ fontSize: 15 }} />
      </IconButton>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5">Eliminar fila</Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <br />
          <Typography>
            ¿Estás seguro que quieres eliminar esta fila? Este proceso es
            irreversible
          </Typography>
          <br />
          <Stack spacing={1} direction="row">
            <LoadingButton
              onClick={handleDelete}
              color="error"
              variant="contained"
              loading={loading}
            >
              Eliminar
            </LoadingButton>
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
