import { Card, CardContent, CardHeader, Stack } from "@mui/material";
import { useState } from "react";
import CellPlanSelect from "src/components/my_components/CellPlanSelect";
import ProductSearch from "src/components/my_components/ProductSearch";
import { Entity } from "src/frontend-utils/types/entity";

export default function AssociateForm({ entity }: { entity: Entity }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCellPlan, setSelectedCellPlan] = useState(null);
  const [selectedBundle, setSelectedBundle] = useState(null);

  console.log(selectedProduct);

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
        </Stack>
      </CardContent>
    </Card>
  );
}
