import { LoadingButton } from "@mui/lab";
import { capitalize, Grid, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { FormProvider } from "src/components/hook-form";
import { MetaModel } from "src/frontend-utils/types/metamodel";
import AddIcon from "@mui/icons-material/Add";
import InstanceInput from "./InstanceInput";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { useRouter } from "next/router";

type FormProps = {
  [key: string]: any;
};

export default function MetaModelInstanceForm({
  metaModel,
}: {
  metaModel: MetaModel;
}) {
  const router = useRouter();

  const defaultValues = metaModel.fields?.reduce((acc: FormProps, a) => {
    if (!a.model.is_primitive) {
      if (a.multiple) {
        acc[a.name] = [];
      } else {
        acc[a.name] = null;
      }
    } else if (a.model.name === "BooleanField") {
      acc[a.name] = false;
    } else {
      acc[a.name] = "";
    }
    return acc;
  }, {});

  const methods = useForm({
    defaultValues: defaultValues,
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data: FormProps, e: any) => {
    console.log(metaModel.id);
    console.log(e);
    const payload = Object.keys(data).reduce((acc: FormProps, a) => {
      if (Array.isArray(data[a])) {
        acc[a] = data[a].map((v: { value: any }) => v.value);
      } else if (typeof data[a] === "object" && data[a] !== null) {
        acc[a] = data[a].value;
      } else {
        acc[a] = data[a] !== null ? data[a] : "";
      }
      return acc;
    }, {});
    console.log(payload);
    // jwtFetch(
    //   null,
    //   `${apiSettings.apiResourceEndpoints.metamodel_meta_models}${metaModel.id}/add_instance/`,
    //   {
    //     method: "post",
    //     body: JSON.stringify(payload),
    //   }
    // ).then((_) =>
    //   router.push(
    //     `${apiSettings.apiResourceEndpoints.metamodel_meta_models}${metaModel.id}`
    //   )
    // );
  };

  return (
    <FormProvider
      key={metaModel.id.toString()}
      methods={methods}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack spacing={3}>
        {metaModel.fields?.map((f, index) => (
          <Grid key={index} container alignItems="center">
            <Grid key={`name-${index}`} item xs={4}>
              <Typography fontWeight={500}>{capitalize(f.name)}</Typography>
              <Typography color="text.secondary" variant="body2">
                {f.help_text}
              </Typography>
            </Grid>
            <Grid key={`field-${index}`} item xs={8}>
              <InstanceInput metaField={f} control={control} />
            </Grid>
          </Grid>
        ))}
      </Stack>
      <br />
      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
        <AddIcon /> Agregar Instancia
      </LoadingButton>
    </FormProvider>
  );
}
