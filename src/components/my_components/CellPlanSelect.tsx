import { MenuItem, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { CellPlan } from "src/frontend-utils/types/entity";

export default function CellPlanSelect({
  entityId,
  selectedCellPlan,
  setSelectedCellPlan,
}: {
  entityId: number;
  selectedCellPlan: CellPlan | null;
  setSelectedCellPlan: Function;
}) {
  const [planCellChoices, setPlanCellChoices] = useState<CellPlan[]>([]);

  useEffect(() => {
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.entities}${entityId}/cell_plan_choices/`
    ).then((data) => {
      setPlanCellChoices(data);
    });
  }, []);

  const handleSelectedCellPlanChange = (value: number | string) => {
    const newSelectedCellPlan = planCellChoices.find((p) => p.id === value);
    setSelectedCellPlan(newSelectedCellPlan ? newSelectedCellPlan : null);
  };

  if (planCellChoices.length === 0) return null;
  return (
    <>
      <Typography>Plan celular</Typography>
      <Select
        value={selectedCellPlan ? selectedCellPlan.id : ""}
        onChange={(evt) => handleSelectedCellPlanChange(evt.target.value)}
      >
        <MenuItem value="">
          <em>N/A</em>
        </MenuItem>
        {planCellChoices.map((product) => (
          <MenuItem key={product.id} value={product.id}>
            {product.name}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}
