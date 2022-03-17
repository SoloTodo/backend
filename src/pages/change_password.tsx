import { ReactElement } from "react";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { Stack, Card, Container, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
import { FormProvider, RHFTextField } from "../components/hook-form";
import Page from "src/components/Page";
import Layout from "src/layouts";
import { useAuth } from "src/frontend-utils/nextjs/JWTContext";

// ----------------------------------------------------------------------

ChangePassword.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

type FormValuesProps = {
  old_password: string;
  new_password1: string;
  new_password2: string;
};

export default function ChangePassword() {
  const { enqueueSnackbar } = useSnackbar();
  const { authFetch } = useAuth();

  const ChangePassWordSchema = Yup.object().shape({
    old_password: Yup.string().required("Contraseña antigua requerida"),
    new_password1: Yup.string()
      .required("Nueva contraseña requerida"),
    new_password2: Yup.string().oneOf(
      [Yup.ref("new_password1"), null],
      "Nueva contraseña debe coincidir"
    ),
  });

  const defaultValues = {
    old_password: "",
    new_password1: "",
    new_password2: "",
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await authFetch("rest-auth/password/change/", {
        headers: {},
        method: "post",
        body: JSON.stringify(data),
      });
      reset();
      enqueueSnackbar("Contraseña cambiada exitosamente!");
    } catch (error) {
      const json = await error.json();
      if ("old_password" in json)
        enqueueSnackbar("Contraseña actual equivocada", { variant: "error" });
      else if ("new_password2" in json)
        enqueueSnackbar(json["new_password2"], { variant: "error" });
      console.error(error);
    }
  };

  return (
    <Page title="Cambiar Contraseña">
      <Container>
        <Card sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" paragraph>
            Cambiar Contraseña
          </Typography>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3} alignItems="flex-end">
              <RHFTextField
                name="old_password"
                type="password"
                label="Antigua Contraseña"
              />

              <RHFTextField
                name="new_password1"
                type="password"
                label="Nueva Contraseña"
              />

              <RHFTextField
                name="new_password2"
                type="password"
                label="Confirmar Nueva Contraseña"
              />

              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Guardar cambios
              </LoadingButton>
            </Stack>
          </FormProvider>
        </Card>
      </Container>
    </Page>
  );
}
