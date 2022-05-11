import { Button, Card, CardContent, CardHeader, Stack } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import ProductSearch from "src/components/my_components/ProductSearch";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { Product } from "src/frontend-utils/types/product";
import { WtbEntity } from "src/frontend-utils/types/wtb";
import { PATH_PRODUCT } from "src/routes/paths";

export default function AssociateForm({
  entity,
  setEntity,
}: {
  entity: WtbEntity;
  setEntity: Function;
}) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductAssociationSubmit = () => {
    const payload = {
      product: selectedProduct ? selectedProduct.id : null,
    };

    if (
      entity.product &&
      selectedProduct &&
      entity.product.id === selectedProduct.id
    ) {
      enqueueSnackbar(
        "Por favor seleccionar otro producto / plan celular que el que ya está asignado.",
        { variant: "error", persist: true }
      );
      return;
    }

    const key = enqueueSnackbar("Asociando entidad, por favor espera!", {
      persist: true,
      variant: "info",
    });
    jwtFetch(null, entity.url + "associate/", {
      method: "POST",
      body: JSON.stringify(payload),
    }).then((data) => {
      closeSnackbar(key);
      setEntity(data);
      enqueueSnackbar("La entidad ha sido asociada exitosamente!", {
        variant: "success",
      });
    });
  };

  const handleProductClone = () => {
    const key = enqueueSnackbar("Clonando producto, por favor espera!", {
      persist: true,
      variant: "info",
    });
    selectedProduct &&
      jwtFetch(
        null,
        `${apiSettings.apiResourceEndpoints.products}${selectedProduct.id}/clone/`
      ).then((data) => {
        const clonedInstanceId = data.instance_id;
        const clonedInstanceUrl = `${apiSettings.endpoint}metamodel/instances/${clonedInstanceId}`;
        closeSnackbar(key);
        window.open(clonedInstanceUrl, "_blank");
      });
  };

  return (
    <Card>
      <CardHeader title="Formulario" />
      <CardContent>
        <Stack spacing={2}>
          <ProductSearch
            entityCategory={entity.category}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
          />
          <br />
          <Stack spacing={1} direction="row">
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                if (!selectedProduct) {
                  enqueueSnackbar(
                    "Por favor seleccione un producto a asociar.",
                    { variant: "warning" }
                  );
                } else {
                  handleProductAssociationSubmit();
                }
              }}
              disableElevation={!selectedProduct}
            >
              Asociar
            </Button>
            {selectedProduct && (
              <Button
                variant="contained"
                color="info"
                href={`${PATH_PRODUCT.root}/${selectedProduct.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver producto
              </Button>
            )}
            {selectedProduct && (
              <Button
                variant="contained"
                color="info"
                href={`${apiSettings.solotodoUrl}products/${selectedProduct.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver en SoloTodo
              </Button>
            )}
            {selectedProduct && (
              <Button variant="contained" onClick={handleProductClone}>
                Clonar
              </Button>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
