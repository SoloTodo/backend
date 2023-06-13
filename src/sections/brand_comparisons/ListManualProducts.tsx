import {
  Box,
  Button,
  Grid,
  IconButton,
  Link,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NextLink from "next/link";
import { useState } from "react";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { BrandComparison } from "src/frontend-utils/types/brand_comparison";
import { useSnackbar } from "notistack";
import { InLineProduct } from "src/frontend-utils/types/entity";
import { PATH_PRODUCT } from "src/routes/paths";
import AddManualProduct from "./AddManualProduct";

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

export default function ListManualProducts({
  brandComparison,
}: {
  brandComparison: BrandComparison;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<InLineProduct[]>(
    brandComparison.manual_products
  );

  const addManualProduct = (newProducts: InLineProduct[]) => {
    setProducts(newProducts);
  };

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const handleRemove = (product_id: number) => {
    jwtFetch(null, `${brandComparison.url}remove_manual_product/`, {
      method: "POST",
      body: JSON.stringify({ product_id }),
    }).then((res) => {
      setProducts(products.filter((p) => p.id !== product_id));
      enqueueSnackbar("Producto manual eliminado exitosamente");
    });
  };

  return (
    <>
      <Button variant="contained" onClick={openModal}>
        Productos manuales
      </Button>
      <Modal open={open} onClose={closeModal}>
        <Box sx={style}>
          <Stack spacing={3}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h5">Productos manuales</Typography>
              <IconButton onClick={closeModal}>
                <CloseIcon />
              </IconButton>
            </Stack>
            {products.length !== 0 ? (
              <Stack spacing={2}>
                {products.map((product, index) => (
                  <Grid container alignItems="center" key={index}>
                    <Grid item xs={10} pr={1}>
                      <NextLink
                        href={`${PATH_PRODUCT.root}/${product.id}`}
                        passHref
                      >
                        <Link onClick={closeModal}>{product.name}</Link>
                      </NextLink>
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        color="error"
                        variant="outlined"
                        onClick={() => handleRemove(product.id)}
                      >
                        Quitar
                      </Button>
                    </Grid>
                  </Grid>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2">
                Sin productos manuales registradas
              </Typography>
            )}
            <Stack direction="row-reverse">
              <AddManualProduct
                addManualProduct={addManualProduct}
                brandComparison={brandComparison}
              />
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
