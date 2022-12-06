import {
  Autocomplete,
  Box,
  Button,
  FormHelperText,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useCallback, useState } from "react";
import { MetaField } from "src/frontend-utils/types/metamodel";
import { LoadingButton } from "@mui/lab";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { UploadSingleFile } from "src/components/upload";
import { apiSettings } from "src/frontend-utils/settings";

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

export default function UpdateNullableMetaField({
  metaField,
  updateMetaModelField,
  options,
}: {
  metaField: MetaField;
  updateMetaModelField: Function;
  options: { label: string; value: number }[];
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [missingValue, setMissingValue] = useState(false);
  const [defaultString, setDefaultString] = useState("");
  const [defaultOption, setDefaultOption] = useState<{
    label: string;
    value: number;
  } | null>(null);

  const closeModal = () => {
    setOpen(false);
  };

  const handleNullable = () => {
    const formData = new FormData();
    if (!metaField.nullable) {
      formData.append("nullable", "true");
    } else {
      if (!metaField.multiple) {
        if (
          !metaField.model.is_primitive ||
          metaField.model.name === "BooleanField"
        ) {
          if (!defaultOption) {
            setMissingValue(true);
            return;
          }
          formData.append("default", defaultOption.value.toString());
        } else {
          if (defaultString === "") {
            setMissingValue(true);
            return;
          }
          formData.append("default", defaultString);
        }
      }
    }
    const url = !metaField.nullable
      ? metaField.url
      : `${apiSettings.apiResourceEndpoints.metamodel_meta_fields}${metaField.id}/make_non_nullable/`;
    setLoading(true);
    jwtFetch(null, url!, {
      method: !metaField.nullable ? "patch" : "post",
      body: formData,
      headers: {
        "Content-Type": null,
      },
    })
      .then((res) => {
        updateMetaModelField(res);
        setOpen(false);
      })
      .finally(() => setLoading(false));
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      setDefaultString(
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
    },
    [setDefaultString]
  );

  const isOptionEqualToValue = (
    option: { label: string; value: number },
    value: { label: string; value: number }
  ) => {
    return option.value === value.value;
  };

  return (
    <>
      <Button variant="outlined" color="info" onClick={() => setOpen(true)}>
        {metaField.nullable ? "Hacer no Nullable" : "Hacer Nullable"}
      </Button>
      <Modal open={open} onClose={closeModal}>
        <Box sx={style}>
          <Stack spacing={2}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h5">
                {metaField.nullable ? "Hacer no Nullable" : "Hacer Nullable"}
              </Typography>
              <IconButton onClick={closeModal}>
                <CloseIcon />
              </IconButton>
            </Stack>
            <Typography>
              Desde esta interfaz, puedes marcar un campo como{" "}
              {metaField.nullable ? "no " : ""} nullable, de modo que las
              instancias futuras de este campo {metaField.nullable ? "no " : ""}
              se puedan dejar en blanco en sus formularios.
            </Typography>
            {metaField.nullable &&
              !metaField.multiple &&
              (metaField.model.is_primitive &&
              metaField.model.name !== "BooleanField" ? (
                metaField.model.name === "FileField" ? (
                  <UploadSingleFile
                    accept="image/*"
                    file={defaultString}
                    onDrop={(t) => handleDrop(t)}
                  />
                ) : (
                  <TextField
                    label="Default"
                    type={
                      metaField.model.name !== "CharField" ? "number" : "string"
                    }
                    value={defaultString}
                    onChange={(e) => {
                      setMissingValue(false);
                      setDefaultString(e.target.value);
                    }}
                  />
                )
              ) : (
                <Autocomplete
                  multiple={false}
                  options={options}
                  isOptionEqualToValue={isOptionEqualToValue}
                  renderOption={(props, option) => (
                    <li {...props} key={option.value}>
                      {option.label}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      label={
                        options.length === 0
                          ? "Cargando Default ..."
                          : "Default"
                      }
                      {...params}
                    />
                  )}
                  value={defaultOption}
                  onChange={(_, newValue) => {
                    setMissingValue(false);
                    setDefaultOption(newValue);
                  }}
                  fullWidth
                />
              ))}
            {missingValue && (
              <FormHelperText sx={{ px: 2, display: "block" }} error>
                Campo es requerido
              </FormHelperText>
            )}
            <Stack spacing={1} direction="row">
              <LoadingButton
                onClick={handleNullable}
                variant="contained"
                loading={loading}
              >
                {metaField.nullable
                  ? "Marcar Meta Field no Nullable"
                  : "Marcar Meta Field Nullable"}
              </LoadingButton>
              <Button color="inherit" variant="outlined" onClick={closeModal}>
                Cancelar
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
