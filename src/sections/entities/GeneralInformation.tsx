import { useState } from "react";
import NextLink from "next/link";
import { useSnackbar } from "notistack";
// MUI
import { FormControl, Link, MenuItem, Select, Switch } from "@mui/material";
// utils
import {
  ApiResourceObjectRecord,
  apiResourceObjectsByIdOrUrl,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { conditions } from "src/frontend-utils/conditions";
import { fDateTimeSuffix } from "src/utils/formatTime";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
// types
import { Detail } from "src/frontend-utils/types/extras";
import { Category, Entity } from "src/frontend-utils/types/store";
// path
import { PATH_STORE } from "src/routes/paths";
import { apiSettings } from "src/frontend-utils/settings";
// section
import Details from "../Details";

export default function GeneralInformation({
  entity,
  apiResourceObjects,
}: {
  entity: Entity;
  apiResourceObjects: ApiResourceObjectRecord;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [condition, setCondition] = useState(entity.condition);
  const [category, setCategory] = useState(entity.category);
  const [isVisible, setIsVisible] = useState(entity.is_visible);

  const categories: { [url: string]: Category } = apiResourceObjectsByIdOrUrl(
    apiResourceObjects,
    "categories",
    "url"
  );

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

  const handleVisible = async (checked: boolean) => {
    if (!entity.product) {
      await jwtFetch(
        null,
        `${apiSettings.apiResourceEndpoints.entities}${entity.id}/toggle_visibility/`,
        {
          method: "post",
          body: JSON.stringify({ is_visible: checked }),
        }
      )
        .then(() => setIsVisible(checked))
        .catch((err) => console.log(err));
    } else {
      enqueueSnackbar("Primero hay que disociar la entidad", {
        variant: "warning",
      });
    }
  };

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
      renderData: (entity: Entity) => apiResourceObjects[entity.category].name,
    },
    {
      key: "condition",
      label: "Condición",
      renderData: (_entity: Entity) => (
        <FormControl sx={{ width: "100%" }}>
          <Select
            value={condition}
            onChange={(evt) => handleCondition(evt.target.value)}
          >
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
      key: "scraped_condition",
      label: "Condición Original",
      renderData: (_entity: Entity) => (
        <FormControl sx={{ width: "100%" }}>
          <Select
            value={category}
            onChange={(evt) => handleCategory(evt.target.value)}
            disabled={entity.product ? true : false}
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
      renderData: (_entity: Entity) => (
        <Switch
          checked={isVisible}
          onChange={(evt) => handleVisible(evt.target.checked)}
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
