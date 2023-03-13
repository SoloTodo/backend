import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { BrandComparison } from "src/frontend-utils/types/brand_comparison";
import {
  getApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import AddAlertModal from "./AddAlertModal";
import { useSnackbar } from "notistack";

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
  maxHeight: "80%",
  overflow: "auto",
};

type Alert = {
  id: number;
  stores: string[];
};

export default function ListAlerts({
  brandComparision,
}: {
  brandComparision: BrandComparison;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = (newAlert: Alert) => {
    setAlerts([newAlert, ...alerts]);
  };

  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const stores = getApiResourceObjects(apiResourceObjects, "stores");

  const openModal = () => {
    setLoading(true);
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.brand_comparisons_alerts}?brand_comparison=${brandComparision.id}`
    )
      .then((res) => setAlerts(res))
      .finally(() => setLoading(false));
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const handleRemove = (id: number) => {
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.brand_comparisons_alerts}${id}/`,
      {
        method: "DELETE",
      }
    ).then((res) => {
      setAlerts(alerts.filter((a) => a.id !== id));
      enqueueSnackbar("Alerta creada exitosamente");
    });
  };

  return (
    <>
      <Button variant="contained" onClick={openModal}>
        Alertas
      </Button>
      <Modal open={open} onClose={closeModal}>
        <Box sx={style}>
          <Stack spacing={3}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h5">Alertas</Typography>
              <IconButton onClick={closeModal}>
                <CloseIcon />
              </IconButton>
            </Stack>
            {loading ? (
              <Box textAlign="center">
                <CircularProgress color="inherit" />
              </Box>
            ) : alerts.length !== 0 ? (
              <Stack spacing={2}>
                {alerts.map((alert) => (
                  <Grid container alignItems="center" key={alert.id}>
                    <Grid item xs={10} pr={1}>
                      {alert.stores
                        .map(
                          (store) =>
                            stores.filter((s) => s.url === store)[0].name
                        )
                        .join(", ")}
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        color="error"
                        variant="outlined"
                        onClick={() => handleRemove(alert.id)}
                      >
                        Eliminar
                      </Button>
                    </Grid>
                  </Grid>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2">Sin alertas registradas</Typography>
            )}
            <Stack direction="row-reverse">
              <AddAlertModal
                addAlert={addAlert}
                brandComparision={brandComparision}
              />
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
