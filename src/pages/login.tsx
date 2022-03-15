import * as Yup from "yup";
import { useState } from "react";
// import { capitalCase } from "change-case";
// next
import NextLink from 'next/link';
// @mui
import { styled } from "@mui/material/styles";
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Card,
  Container,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  //   Tooltip,
  Typography,
} from "@mui/material";
// components
import Page from "src/components/Page";
import Logo from "src/components/Logo";
import Image from "src/components/Image";
import Iconify from "src/components/Iconify";
// hooks
import useResponsive from "src/hooks/useResponsive";
import { FormProvider, RHFCheckbox, RHFTextField } from "src/components/hook-form";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const HeaderStyle = styled("header")(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: "100%",
  display: "flex",
  alignItems: "center",
  position: "absolute",
  padding: theme.spacing(3),
  justifyContent: "space-between",
  [theme.breakpoints.up("md")]: {
    alignItems: "flex-start",
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 464,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
  password: string;
  remember: boolean;
  afterSubmit?: string;
};

// ----------------------------------------------------------------------

export default function Login() {
  const mdUp = useResponsive("up", "md");

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const defaultValues = {
    email: "demo@minimals.cc",
    password: "demo1234",
    remember: true,
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

//   const errors = { afterSubmit: { message: "hola" } };
  const onSubmit = () => {};

  return (
    <Page title="Login">
      <RootStyle>
        <HeaderStyle>
          <Logo />
        </HeaderStyle>
        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hola, Bienvenido devuelta
            </Typography>
            <Image
              src="https://minimal-assets-api.vercel.app/assets/illustrations/illustration_login.png"
              alt="login"
            />
          </SectionStyle>
        )}
        <Container maxWidth="sm">
          <ContentStyle>
            <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  Ingresar a SoloTodo
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  Usar credenciales de ingreso.
                </Typography>
              </Box>

              {/* <Tooltip title={capitalCase(method)} placement="right">
                <>
                  <Image
                    disabledEffect
                    alt={method}
                    src={`https://minimal-assets-api.vercel.app/assets/icons/auth/ic_${method}.png`}
                    sx={{ width: 32, height: 32 }}
                  />
                </>
              </Tooltip> */}
            </Stack>

            {/* <Alert severity="info" sx={{ mb: 3 }}>
              Use email : <strong>demo@minimals.cc</strong> / password :
              <strong> demo1234</strong>
            </Alert> */}

            {/* <LoginForm /> */}
            <FormProvider methods={methods} onSubmit={onSubmit}>
              <Stack spacing={3}>
                {!!errors.afterSubmit && (
                  <Alert severity="error">{errors.afterSubmit.message}</Alert>
                )}

                <RHFTextField name="email" label="Email address" />

                <RHFTextField
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          <Iconify
                            icon={
                              showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ my: 2 }}
              >
                <RHFCheckbox name="remember" label="Remember me" />
                <NextLink href={'#'} passHref>
                  <Link variant="subtitle2">Forgot password?</Link>
                </NextLink>
              </Stack>

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
            >
                Login
            </LoadingButton>
            </FormProvider>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
