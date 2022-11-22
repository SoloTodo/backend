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
import { FormProvider, RHFTextField } from "src/components/hook-form";
import { LoadingButton } from "@mui/lab";

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
  unicode_template: string;
  ordering_field: string;
};

export default function AddMetaModel({ addNewModel }: { addNewModel: Function }) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);

  const defaultValues = {
    name: "",
    unicode_template: "",
    ordering_field: "",
  };

  const NewModelSchema = Yup.object().shape({
    name: Yup.string().required("Nombre requerida"),
    unicode_template: Yup.string().required("Unicode template requerido"),
    ordering_field: Yup.string().required("Orden requerido"),
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
    jwtFetch(null, apiSettings.apiResourceEndpoints.metamodel_meta_models, {
      method: "post",
      body: JSON.stringify(data),
    })
      .then((json) => {
        addNewModel(json);
        reset();
        enqueueSnackbar("Meta modelo creado exitosamente");
      })
      .catch(async (error) => {
        const jsonError = await error.json();
        console.error(jsonError);
        enqueueSnackbar(jsonError.errors.percentage[0], { variant: "error" });
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
            Nuevo Modelo
          </Button>
        </CardContent>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Crear nuevo Meta Modelo
          </Typography>
          <br />
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <RHFTextField name="name" label="Nombre" type="string" />
              <RHFTextField
                name="unicode_template"
                label="Unicode template"
                type="string"
              />
              <RHFTextField
                name="ordering_field"
                label="Ordening field"
                type="string"
              />
            </Stack>
            <br />
            <Stack spacing={1} direction="row">
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                <AddIcon /> Agregar Meta Modelo
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
