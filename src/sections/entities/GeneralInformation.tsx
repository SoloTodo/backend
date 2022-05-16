import NextLink from "next/link";
// MUI
import { FormControl, Link, MenuItem, Select } from "@mui/material";
// utils
import { useAppSelector } from "src/store/hooks";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { conditions } from "src/frontend-utils/conditions";
import { fDateTimeSuffix } from "src/utils/formatTime";
// types
import { Detail } from "src/frontend-utils/types/extras";
import { Category } from "src/frontend-utils/types/store";
// path
import { PATH_STORE } from "src/routes/paths";
// section
import Details from "../Details";
import { Entity } from "src/frontend-utils/types/entity";
// components
import ConditionSelect from "src/components/my_components/ConditionSelect";
import CategorySelect from "src/components/my_components/CategorySelect";
import VisibilitySwitch from "src/components/my_components/VisibilitySwitch";

export default function GeneralInformation({
  entity,
}: {
  entity: Entity;
}) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const hasStaffPermission = (
    apiResourceObjects[entity.category] as Category
  ).permissions.includes("is_category_staff");

  const generalDetails: Detail[] = [
    {
      key: "name",
      label: "Nombre",
    },
    {
      key: "cell_plan_name",
      label: "Nombre plan celular",
      renderData: (entity: Entity) =>
        entity.cell_plan_name ? entity.cell_plan_name : "N/A",
    },
    {
      key: "store",
      label: "Tienda",
      renderData: (entity: Entity) => (
        <NextLink
          href={`${PATH_STORE.root}/${apiResourceObjects[entity.store].id}`}
          passHref
        >
          <Link>{apiResourceObjects[entity.store].name}</Link>
        </NextLink>
      ),
    },
    {
      key: "seller",
      label: "Vendedor",
      renderData: (entity: Entity) => (entity.seller ? entity.seller : "N/A"),
    },
    {
      key: "external_url",
      label: "URL",
      renderData: (entity: Entity) => (
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={entity.external_url}
        >
          {entity.external_url}
        </Link>
      ),
    },
    {
      key: "cateogry",
      label: "Categoría",
      renderData: (entity: Entity) => (
        <CategorySelect
          entity={entity}
          hasStaffPermission={hasStaffPermission}
        />
      ),
    },
    {
      key: "condition",
      label: "Condición",
      renderData: (entity: Entity) => (
        <ConditionSelect
          entity={entity}
          hasStaffPermission={hasStaffPermission}
        />
      ),
    },
    {
      key: "scraped_condition",
      label: "Condición Original",
      renderData: (entity: Entity) => (
        <FormControl sx={{ width: "100%" }}>
          <Select value={entity.scraped_condition} disabled readOnly>
            {conditions.map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      key: "part_number",
      label: "Part Number",
      renderData: (entity: Entity) =>
        entity.part_number ? entity.part_number : "N/A",
    },
    {
      key: "sku",
      label: "SKU",
      renderData: (entity: Entity) => (entity.sku ? entity.sku : "N/A"),
    },
    {
      key: "ean",
      label: "EAN",
      renderData: (entity: Entity) => (entity.ean ? entity.ean : "N/A"),
    },
    {
      key: "creation_date",
      label: "Fecha de detección",
      renderData: (entity: Entity) => fDateTimeSuffix(entity.creation_date),
    },
    {
      key: "is_visible",
      label: "¿Visible?",
      renderData: (entity: Entity) => (
        <VisibilitySwitch
          entity={entity}
          hasStaffPermission={hasStaffPermission}
        />
      ),
    },
  ];

  return (
    <Details
      title="Información general"
      data={entity}
      details={generalDetails}
    />
  );
}
