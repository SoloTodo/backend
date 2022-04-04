import * as Yup from "yup";
import {
  Autocomplete,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Stack,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
// form
import {
  FormProvider,
  RHFCheckbox,
  RHFTextField,
} from "src/components/hook-form";
// hooks
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// types
import {
  Category,
  StoreScrapingOptions as FormValuesProps,
} from "src/frontend-utils/types/store";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { PATH_STORE } from "src/routes/paths";

export default function UpdateStorePricingForm({
  store_scraping_options,
  store_ids,
  multi,
}: {
  store_scraping_options: FormValuesProps;
  store_ids: number[];
  multi?: boolean;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const UpdateSchema = Yup.object().shape({});

  const defaultValues = {
    ...store_scraping_options,
    categories: [],
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(UpdateSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    const send_data = {
      ...data,
      categories: data.categories.map((c: Category) => c.id.toString()),
    };

    for (const id of store_ids) {
      await jwtFetch(
        null,
        `${apiSettings.apiResourceEndpoints.stores}${id}/update_pricing/`,
        {
          method: "POST",
          body: JSON.stringify(send_data),
        }
      )
        .then((res) => {
          console.log(res);
          enqueueSnackbar("Actualización de tienda encolada exitosamente");
          if (!multi) router.push(`${PATH_STORE.root}/${id}/update_logs`);
        })
        .catch((err) => {
          console.log(err);
          reset();
          enqueueSnackbar(
            "Error al ejecutar la petición, por favor intente de nuevo",
            { variant: "error" }
          );
        });
    }
  };

  return (
    <Card>
      <CardHeader title={multi ? "Parámetros" : "Actualizar"} />
      <CardContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <RHFCheckbox name="prefer_async" label="¿Usar asincronía?" />
            {!multi ? (
              <>
                <RHFTextField
                  name="discover_urls_concurrency"
                  label="Concurrencia para descubrimiento de URLs"
                />
                <RHFTextField
                  name="products_for_url_concurrency"
                  label="Concurrencia para scraping de productos"
                />
              </>
            ) : null}
            <Controller
              name="categories"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  multiple
                  getOptionLabel={(option) => option.name}
                  onChange={(_event, newValue) => field.onChange(newValue)}
                  options={store_scraping_options.categories}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option.id}
                        size="small"
                        label={option.name}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField label="Categorías" {...params} />
                  )}
                />
              )}
            />
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ my: 2 }}
          >
            <LoadingButton
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
              disabled={multi && store_ids.length == 0 ? true : false}
            >
              Actualizar {multi ? `(${store_ids.length})` : ""}
            </LoadingButton>
          </Stack>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
function enqueueSnackbar(arg0: string) {
  throw new Error("Function not implemented.");
}
