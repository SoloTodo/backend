import {
  Autocomplete,
  Box,
  Button,
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
import { useEffect, useState } from "react";
import {
  FormProvider,
  RHFCheckbox,
  RHFTextField,
} from "src/components/hook-form";
import * as Yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MetaField, MetaModel } from "src/frontend-utils/types/metamodel";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "100%", md: "70%" },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

type FormValuesProps = {
  name: string;
  help_text: string;
  hidden: boolean;
  model: { label: string; value: number } | null;
  default: { label: string; value: number } | null;
  nullable?: boolean;
  multiple?: boolean;
};

export default function AddOrEditMetaModelField({
  metaField,
  updateMetaModel,
}: {
  metaField?: MetaField;
  updateMetaModel: Function;
}) {
  const [open, setOpen] = useState(false);
  const [modelOptions, setModelOptions] = useState([]);
  const [defaultOptions, setDefaultOptions] = useState([]);

  useEffect(() => {
    if (!metaField) {
      jwtFetch(
        null,
        `${apiSettings.apiResourceEndpoints.metamodel_meta_models}`
      ).then((res) => {
        const options = res.map((r: MetaModel) => ({
          label: r.name,
          value: r.id,
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
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (metaField) {
      setValue("name", metaField.name);
      setValue("help_text", metaField.help_text || "");
      setValue("hidden", metaField.hidden);
      setValue("nullable", metaField.nullable);
      setValue("multiple", metaField.multiple);
    }
  }, [open, metaField]);

  useEffect(() => {
    // TODO: check conditions, model is not primitive and bring options
  }, [values.model]);

  const onSubmit = (data: FormValuesProps) => {
    console.log(data);
    // jwtFetch(null, metaModel.url, {
    //   method: "PATCH",
    //   body: JSON.stringify(data),
    // })
    //   .then((json) => {
    //     updateMetaModelProperties(json);
    //     reset();
    //     enqueueSnackbar("Meta modelo creado exitosamente");
    //   })
    //   .catch(async (error) => {
    //     const jsonError = await error.json();
    //     console.error(jsonError);
    //     enqueueSnackbar("Error al modifica el meta modelo", {
    //       variant: "error",
    //     });
    //   });
    setOpen(false);
  };

  const closeModal = () => {
    reset();
    setOpen(false);
  };

  const isOptionEqualToValue = (
    option: { label: string; value: number },
    value: { label: string; value: number }
  ) => {
    return option.value === value.value;
  };

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
              <RHFCheckbox
                name="nullable"
                label="Nullable"
                labelPlacement="start"
                disabled={typeof metaField !== "undefined"}
              />
              <RHFCheckbox
                name="multiple"
                label="Multiple"
                labelPlacement="start"
                disabled={typeof metaField !== "undefined"}
              />
              {!metaField && !(values.nullable || values.multiple) && (
                <Controller
                  name="default"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      multiple={false}
                      isOptionEqualToValue={isOptionEqualToValue}
                      onChange={(_, newValue) => {
                        field.onChange(newValue);
                      }}
                      options={defaultOptions}
                      renderInput={(params) => (
                        <TextField label="Default" {...params} />
                      )}
                      fullWidth
                    />
                  )}
                />
              )}
            </Stack>
            <br />
            <Stack spacing={1} direction="row">
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                {metaField ? "Guardar" : "Crear"}
              </LoadingButton>
              <Button color="inherit" variant="outlined" onClick={closeModal}>
                Cancelar
              </Button>
            </Stack>
          </FormProvider>
          <br />
        </Box>
      </Modal>
    </>
  );
}
