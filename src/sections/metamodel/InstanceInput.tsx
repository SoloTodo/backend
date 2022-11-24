import { Autocomplete, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import { RHFCheckbox, RHFTextField } from "src/components/hook-form";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import {
  InstanceMetaModel,
  MetaField,
} from "src/frontend-utils/types/metamodel";
import MetaModalInstanceModal from "./MetaModelInstanceModal";

type InstanceChoices = InstanceMetaModel[] | null;

export default function InstanceInput({
  metaField,
  control,
}: {
  metaField: MetaField;
  control: Control<FieldValues, any>;
}) {
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

  const options =
    instanceChoices !== null
      ? instanceChoices.map((i) => ({
          value: i.id,
          label: i.unicode_representation,
        }))
      : [];

  const isOptionEqualToValue = (
    option: { label: string; value: number },
    value: { label: string; value: number }
  ) => {
    return option.value === value.value;
  };

  const componentToRender = () => {
    if (metaField.model.is_primitive) {
      if (metaField.model.name === "FileField") {
        return <input type="file" />;
      } else if (metaField.model.name === "BooleanField") {
        return <RHFCheckbox name={metaField.name} label="" />;
      } else {
        return (
          <RHFTextField
            type={metaField.model.name === "CharField" ? "text" : "number"}
            sx={{ width: "100%" }}
            variant="outlined"
            name={metaField.name}
            required={!metaField.nullable}
          />
        );
      }
    } else {
      return (
        <Controller
          name={metaField.name}
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              multiple={metaField.multiple}
              isOptionEqualToValue={isOptionEqualToValue}
              onChange={(_, newValue) => field.onChange(newValue)}
              options={options}
              renderInput={(params) => <TextField label="" {...params} />}
              fullWidth
            />
          )}
        />
      );
    }
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {componentToRender()}
      {!metaField.model.is_primitive && (
        <>
          <MetaModalInstanceModal metaField={metaField} />
          {/* <p>Editar</p> */}
        </>
      )}
    </Stack>
  );
}
