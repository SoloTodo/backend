import { Card, CardContent, CardHeader, Stack } from "@mui/material";
import { useState } from "react";
import ProductSearch from "src/components/my_components/ProductSearch";
import { Entity } from "src/frontend-utils/types/entity";

export default function AssociateForm({ entity }: { entity: Entity }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <Card>
      <CardHeader title="Formulario" />
      <CardContent>
        <Stack spacing={2}>
          <ProductSearch
            entity={entity}
            setSelectedProduct={setSelectedProduct}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
