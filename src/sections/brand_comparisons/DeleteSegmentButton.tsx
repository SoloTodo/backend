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
import { Segment } from "src/frontend-utils/types/brand_comparison";
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

export default function DeleteSegmentButton({
  segment,
  onComparisonChange,
}: {
  segment: Segment;
  onComparisonChange: Function;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    setLoading(true);
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.brand_comparisons_segments}${segment.id}/`,
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
      <IconButton onClick={() => setOpen(true)} size="small">
        <CloseIcon />
      </IconButton>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5">
              Eliminar segmento: {segment.name}
            </Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <br />
          <Typography>
            ¿Estás seguro que quieres eliminar este segmento? Este proceso es
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
