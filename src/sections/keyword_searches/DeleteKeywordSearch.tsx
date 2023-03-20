import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useContext, useState } from "react";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { Keyword } from "src/frontend-utils/types/keyword";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";

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

export default function DeleteBrandComparison({
  keyword,
}: {
  keyword: Keyword;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const context = useContext(ApiFormContext);

  const handleDelete = () => {
    setLoading(true);
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.keyword_searches}${keyword.id}/`,
      {
        method: "delete",
      }
    ).then((res) => {
      context.setCurrentResult(
        context.currentResult.filter((r: Keyword) => r.id !== keyword.id)
      );
      enqueueSnackbar("Búsqueda por keyword eliminada", {
        variant: "success",
      });
      setLoading(false);
    });
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} color="error" variant="outlined">
        Eliminar
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5">Eliminar búsqueda por keyword</Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <br />
          <Typography>
            Si elimina una búsqueda se perderán todos los datos históricos
            asociados a ésta.
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
