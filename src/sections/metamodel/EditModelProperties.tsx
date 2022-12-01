import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MetaModel } from "src/frontend-utils/types/metamodel";
import CloseIcon from "@mui/icons-material/Close";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { useSnackbar } from "notistack";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import { LoadingButton } from "@mui/lab";

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
  unicode_template: string;
  ordering_field: string;
};

export default function EditModelProperties({
  metaModel,
  updateMetaModelProperties,
}: {
  metaModel: MetaModel;
  updateMetaModelProperties: Function;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);

  const defaultValues = {
    name: "",
    unicode_template: "",
    ordering_field: "",
  };

  const NewModelSchema = Yup.object().shape({
    name: Yup.string().required("Nombre requerido"),
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
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    setValue("name", metaModel.name);
    if (metaModel.unicode_template)
      setValue("unicode_template", metaModel.unicode_template);
    if (metaModel.ordering_field)
      setValue("ordering_field", metaModel.ordering_field);
  }, [open]);

  const onSubmit = (data: FormValuesProps) => {
    jwtFetch(null, metaModel.url, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
      .then((json) => {
        updateMetaModelProperties(json);
        reset();
        enqueueSnackbar("Meta modelo creado exitosamente");
      })
      .catch(async (error) => {
        const jsonError = await error.json();
        console.error(jsonError);
        enqueueSnackbar("Error al modifica el meta modelo", {
          variant: "error",
        });
      });
    setOpen(false);
  };

  const closeModal = () => {
    reset();
    setOpen(false);
  };

  return (
    <>
      <Button variant="contained" fullWidth onClick={() => setOpen(true)}>
        Editar Propiedades
      </Button>
      <Modal open={open} onClose={closeModal}>
        <Box sx={style}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5">Editar Propiedades</Typography>
            <IconButton onClick={closeModal}>
              <CloseIcon />
            </IconButton>
          </Stack>
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
                Guardar
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
