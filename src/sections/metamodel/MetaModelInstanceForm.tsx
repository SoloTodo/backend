import { LoadingButton } from "@mui/lab";
import { capitalize, Grid, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { FormProvider } from "src/components/hook-form";
import {
  InstanceMetaModel,
  MetaModel,
} from "src/frontend-utils/types/metamodel";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import InstanceInput from "./InstanceInput";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { useRouter } from "next/router";
import { BaseSyntheticEvent, useEffect } from "react";
import { PATH_METAMODEL } from "src/routes/paths";

type FormProps = {
  [key: string]: any;
};

export default function MetaModelInstanceForm({
  metaModel,
  instanceModel,
  addChoice,
  editChoice,
}: {
  metaModel: MetaModel;
  instanceModel?: InstanceMetaModel;
  addChoice?: Function;
  editChoice?: Function;
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
    setValue,
  } = methods;

  useEffect(() => {
    instanceModel?.fields?.map((f) => {
      if (!f.field.model.is_primitive) {
        if (f.field.multiple) {
          // TODO: FIX MULTIPLE VALUES PER FIELD
          setValue(f.field.name, [
            {
              value: f.value.id,
              label: f.value.unicode_representation,
            },
          ]);
        } else {
          setValue(f.field.name, {
            value: f.value.id,
            label: f.value.unicode_representation,
          });
        }
      } else if (
        ["IntegerField", "DecimalField"].includes(f.field.model.name)
      ) {
        setValue(f.field.name, f.value.decimal_value);
      } else {
        setValue(f.field.name, f.value.unicode_value);
      }
    });
  }, []);

  const onSubmit = (
    data: FormProps,
    e: BaseSyntheticEvent<object, any, any> | undefined
  ) => {
    if (
      e?.target.getElementsByClassName("metaModelId")[0].id !==
      metaModel.id.toString()
    ) {
      e?.stopPropagation();
      return;
    }
    const formData = new FormData();
    Object.keys(data).map((a) => {
      if (Array.isArray(data[a])) {
        data[a].map((v: { value: string | Blob }) =>
          formData.append(a, v.value)
        );
      } else if (data[a] !== null && data[a].value) {
        formData.append(a, data[a].value);
      } else {
        if (data[a] !== null) {
          formData.append(a, data[a]);
        }
      }
    }, {});
    const path = instanceModel
      ? `${apiSettings.apiResourceEndpoints.metamodel_instance_models}${instanceModel.id}/edit/`
      : `${apiSettings.apiResourceEndpoints.metamodel_meta_models}${metaModel.id}/add_instance/`;
    jwtFetch(null, path, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": null,
      },
    }).then((json) => {
      if (addChoice) {
        addChoice(json);
      } else if (editChoice) {
        editChoice(json);
      } else {
        router.push(`${PATH_METAMODEL.models}/${metaModel.id}`);
      }
    });
  };

  return (
    <FormProvider
      key={metaModel.id.toString()}
      methods={methods}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div id={metaModel.id.toString()} className="metaModelId" />
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
              <InstanceInput
                metaField={f}
                control={control}
                setValue={setValue}
              />
            </Grid>
          </Grid>
        ))}
      </Stack>
      <br />
      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
        {!instanceModel ? <AddIcon /> : <EditIcon />}{" "}
        {!instanceModel ? "Agregar" : "Editar"} Instancia
      </LoadingButton>
    </FormProvider>
  );
}
