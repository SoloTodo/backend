import { useState } from "react";
import { FormControl, MenuItem, Select } from "@mui/material";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { useSnackbar } from "notistack";
import { Category } from "src/frontend-utils/types/store";
import { Entity } from "src/frontend-utils/types/entity";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import {
  getApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { WtbEntity } from "src/frontend-utils/types/wtb";

export default function CategorySelect({
  entity,
  setEntity,
  hasStaffPermission,
}: {
  entity: Entity | WtbEntity;
  setEntity?: Function;
  hasStaffPermission: boolean;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [category, setCategory] = useState(entity.category);
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const categories = getApiResourceObjects(
    apiResourceObjects,
    "categories"
  );

  const handleCategory = async (value: string) => {
    await jwtFetch(
      null,
      `${entity.url}change_category/`,
      {
        method: "post",
        body: JSON.stringify({ category: apiResourceObjects[value].id }),
      }
    )
      .then((entity) => {
        setCategory(entity.category);
        if (setEntity) setEntity(entity);
      })
      .catch((err) => console.log(err));
  };

  return (
    <FormControl sx={{ width: "100%" }}>
      <Select
        value={category}
        onChange={(evt) => handleCategory(evt.target.value)}
        disabled={!!(entity.product || !hasStaffPermission)}
        onClick={() => {
          if (entity.product)
            enqueueSnackbar(
              "Por favor disocie la entidad antes de cambiar su categoría",
              { variant: "warning" }
            );
        }}
      >
        {categories.map((c) => (
          <MenuItem key={c.id} value={c.url}>
            {c.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
