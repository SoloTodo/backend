import {
  Autocomplete,
  FormHelperText,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import {
  RHFCheckbox,
  RHFTextField,
  RHFUploadSingleFile,
} from "src/components/hook-form";
import Image from "src/components/Image";
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
  setValue,
  values,
  errors,
  currentFileFields,
}: {
  metaField: MetaField;
  control: Control<FieldValues, any>;
  setValue: Function;
  values: Record<string, any>;
  errors: Record<string, any>;
  currentFileFields: Record<string, string>;
}) {
  const [instanceChoices, setInstanceChoices] = useState<InstanceChoices>(null);
  const [selectedInstances, setSelectedIsntances] = useState<
    { label: string; value: number }[]
  >([]);

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

  const addChoice = (json: InstanceMetaModel) => {
    setInstanceChoices([...instanceChoices!, json]);
    if (!metaField.model.is_primitive) {
      if (metaField.multiple) {
        setValue(metaField.name, [
          ...selectedInstances,
          {
            value: json.id,
            label: json.unicode_representation,
          },
        ]);
      } else {
        setValue(metaField.name, {
          value: json.id,
          label: json.unicode_representation,
        });
      }
    } else if (
      ["IntegerField", "DecimalField"].includes(metaField.model.name)
    ) {
      setValue(metaField.name, json.decimal_value);
    } else {
      setValue(metaField.name, json.unicode_value);
    }
  };

  const editChoice = (json: InstanceMetaModel) => {
    const editedInstanceChoices = instanceChoices?.map((i) => {
      if (i.id === json.id) {
        return json;
      } else {
        return i;
      }
    });
    setInstanceChoices(editedInstanceChoices || []);
    setValue(metaField.name, {
      value: json.id,
      label: json.unicode_representation,
    });
  };

  const options =
    instanceChoices !== null
      ? instanceChoices.map((i) => ({
          value: i.id,
          label: i.unicode_representation || "",
        }))
      : [];

  const isOptionEqualToValue = (
    option: { label: string; value: number },
    value: { label: string; value: number }
  ) => {
    return option.value === value.value;
  };

  const handleDrop = useCallback(
    (acceptedFiles, name) => {
      const file = acceptedFiles[0];
      setValue(
        name,
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
    },
    [setValue]
  );

  const componentToRender = () => {
    if (metaField.model.is_primitive) {
      if (metaField.model.name === "FileField") {
        return (
          <Stack spacing={1}>
            {currentFileFields[metaField.name] && (
              <Stack>
                <Image
                  src={`https://media.solotodo.com/media/${
                    currentFileFields[metaField.name]
                  }`}
                  sx={{ width: "60%" }}
                />
                <Typography variant="body2">
                  Actual:{" "}
                  <Link
                    href={`https://media.solotodo.com/media/${
                      currentFileFields[metaField.name]
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {currentFileFields[metaField.name]}
                  </Link>
                </Typography>
              </Stack>
            )}
            <RHFUploadSingleFile
              name={metaField.name}
              onDrop={(t) => handleDrop(t, metaField.name)}
            />
          </Stack>
        );
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
        <>
          <Controller
            name={metaField.name}
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                multiple={metaField.multiple}
                disableClearable={!metaField.nullable}
                isOptionEqualToValue={isOptionEqualToValue}
                onChange={(_, newValue) => {
                  field.onChange(newValue);
                  Array.isArray(newValue) && setSelectedIsntances(newValue);
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option.value}>
                    {option.label}
                  </li>
                )}
                options={options}
                renderInput={(params) => <TextField label="" {...params} />}
                fullWidth
              />
            )}
          />
        </>
      );
    }
  };

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        {componentToRender()}
        {!metaField.model.is_primitive && (
          <>
            <MetaModalInstanceModal
              metaField={metaField}
              addChoice={addChoice}
            />
            {values[metaField.name] && !metaField.multiple && (
              <MetaModalInstanceModal
                metaField={metaField}
                instanceId={values[metaField.name].value}
                editChoice={editChoice}
              />
            )}
          </>
        )}
      </Stack>
      {errors[metaField.name] && (
        <FormHelperText sx={{ px: 2, display: "block" }} error>
          {(errors[metaField.name] as any).message}
        </FormHelperText>
      )}
    </>
  );
}
