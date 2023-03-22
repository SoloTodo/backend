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

export default function AddManualProduct({
  addManualProduct,
  brandComparison,
}: {
  addManualProduct: Function;
  brandComparison: BrandComparison;
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
      jwtFetch(null, `${brandComparison.url}add_manual_product/`, {
        method: "POST",
        body: JSON.stringify({
          product_id: selectedProduct.id,
        }),
      })
        .then((json) => {
          addManualProduct(json.manual_products);
          enqueueSnackbar("Producto agregado exitosamente");
        })
        .finally(() => setOpen(false));
    }
  };

  return (
    <>
      <Button variant="contained" color="success" onClick={() => setOpen(true)}>
        Agregar nuevo producto manual
      </Button>
      <Modal open={open} onClose={closeModal}>
        <Box sx={style}>
          <Stack spacing={3}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h5">Nuevo producto manual</Typography>
              <IconButton onClick={closeModal}>
                <CloseIcon />
              </IconButton>
            </Stack>
            <ProductSearch
              entityCategory={brandComparison.category.url}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
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
