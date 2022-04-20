import { Button, Card, CardContent, CardHeader, Stack } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import BundleSelect from "src/components/my_components/BundleSelect";
import CellPlanSelect from "src/components/my_components/CellPlanSelect";
import ProductSearch from "src/components/my_components/ProductSearch";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { Entity } from "src/frontend-utils/types/entity";
import { PATH_PRODUCT } from "src/routes/paths";

export default function AssociateForm({
  entity,
  setEntity,
}: {
  entity: Entity;
  setEntity: Function;
}) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [selectedProduct, setSelectedProduct] = useState(
    null as { id: number; instance_model_id: number } | null
  );
  const [selectedCellPlan, setSelectedCellPlan] = useState(
    null as { id: number } | null
  );
  const [selectedBundle, setSelectedBundle] = useState(
    null as { id: number } | null
  );

  const handleProductAssociationSubmit = () => {
    if (entity.cell_plan_name && !selectedCellPlan) {
      enqueueSnackbar("Debe seleccionar un plan celular.", {
        variant: "error",
      });
      return;
    }

    const payload = {
      product: selectedProduct ? selectedProduct.id : null,
      bundle: selectedBundle ? selectedBundle.id : null,
      cell_plan: null as number | null,
    };

    let matchExistingCellPlan = false;
    if (selectedCellPlan) {
      payload.cell_plan = selectedCellPlan.id;
      matchExistingCellPlan =
        typeof entity.cell_plan !== "undefined" &&
        entity.cell_plan.id === selectedCellPlan.id;
    } else {
      matchExistingCellPlan = !entity.cell_plan;
    }

    if (
      entity.product &&
      selectedProduct &&
      entity.product.id === selectedProduct.id &&
      matchExistingCellPlan &&
      (entity.bundle ? entity.bundle.id : null) === selectedBundle
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
          <CellPlanSelect
            entityId={entity.id}
            selectedCellPlan={selectedCellPlan}
            setSelectedCellPlan={setSelectedCellPlan}
          />
          <BundleSelect
            selectedBundle={selectedBundle}
            setSelectedBundle={setSelectedBundle}
          />
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
                  handleProductAssociationSubmit()
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
              <Button
                variant="contained"
                color="info"
                href={`${apiSettings.endpoint}metamodel/instances/${selectedProduct.instance_model_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Editar
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
