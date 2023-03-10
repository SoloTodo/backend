import {
  Box,
  Button,
  Card,
  CardContent,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import * as Yup from "yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { useSnackbar } from "notistack";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";
import { LoadingButton } from "@mui/lab";
import { Brand } from "src/frontend-utils/types/banner";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import {
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";

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
  category: string;
  brand_1: string;
  brand_2: string;
};

export default function AddBrandComparison({
  brands,
}: {
  brands: Brand[];
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);

  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const categories = selectApiResourceObjects(apiResourceObjects, "categories");

  const brandChoices = brands.map((b) => ({
    label: b.name,
    value: b.id,
  }));

  const defaultValues = {
    name: "",
    category: "",
    brand_1: "",
    brand_2: "",
  };

  const NewModelSchema = Yup.object().shape({
    name: Yup.string().required("Nombre requerido"),
    category: Yup.string().required("Categoría requerida"),
    brand_1: Yup.string().required("Marca 1 requerida"),
    brand_2: Yup.string().required("Marca 2 requerida"),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewModelSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data: FormValuesProps) => {
    jwtFetch(null, apiSettings.apiResourceEndpoints.brand_comparisons, {
      method: "post",
      body: JSON.stringify(data),
    })
      .then((json) => {
        // addNewBrandComparison(json);
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
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Crear nueva Comparación
          </Typography>
          <br />
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <RHFTextField name="name" label="Nombre" type="string" />
              <RHFSelect name="category" label="Categoría">
                <option value=""></option>
                {categories.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect name="brand_1" label="Marca 1">
                <option value=""></option>
                {brandChoices.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect name="brand_2" label="Marca 2">
                <option value=""></option>
                {brandChoices.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
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
              <Button
                color="inherit"
                variant="outlined"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
            </Stack>
          </FormProvider>
        </Box>
      </Modal>
    </>
  );
}
