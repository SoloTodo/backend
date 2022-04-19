import { MenuItem, Select, TextField, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { Entity } from "src/frontend-utils/types/entity";

export default function ProductSearch({
  entityCategory,
  selectedProduct,
  setSelectedProduct,
}: {
  entityCategory: string;
  selectedProduct: any
  setSelectedProduct: Function;
}) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [value, setValue] = useState("");
  const [productChoices, setProductChoices] = useState(
    [] as { id: number; name: string }[]
  );

  const handleProductSearch = () => {
    const key = enqueueSnackbar("Buscando...", {
      persist: true,
      variant: "info",
    });
    jwtFetch(
      null,
      `${entityCategory}products/??page_size=200&search=${encodeURIComponent(
        value
      )}`
    ).then((data) => {
      setProductChoices(data.results);
      setSelectedProduct(data.results.length ? data.results[0] : null);
      closeSnackbar(key);
    });
  };

  const handleSelectedProductChange = (value: number) => {
    const newSelectedProduct = productChoices.find(p => p.id === value)
    setSelectedProduct(newSelectedProduct)
  }

  return (
    <>
      <TextField
        id="outlined-basic"
        label="Palabras clave"
        variant="outlined"
        style={{ width: "100%" }}
        value={value}
        onChange={(evt) => setValue(evt.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleProductSearch()}
      />
      <Typography>Producto</Typography>
      <Select
        value={selectedProduct ? selectedProduct.id : ""}
        onChange={(evt) => handleSelectedProductChange(evt.target.value)}
      >
        {productChoices.map((product) => (
          <MenuItem key={product.id} value={product.id}>
            {product.name}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}
