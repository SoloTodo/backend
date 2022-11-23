import { Autocomplete, Checkbox, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import {
  InstanceMetaModel,
  MetaField,
} from "src/frontend-utils/types/metamodel";

type InstanceChoices = InstanceMetaModel[] | null;

export default function InstanceInput({ metaField }: { metaField: MetaField }) {
  const [instanceChoices, setInstanceChoices] = useState<InstanceChoices>(null);

  useEffect(() => {
    if (!metaField.model.is_primitive) {
      jwtFetch(
        null,
        `${apiSettings.apiResourceEndpoints.metamodel_instance_models}?models=${metaField.model.id}`
      ).then((res) => {
        if (metaField.nullable) {
          const newDropDownInstanceValueChoices = [
            {
              id: "",
              url: "",
              decimal_value: "",
              unicode_value: "",
              unicode_representation: "---",
            },
            ...res,
          ];
          setInstanceChoices(newDropDownInstanceValueChoices);
        } else {
          setInstanceChoices(res);
        }
      });
    }
  }, []);

  console.log(metaField);
  const options =
    instanceChoices !== null
      ? instanceChoices.map((i) => ({
          value: i.id,
          label: i.unicode_representation,
        }))
      : [];

  // INPUTS
  const newFileInput = <input type="file" />;
  const booleanInput = <Checkbox />;
  const generalInput = <TextField sx={{ width: "100%" }} variant="outlined" />;
  const selectInput = (
    <Autocomplete
      options={options}
      multiple={metaField.multiple}
      sx={{ width: "100%" }}
      renderInput={(params) => <TextField {...params} label="" />}
    />
  );

  const componentToRender = () => {
    if (metaField.model.is_primitive) {
      if (metaField.model.name === "FileField") {
        return newFileInput;
      } else if (metaField.model.name === "BooleanField") {
        return booleanInput;
      } else {
        return generalInput;
      }
    } else {
      return selectInput;
    }
  };
  return componentToRender();
}
