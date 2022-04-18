import { useState } from "react";
import { FormControl, MenuItem, Select } from "@mui/material";
import { useAppSelector } from "src/store/hooks";
import { useSnackbar } from "notistack";
import { Category } from "src/frontend-utils/types/store";
import { Entity } from "src/frontend-utils/types/entity";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import {
  apiResourceObjectsByIdOrUrl,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { apiSettings } from "src/frontend-utils/settings";

export default function CategorySelect({
  entity,
  hasStaffPermission,
}: {
  entity: Entity;
  hasStaffPermission: boolean;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [category, setCategory] = useState(entity.category);
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const categories: { [url: string]: Category } = apiResourceObjectsByIdOrUrl(
    apiResourceObjects,
    "categories",
    "url"
  );

  const handleCategory = async (value: string) => {
    await jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.entities}${entity.id}/change_category/`,
      {
        method: "post",
        body: JSON.stringify({ category: categories[value].id }),
      }
    )
      .then((entity) => setCategory(entity.category))
      .catch((err) => console.log(err));
  };

  return (
    <FormControl sx={{ width: "100%" }}>
      <Select
        value={category}
        onChange={(evt) => handleCategory(evt.target.value)}
        disabled={entity.product || !hasStaffPermission ? true : false}
        onClick={() => {
          if (entity.product)
            enqueueSnackbar(
              "Por favor disocie la entidad antes de cambiar su categoría",
              { variant: "warning" }
            );
        }}
      >
        {Object.values(categories).map((c) => (
          <MenuItem key={c.id} value={c.url}>
            {c.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}