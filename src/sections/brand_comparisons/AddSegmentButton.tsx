import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { BrandComparison } from "src/frontend-utils/types/brand_comparison";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { Box, Button, Modal, Stack, Typography } from "@mui/material";
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
};

export default function AddSegmentButton({
  brandComparison,
  onComparisonChange,
}: {
  brandComparison: BrandComparison;
  onComparisonChange: Function;
}) {
  const [open, setOpen] = useState(false);

  const defaultValues = {
    name: "",
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
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = (data: FormValuesProps) => {
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.brand_comparisons}${brandComparison.id}/add_segment/`,
      {
        method: "post",
        body: JSON.stringify({
          name: data.name,
        }),
      }
    ).then((_) => {
      onComparisonChange();
      reset();
    });
    setOpen(false);
  };

  const closeModal = () => {
    reset();
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
      >
        Nuevo segmento
      </Button>
      <Modal open={open} onClose={closeModal}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Añadir segmento
          </Typography>
          <br />
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <RHFTextField name="name" label="Nombre" type="string" />
              <Stack spacing={1} direction="row">
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  <AddIcon /> Agregar Segmento
                </LoadingButton>
                <Button color="inherit" variant="outlined" onClick={closeModal}>
                  Cancelar
                </Button>
              </Stack>
            </Stack>
          </FormProvider>
        </Box>
      </Modal>
    </>
  );
}
