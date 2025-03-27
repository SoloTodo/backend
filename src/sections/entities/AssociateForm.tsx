import { Button, Card, CardContent, CardHeader, Grid, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useState } from "react";
import BundleSelect from "src/components/my_components/BundleSelect";
import CellPlanSelect from "src/components/my_components/CellPlanSelect";
import ProductSearch from "src/components/my_components/ProductSearch";
import AIInferProductDataTable from "src/components/my_components/AIInferProductDataTable";
import AIFindSimilarProductsTable from "src/components/my_components/AIFindSimilarProductsTable";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { apiSettings } from "src/frontend-utils/settings";
import { Bundle, CellPlan, Entity } from "src/frontend-utils/types/entity";
import { Product } from "src/frontend-utils/types/product";
import { Category } from "src/frontend-utils/types/store";
import { PATH_ENTITY, PATH_PRODUCT } from "src/routes/paths";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import AIAssociateTable from "src/components/my_components/AIAssociateTable";

export default function AssociateForm({
  entity,
  setEntity,
}: {
  entity: Entity;
  setEntity: Function;
}) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCellPlan, setSelectedCellPlan] = useState<CellPlan | null>(
    null
  );
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);

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
        entity.cell_plan !== null &&
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
      router.push(
        `${PATH_ENTITY.pending}/?categories=${
          apiResourceObjects[entity.category].id
        }`
      );
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
        `${apiSettings.apiResourceEndpoints.products}${selectedProduct.id}/clone/`,
        {
          method: "POST",
        }
      ).then((data) => {
        const clonedInstanceId = data.instance_id;
        const clonedInstanceUrl = `${apiSettings.endpoint}metamodel/instances/${clonedInstanceId}`;
        closeSnackbar(key);
        window.open(clonedInstanceUrl, "_blank");
      });
  };


  return (
    <>
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
    {(apiResourceObjects[entity.category] as Category).is_ai_managed && (
      <>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <AIAssociateTable entity={entity} setEntity={setEntity}/>
        </Grid>
        </Grid>
    </>
    )}
    <>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <AIInferProductDataTable entity={entity}/>
        </Grid>
        <Grid item xs={7}>
          <AIFindSimilarProductsTable entity={entity}/>
        </Grid>
      </Grid>
     </>
  </>
  );
}
