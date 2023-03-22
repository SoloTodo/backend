import { Select, TextField, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";

export default function ProductSearch({
  entityCategory,
  selectedProduct,
  setSelectedProduct,
  extraParams,
}: {
  entityCategory: string;
  selectedProduct: any;
  setSelectedProduct: Function;
  extraParams?: string;
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
      `${entityCategory}products/?page_size=200&search=${encodeURIComponent(
        value
      )}${extraParams}`
    ).then((data) => {
      const l = data.results.length;
      setProductChoices(data.results);
      setSelectedProduct(l ? data.results[0] : null);
      closeSnackbar(key);
      if (!l)
        enqueueSnackbar("No se econtraron productos.", {
          variant: "error",
        });
    });
  };

  const handleSelectedProductChange = (value: string | any[]) => {
    const newSelectedProduct = productChoices.find(
      (p) => p.id.toString() === value
    );
    setSelectedProduct(newSelectedProduct);
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
      <Typography>Producto</Typography>
      <Select
        value={selectedProduct ? [selectedProduct.id] : []}
        onChange={(evt) => handleSelectedProductChange(evt.target.value)}
        native
        multiple
        inputProps={{ size: 14 }}
      >
        {productChoices.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name}
          </option>
        ))}
      </Select>
    </>
  );
}
