import {
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { BrandComparison } from "src/frontend-utils/types/brand_comparison";
import ProductSearch from "src/components/my_components/ProductSearch";
import { Product } from "src/frontend-utils/types/product";
import { useSnackbar } from "notistack";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { Microsite } from "src/frontend-utils/types/microsite";
import { apiSettings } from "src/frontend-utils/settings";

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

export default function AddProductButton({
  addProduct,
  microsite,
}: {
  addProduct: Function;
  microsite: Microsite;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const closeModal = () => {
    setOpen(false);
  };

  const onSubmit = () => {
    if (!selectedProduct) {
      enqueueSnackbar("Debes seleccionar un producto", {
        variant: "error",
      });
    } else {
      jwtFetch(null, `${microsite.url}add_entry/`, {
        method: "POST",
        body: JSON.stringify({
          product_id: selectedProduct.id,
        }),
      })
        .then((json) => {
          addProduct(json);
          enqueueSnackbar("Producto agregado exitosamente");
        })
        .finally(() => setOpen(false));
    }
  };

  return (
    <>
      <Button variant="contained" color="success" onClick={() => setOpen(true)}>
        Agregar producto
      </Button>
      <Modal open={open} onClose={closeModal}>
        <Box sx={style}>
          <Stack spacing={3}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h5">Agregar producto</Typography>
              <IconButton onClick={closeModal}>
                <CloseIcon />
              </IconButton>
            </Stack>
            <ProductSearch
              entityCategory={apiSettings.endpoint}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              extraParams={`&brands=${microsite.brand.id}`}
            />

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
                Agregar
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
