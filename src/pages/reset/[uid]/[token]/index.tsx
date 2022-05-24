import { ReactElement, useState } from "react";
import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { styled } from "@mui/material/styles";
import { Container, IconButton, InputAdornment, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// hooks
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useAuth } from "src/frontend-utils/nextjs/JWTContext";
//components
import Layout from "src/layouts";
import Page from "src/components/Page";
import { Box } from "@mui/system";
import { FormProvider, RHFTextField } from "../../../../components/hook-form";
//routes
import { PATH_AUTH } from "src/routes/paths";
import Iconify from "src/components/Iconify";
import {fetchJson} from "../../../../frontend-utils/network/utils";

// ----------------------------------------------------------------------

NewPassword.getLayout = function getLayout(page: ReactElement) {
  return <Layout variant="logoOnly">{page}</Layout>;
};

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  display: "flex",
  minHeight: "100%",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

type FormValuesProps = {
  new_password1: string;
  new_password2: string;
};

export default function NewPassword() {
  const router = useRouter();
  const { enqueueSnackbar } =  useSnackbar();
  const { authFetch } = useAuth();

  const [showPasswordNew1, setShowPasswordNew1] = useState(false);
  const [showPasswordNew2, setShowPasswordNew2] = useState(false);

  const ChangePassWordSchema = Yup.object().shape({
    new_password1: Yup.string()
      .required("Nueva contraseña requerida"),
    new_password2: Yup.string().oneOf(
      [Yup.ref("new_password1"), null],
      "Nueva contraseña debe coincidir"
    ),
  });

  const defaultValues = {
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

  const query = router.query;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await fetchJson("rest-auth/password/reset/confirm/", {
        headers: {},
        method: "post",
        body: JSON.stringify({ ...data, ...query }),
      });
      reset();
      enqueueSnackbar("Contraseña cambiada exitosamente!");
      await router.push(PATH_AUTH.login);
    } catch (error) {
      const json = await error.json();
      if ("token" in json)
        enqueueSnackbar("Expiró el token para crear una nueva contraseña. Solicite la recuperación de clave nuevamente.", { variant: "error" });
      else if ("new_password2" in json)
        enqueueSnackbar(json["new_password2"], { variant: "error" });
      console.error(error);
    }
  };

  return ( 
    <Page title="Nueva Contraseña">
      <RootStyle>
        <Container>
          <Box sx={{ maxWidth: 480, mx: "auto" }}>
            <Typography variant="h3">
              Establecer Nueva Contraseña
            </Typography>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3} alignItems="flex-end">
                <RHFTextField
                  name="new_password1"
                  label="Nueva Contraseña"
                  type={showPasswordNew1 ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPasswordNew1(!showPasswordNew1)}
                          edge="end"
                        >
                          <Iconify
                            icon={
                              showPasswordNew1 ? "eva:eye-fill" : "eva:eye-off-fill"
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <RHFTextField
                  name="new_password2"
                  label="Confirmar Nueva Contraseña"
                  type={showPasswordNew2 ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPasswordNew2(!showPasswordNew2)}
                          edge="end"
                        >
                          <Iconify
                            icon={
                              showPasswordNew2 ? "eva:eye-fill" : "eva:eye-off-fill"
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >Guardar cambios</LoadingButton>
              </Stack>
            </FormProvider>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  )
}