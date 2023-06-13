import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import {
  getApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { apiSettings } from "src/frontend-utils/settings";
import { BrandComparison } from "src/frontend-utils/types/brand_comparison";
import { Store } from "src/frontend-utils/types/store";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "98%", md: "80%" },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function SelectStores({
  brandComparison,
  setBrandComparison,
}: {
  brandComparison: BrandComparison;
  setBrandComparison: Function;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const closeModal = () => {
    setOpen(false);
  };

  const [selectedStoreIds, setSelectedStoresIds] = useState<string[]>(
    brandComparison.stores.map((s) => apiResourceObjects[s].id.toString())
  );

  const allStores = (
    getApiResourceObjects(apiResourceObjects, "stores") as Store[]
  ).filter(
    (s) =>
      s.country === apiSettings.apiResourceEndpoints.countries + "1/" &&
      s.last_activation
  );
  const allStoreIds = allStores.map((s) => s.id.toString());

  const selectAll = () => {
    setSelectedStoresIds(allStoreIds);
  };

  const selectNone = () => {
    setSelectedStoresIds([]);
  };

  const onChange = (check: boolean, id: string) => {
    if (check) {
      setSelectedStoresIds([...selectedStoreIds, id]);
    } else {
      setSelectedStoresIds(selectedStoreIds.filter((i) => i !== id));
    }
  };

  const onSubmit = () => {
    if (selectedStoreIds.length === 0) {
      enqueueSnackbar("Debes seleccionar al menos una tienda", {
        variant: "error",
      });
    } else {
      jwtFetch(
        null,
        `${apiSettings.apiResourceEndpoints.brand_comparisons}${brandComparison.id}/`,
        {
          method: "PATCH",
          body: JSON.stringify({
            stores: selectedStoreIds,
          }),
        }
      )
        .then((json) => {
          setBrandComparison(json);
          enqueueSnackbar("Tiendas guardadas exitosamente");
        })
        .finally(() => setOpen(false));
    }
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Tiendas
      </Button>
      <Modal open={open} onClose={closeModal}>
        <Box sx={style}>
          <Stack spacing={3}>
            <Stack
              direction="row-reverse"
              alignItems="center"
              justifyContent="space-between"
            >
              <IconButton onClick={closeModal}>
                <CloseIcon />
              </IconButton>
            </Stack>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">Selección de tiendas</Typography>
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" onClick={selectAll}>
                  Todas
                </Button>
                <Button variant="outlined" onClick={selectNone}>
                  Ninguna
                </Button>
              </Stack>
            </Grid>
            <Divider />
            <Grid
              container
              columns={{ xs: 4, sm: 6, md: 8 }}
              spacing={3}
              maxHeight={500}
              overflow="auto"
            >
              {allStores.map((s) => (
                <Grid key={s.id} item xs={2}>
                  <FormControlLabel
                    disableTypography
                    checked={selectedStoreIds.includes(s.id.toString())}
                    control={<Checkbox />}
                    label={s.name}
                    onChange={(_, check) => onChange(check, s.id.toString())}
                  />
                </Grid>
              ))}
            </Grid>
            <Divider />
            <Stack direction="row-reverse" spacing={1}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button variant="contained" color="success" onClick={onSubmit}>
                Guardar
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
