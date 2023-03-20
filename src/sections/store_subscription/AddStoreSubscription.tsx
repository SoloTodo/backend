import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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
import { FormProvider } from "src/components/hook-form";
import { LoadingButton } from "@mui/lab";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import {
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import { ApiFormPagination } from "src/frontend-utils/api_form/fields/pagination/ApiFormPagination";

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
  store: { label: string; value: number } | null;
  categories: { label: string; value: number }[];
};

export default function AddStoreSubscription() {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);

  const context = useContext(ApiFormContext);
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const categories = selectApiResourceObjects(apiResourceObjects, "categories");
  const stores = selectApiResourceObjects(apiResourceObjects, "stores");

  const field = context.getField("pagination") as ApiFormPagination | undefined;

  const defaultValues = {
    store: null,
    categories: [],
  };

  const NewModelSchema = Yup.object().shape({
    store: Yup.object().required("Tienda requerida"),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewModelSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = (data: FormValuesProps) => {
    if (data.categories.length === 0) {
      setError("categories", { message: "" });
      return;
    }
    jwtFetch(null, apiSettings.apiResourceEndpoints.store_subscriptions, {
      method: "post",
      body: JSON.stringify({
        store: data.store!.value,
        categories: data.categories.map((c) => c.value),
      }),
    })
      .then((json) => {
        let array = context.currentResult.results;
        if (
          context.currentResult.results.length === field?.cleanedData?.page_size
        ) {
          array.pop();
        }
        context.setCurrentResult({
          ...context.currentResult,
          count: context.currentResult.count + 1,
          results: [json, ...array],
        });
        reset();
        enqueueSnackbar("Suscripción a tienda creada exitosamente");
      })
      .catch(async (error) => {
        const jsonError = await error.json();
        console.error(jsonError);
        enqueueSnackbar("Error al agregar la suscripción a tienda", {
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
            Nueva suscripción a tienda
          </Button>
        </CardContent>
      </Card>
      <Modal open={open} onClose={closeModal}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Crear nueva Suscripción a tienda
          </Typography>
          <br />
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Controller
                name="store"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple={false}
                    isOptionEqualToValue={isOptionEqualToValue}
                    onChange={(_, newValue) => {
                      field.onChange(newValue);
                    }}
                    options={stores}
                    renderInput={(params) => (
                      <TextField {...params} label="Tienda" />
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
              {errors.store && (
                <FormHelperText sx={{ px: 2, display: "block" }} error>
                  Tienda requerida
                </FormHelperText>
              )}
              <Controller
                name="categories"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple={true}
                    isOptionEqualToValue={isOptionEqualToValue}
                    onChange={(_, newValue) => {
                      field.onChange(newValue);
                    }}
                    options={categories}
                    renderInput={(params) => (
                      <TextField {...params} label="Categorías" />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option.value}
                          size="small"
                          label={option.label}
                        />
                      ))
                    }
                    fullWidth
                  />
                )}
              />
              {errors.categories && (
                <FormHelperText sx={{ px: 2, display: "block" }} error>
                  Al menos una categoría requerida
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
                <AddIcon /> Agregar Suscripción a tienda
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
