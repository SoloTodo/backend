import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  FormHelperText,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import * as Yup from "yup";
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { useSnackbar } from "notistack";
import {
  FormProvider,
  RHFTextField,
} from "src/components/hook-form";
import { LoadingButton } from "@mui/lab";
import { Brand } from "src/frontend-utils/types/banner";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import {
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

type FormValuesProps = {
  name: string;
  category: { label: string; value: number } | null;
  brand_1: { label: string; value: number } | null;
  brand_2: { label: string; value: number } | null;
};

export default function AddBrandComparison({ brands }: { brands: Brand[] }) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);

  const context = useContext(ApiFormContext);
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const categories = selectApiResourceObjects(apiResourceObjects, "categories");

  const brandChoices = brands.map((b) => ({
    label: b.name,
    value: b.id,
  }));

  const defaultValues = {
    name: "",
    category: null,
    brand_1: null,
    brand_2: null,
  };

  const NewModelSchema = Yup.object().shape({
    name: Yup.string().required("Nombre requerido"),
    category: Yup.object(),
    brand_1: Yup.object().required("Marca 1 requerida"),
    brand_2: Yup.object().required("Marca 2 requerida"),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewModelSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = (data: FormValuesProps) => {
    jwtFetch(null, apiSettings.apiResourceEndpoints.brand_comparisons, {
      method: "post",
      body: JSON.stringify({
        name: data.name,
        category: data.category!.value,
        brand_1: data.brand_1!.value,
        brand_2: data.brand_2!.value,
      }),
    })
      .then((json) => {
        let array = context.currentResult.results;
        array.pop();
        context.setCurrentResult({
          ...context.currentResult,
          results: [json, ...array],
        });
        reset();
        enqueueSnackbar("Comparación de marcas creada exitosamente");
      })
      .catch(async (error) => {
        const jsonError = await error.json();
        console.error(jsonError);
        enqueueSnackbar("Error al agregar la comparación de marcas", {
          variant: "error",
        });
      });
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
      <Card>
        <CardContent>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            Nueva comparación
          </Button>
        </CardContent>
      </Card>
      <Modal open={open} onClose={closeModal}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Crear nueva Comparación
          </Typography>
          <br />
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <RHFTextField name="name" label="Nombre" type="string" />
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple={false}
                    isOptionEqualToValue={isOptionEqualToValue}
                    onChange={(_, newValue) => {
                      field.onChange(newValue);
                    }}
                    options={categories}
                    renderInput={(params) => (
                      <TextField {...params} label="Categorías" />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.value}>
                        {option.label}
                      </li>
                    )}
                    fullWidth
                  />
                )}
              />
              {errors.category && (
                <FormHelperText sx={{ px: 2, display: "block" }} error>
                  Categoría requerida
                </FormHelperText>
              )}
              <Controller
                name="brand_1"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple={false}
                    isOptionEqualToValue={isOptionEqualToValue}
                    onChange={(_, newValue) => {
                      field.onChange(newValue);
                    }}
                    options={brandChoices}
                    renderInput={(params) => (
                      <TextField {...params} label="Marca 1" />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.value}>
                        {option.label}
                      </li>
                    )}
                    fullWidth
                  />
                )}
              />
              {errors.brand_1 && (
                <FormHelperText sx={{ px: 2, display: "block" }} error>
                  Marca 1 requerida
                </FormHelperText>
              )}
              <Controller
                name="brand_2"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple={false}
                    isOptionEqualToValue={isOptionEqualToValue}
                    onChange={(_, newValue) => {
                      field.onChange(newValue);
                    }}
                    options={brandChoices}
                    renderInput={(params) => (
                      <TextField {...params} label="Marca 2" />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.value}>
                        {option.label}
                      </li>
                    )}
                    fullWidth
                  />
                )}
              />
              {errors.brand_2 && (
                <FormHelperText sx={{ px: 2, display: "block" }} error>
                  Marca 2 requerida
                </FormHelperText>
              )}
            </Stack>
            <br />
            <Stack spacing={1} direction="row">
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                <AddIcon /> Agregar Comparación
              </LoadingButton>
              <Button color="inherit" variant="outlined" onClick={closeModal}>
                Cancelar
              </Button>
            </Stack>
          </FormProvider>
        </Box>
      </Modal>
    </>
  );
}
