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
import { StoreScrapingOptions } from "src/frontend-utils/types/store";

// ----------------------------------------------------------------------

type FormValuesProps = {
  async: boolean;
  discover_urls_concurrency: number;
  products_for_url_concurrency: number;
  categories: string[];
};

// ----------------------------------------------------------------------

export default function UpdateStorePricingForm({ store_scraping_options }: { store_scraping_options: StoreScrapingOptions }) {
  const UpdateSchema = Yup.object().shape({});

  const CATEGORIES: string[] = store_scraping_options.categories;

  const defaultValues = {
    async: store_scraping_options.prefer_async,
    discover_urls_concurrency: store_scraping_options.discover_urls_concurrency,
    products_for_url_concurrency: store_scraping_options.products_for_url_concurrency,
    categories: store_scraping_options.categories,
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(UpdateSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  return (
    <Card>
      <CardHeader title="Actualizar" />
      <CardContent>
        <FormProvider methods={methods} onSubmit={() => {}}>
          <Stack spacing={3}>
            <RHFCheckbox name="async" label="¿Usar asincronía?" />
            <RHFTextField
              name="discover_urls_concurrency"
              label="Concurrencia para descubrimiento de URLs"
            />
            <RHFTextField
              name="products_for_url_concurrency"
              label="Concurrencia para scraping de productos"
            />
            <Controller
              name="categories"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  multiple
                  onChange={(event, newValue) => field.onChange(newValue)}
                  options={CATEGORIES.map((option) => option)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option}
                        size="small"
                        label={option}
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
            >
              Actualizar
            </LoadingButton>
          </Stack>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
