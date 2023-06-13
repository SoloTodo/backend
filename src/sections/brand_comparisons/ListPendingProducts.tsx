import {
  Box,
  Button,
  Link,
  List,
  ListItem,
  ListItemText,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { useState } from "react";
import {
  BrandComparison,
  BrandRowData,
} from "src/frontend-utils/types/brand_comparison";
import { Product } from "src/frontend-utils/types/product";
import { PATH_PRODUCT } from "src/routes/paths";

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

export default function ListPendingProducts({
  brandComparison,
  brand1RowData,
  brand2RowData,
}: {
  brandComparison: BrandComparison;
  brand1RowData: BrandRowData[] | undefined;
  brand2RowData: BrandRowData[] | undefined;
}) {
  const [open, setOpen] = useState(false);

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const pendingProducts = {
    brand1: [] as Product[],
    brand2: [] as Product[],
  };

  const brand1 = brandComparison["brand_1"];
  const brand2 = brandComparison["brand_2"];

  if (typeof brand1RowData !== "undefined") {
    for (const data of brand1RowData) {
      if (!data.rowIds.length) {
        const p = data.product as Product;
        if (p.brand === brand1.url) {
          pendingProducts.brand1.push(p);
        }
      }
    }
  }

  if (typeof brand2RowData !== "undefined") {
    for (const data of brand2RowData) {
      if (!data.rowIds.length) {
        const p = data.product as Product;
        if (p.brand === brand2.url) {
          pendingProducts.brand2.push(p);
        }
      }
    }
  }

  const pendingProductsCount =
    pendingProducts.brand1.length + pendingProducts.brand2.length;

  if (!pendingProductsCount) {
    return null;
  }

  return (
    <>
      <Button variant="contained" onClick={openModal}>
        {pendingProductsCount} Productos pendientes
      </Button>
      <Modal open={open} onClose={closeModal}>
        <Box sx={style}>
          <Typography variant="h5">
            {pendingProductsCount} Productos Pendientes
          </Typography>
          <br />
          <Stack direction="row" spacing={2} justifyContent="space-evenly">
            <Stack>
              <Typography>{brandComparison.brand_1.name}</Typography>
              <List dense>
                {pendingProducts.brand1.map((p) => (
                  <ListItem key={p.id}>
                    <ListItemText
                      primary={
                        <NextLink href={`${PATH_PRODUCT}/${p.id}`} passHref>
                          <Link>{p.name}</Link>
                        </NextLink>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Stack>
            <Stack>
              <Typography>{brandComparison.brand_2.name}</Typography>
              <List dense>
                {pendingProducts.brand2.map((p) => (
                  <ListItem key={p.id}>
                    <ListItemText
                      primary={
                        <NextLink href={`${PATH_PRODUCT}/${p.id}`} passHref>
                          <Link>{p.name}</Link>
                        </NextLink>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
