import {
  Autocomplete,
  Box,
  Button,
  FormHelperText,
  IconButton,
  Link,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";
import { useCallback, useEffect, useState } from "react";
import {
  FormProvider,
  RHFCheckbox,
  RHFTextField,
  RHFUploadSingleFile,
} from "src/components/hook-form";
import * as Yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  InstanceMetaModel,
  MetaField,
  MetaModel,
} from "src/frontend-utils/types/metamodel";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import DeleteMetaField from "./DeleteMetaField";
import UpdateMultipleMetaField from "./UpdateMultipleMetaField";
import UpdateNullableMetaField from "./UpdateNullableMetaField";
import { useSnackbar } from "notistack";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "100%", md: "70%" },
  maxHeight: "100%",
  overflow: "scroll",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

type FormValuesProps = {
  name: string;
  help_text: string;
  hidden: boolean;
  model: { label: string; value: number; is_primitive: boolean } | null;
  default: { label: string; value: number } | null;
  defaultString: string;
  nullable?: boolean;
  multiple?: boolean;
};

export default function AddOrEditMetaModelField({
  metaModelId,
  metaField,
  setMetaModel,
  updateMetaModelField,
}: {
  metaModelId?: number;
  metaField?: MetaField;
  setMetaModel?: Function;
  updateMetaModelField: Function;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [modelOptions, setModelOptions] = useState([]);
  const [defaultOptions, setDefaultOptions] = useState<
    { label: string; value: number }[]
  >([]);

  useEffect(() => {
    if (!metaField) {
      jwtFetch(
        null,
        `${apiSettings.apiResourceEndpoints.metamodel_meta_models}`
      ).then((res) => {
        const options = res.map((r: MetaModel) => ({
          label: r.name,
          value: r.id,
          is_primitive: r.is_primitive,
        }));
        setModelOptions(options);
      });
    }
  }, []);

  const defaultValues = {
    name: "",
    help_text: "",
    hidden: false,
    nullable: false,
    multiple: false,
    model: null,
    default: null,
    defaultString: "",
  };

  const NewModelSchema = Yup.object().shape({
    name: Yup.string().required("Nombre requerido"),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewModelSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (metaField) {
      setValue("name", metaField.name);
      setValue("help_text", metaField.help_text || "");
      setValue("hidden", metaField.hidden);
      setValue("nullable", metaField.nullable);
      setValue("multiple", metaField.multiple);
      if (metaField.model) {
        setValue("model", {
          label: metaField.model.name,
          value: metaField.model.id,
          is_primitive: metaField.model.is_primitive,
        });
      }
    }
  }, [open, metaField]);

  useEffect(() => {
    if (values.model !== null && !values.multiple) {
      setDefaultOptions([]);
      setValue("default", null);
      if (!values.model.is_primitive) {
        jwtFetch(
          null,
          `${apiSettings.apiResourceEndpoints.metamodel_instance_models}?models=${values.model.value}`
        ).then((res) => {
          const options = res.map((r: InstanceMetaModel) => ({
            label: r.unicode_representation,
            value: r.id,
          }));
          setDefaultOptions(options);
        });
      } else {
        if (values.model.label === "BooleanField") {
          setDefaultOptions([
            { label: "True", value: 1 },
            { label: "False", value: 0 },
          ]);
        }
      }
    }
  }, [values.model]);

  const closeModal = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = (data: FormValuesProps) => {
    if (typeof metaField === "undefined") {
      // Add
      if (data.model !== null && !data.nullable && !data.multiple) {
        if (
          data.default === null &&
          (!data.model.is_primitive || data.model.label === "BooleanField")
        ) {
          setError("default", { message: "Campo requerido" });
          return;
        } else if (
          data.defaultString === "" &&
          data.model.is_primitive &&
          data.model.label !== "BooleanField"
        ) {
          setError("defaultString", { message: "Campo requerido" });
          return;
        }
      }
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("help_text", data.help_text);
      formData.append("model", data.model ? data.model.value.toString() : "");
      formData.append("hidden", data.hidden.toString());
      formData.append("nullable", data.nullable!.toString());
      formData.append("multiple", data.multiple!.toString());
      if (data.model && !data.nullable && !data.multiple) {
        if (!data.model.is_primitive || data.model.label === "BooleanField") {
          formData.append("default", data.default!.value.toString());
        } else {
          formData.append("default", data.defaultString);
        }
      }
      jwtFetch(
        null,
        `${apiSettings.apiResourceEndpoints.metamodel_meta_models}${metaModelId}/add_field/`,
        {
          method: "post",
          body: formData,
          headers: {
            "Content-Type": null,
          },
        }
      )
        .then((res) => {
          updateMetaModelField(res);
        })
        .catch((_) =>
          enqueueSnackbar("Ocurrió un error creando el Meta Field", {
            variant: "error",
          })
        )
        .finally(() => closeModal());
    } else {
      // Edit
      const body: Record<string, any> = {
        name: data.name,
        help_text: data.help_text,
        hidden: data.hidden,
      };
      jwtFetch(null, metaField.url!, {
        method: "patch",
        body: JSON.stringify(body),
      })
        .then((res) => {
          updateMetaModelField(res);
        })
        .catch((_) =>
          enqueueSnackbar("Ocurrió un error editando el Meta Field", {
            variant: "error",
          })
        )
        .finally(() => closeModal());
    }
  };

  const isOptionEqualToValue = (
    option: { label: string; value: number },
    value: { label: string; value: number }
  ) => {
    return option.value === value.value;
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      setValue(
        "defaultString",
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
    },
    [setValue]
  );

  return (
    <>
      {metaField ? (
        <Link component="button" variant="body2" onClick={() => setOpen(true)}>
          {metaField.name}
        </Link>
      ) : (
        <Button variant="contained" fullWidth onClick={() => setOpen(true)}>
          <AddIcon /> Agregar Field
        </Button>
      )}
      <Modal open={open} onClose={closeModal}>
        <Box sx={style}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5">
              {metaField ? "Editar" : "Agregar Field"}
            </Typography>
            <IconButton onClick={closeModal}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <br />
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} alignItems="start">
              <RHFTextField name="name" label="Nombre" type="string" />
              <RHFTextField name="help_text" label="Help Text" type="string" />
              {!metaField && (
                <Controller
                  name="model"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      multiple={false}
                      isOptionEqualToValue={isOptionEqualToValue}
                      onChange={(_, newValue) => {
                        field.onChange(newValue);
                        setError("default", {});
                      }}
                      options={modelOptions}
                      renderInput={(params) => (
                        <TextField label="Modelo" {...params} />
                      )}
                      fullWidth
                    />
                  )}
                />
              )}
              <RHFCheckbox
                name="hidden"
                label="Hidden"
                labelPlacement="start"
              />
              <Stack direction="row" spacing={3}>
                <RHFCheckbox
                  name="nullable"
                  label="Nullable"
                  labelPlacement="start"
                  disabled={typeof metaField !== "undefined"}
                  sx={{ marginLeft: 0 }}
                />
                {metaField && (
                  <UpdateNullableMetaField
                    metaField={metaField}
                    updateMetaModelField={updateMetaModelField}
                    options={defaultOptions}
                  />
                )}
              </Stack>
              <Stack direction="row" spacing={3}>
                <RHFCheckbox
                  name="multiple"
                  label="Multiple"
                  labelPlacement="start"
                  disabled={typeof metaField !== "undefined"}
                  sx={{ marginLeft: 0 }}
                />
                {!values.multiple && metaField && (
                  <UpdateMultipleMetaField
                    metaField={metaField}
                    updateMetaModelField={updateMetaModelField}
                  />
                )}
              </Stack>
              {!metaField &&
                !(values.nullable || values.multiple) &&
                values.model &&
                (values.model.is_primitive &&
                values.model.label !== "BooleanField" ? (
                  values.model.label === "FileField" ? (
                    <RHFUploadSingleFile
                      name="defaultString"
                      onDrop={(t) => handleDrop(t)}
                    />
                  ) : (
                    <RHFTextField
                      name="defaultString"
                      label="Default"
                      type={
                        values.model.label !== "CharField" ? "number" : "string"
                      }
                    />
                  )
                ) : (
                  <>
                    <Controller
                      name="default"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          multiple={false}
                          disabled={defaultOptions.length === 0}
                          isOptionEqualToValue={isOptionEqualToValue}
                          onChange={(_, newValue) => {
                            field.onChange(newValue);
                          }}
                          renderOption={(props, option) => (
                            <li {...props} key={option.value}>
                              {option.label}
                            </li>
                          )}
                          options={defaultOptions}
                          renderInput={(params) => (
                            <TextField
                              label={
                                defaultOptions.length === 0
                                  ? "Cargando Default ..."
                                  : "Default"
                              }
                              {...params}
                            />
                          )}
                          fullWidth
                        />
                      )}
                    />
                    {errors.default && (
                      <FormHelperText sx={{ px: 2, display: "block" }} error>
                        {(errors.default as any).message}
                      </FormHelperText>
                    )}
                  </>
                ))}
            </Stack>
            <br />
            <Stack spacing={1} direction="row">
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={
                  (!metaField &&
                    !(values.nullable || values.multiple) &&
                    values.model &&
                    !values.model.is_primitive &&
                    defaultOptions.length === 0) ||
                  undefined
                }
              >
                {metaField ? "Guardar" : "Crear"}
              </LoadingButton>
              {metaField && setMetaModel ? (
                <DeleteMetaField
                  metaField={metaField}
                  setMetaModel={setMetaModel}
                />
              ) : (
                <Button color="inherit" variant="outlined" onClick={closeModal}>
                  Cancelar
                </Button>
              )}
            </Stack>
          </FormProvider>
          <br />
        </Box>
      </Modal>
    </>
  );
}
