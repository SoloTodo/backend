import { useState } from "react";
import { FormControl, MenuItem, Select } from "@mui/material";
import { Entity } from "src/frontend-utils/types/entity";
import { conditions } from "src/frontend-utils/conditions";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";

export default function ConditionSelect({
  entity,
  hasStaffPermission,
}: {
  entity: Entity;
  hasStaffPermission: boolean;
}) {
  const [condition, setCondition] = useState(entity.condition);

  const handleCondition = async (value: string) => {
    await jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.entities}${entity.id}/set_condition/`,
      {
        method: "post",
        body: JSON.stringify({ condition: value }),
      }
    )
      .then((entity) => setCondition(entity.condition))
      .catch((err) => console.log(err));
  };

  return (
    <FormControl sx={{ width: "100%" }}>
      <Select
        value={condition}
        onChange={(evt) => handleCondition(evt.target.value)}
        disabled={!hasStaffPermission}
      >
        {conditions.map(({ value, label }) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
