import { TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { Entity } from "src/frontend-utils/types/entity";

export default function ProductSearch({
  entity,
  setSelectedProduct,
}: {
  entity: Entity;
  setSelectedProduct: Function;
}) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [value, setValue] = useState("");
  const [productChoices, setProductChoices] = useState([]);

  const handleProductSearch = () => {
    const key = enqueueSnackbar("Buscando...", {
      persist: true,
      variant: "info",
    });
    jwtFetch(
      null,
      `${entity.category}products/??page_size=200&search=${encodeURIComponent(
        value
      )}`
    ).then((data) => {
      setProductChoices(data.results)
      const selectedProduct = productChoices.length ? productChoices[0] : null;
      setSelectedProduct(selectedProduct);
      closeSnackbar(key);
    });
  };

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
      <br />
      
    </>
  );
}
