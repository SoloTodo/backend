import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Link,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import NextLink from "next/link";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { InstanceMetaField } from "src/frontend-utils/types/metamodel";
import { PATH_METAMODEL } from "src/routes/paths";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";

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

export default function DeleteInstance({
  metaModelId,
  instanceModelId,
}: {
  metaModelId: string;
  instanceModelId: string;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dependencies, setDependencies] = useState<InstanceMetaField[]>([]);

  const openModal = () => {
    setLoading(true);
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.metamodel_instance_models}${instanceModelId}/get_dependencies`
    )
      .then((res) => setDependencies(res))
      .finally(() => setLoading(false));
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    setSubmitting(true);
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.metamodel_instance_models}${instanceModelId}`,
      {
        method: "delete",
      }
    ).then((_) => {
      router.push(`${PATH_METAMODEL.models}/${metaModelId}`);
      enqueueSnackbar("Se ha eliminado correctamente");
    });
  };

  return (
    <>
      <Button variant="contained" color="error" onClick={openModal}>
        Eliminar
      </Button>
      <Modal open={open} onClose={closeModal}>
        <Box sx={style}>
          <Stack spacing={3}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h5">Eliminar Instnacia</Typography>
              <IconButton onClick={closeModal}>
                <CloseIcon />
              </IconButton>
            </Stack>
            {loading ? (
              <Box textAlign="center">
                <CircularProgress color="inherit" />
              </Box>
            ) : dependencies.length !== 0 ? (
              <Stack spacing={2}>
                <Typography>
                  Para eliminar este modelo primero debes eliminar las
                  siguientes dependencias:
                </Typography>
                <Stack paddingLeft={2}>
                  {dependencies.map((d, index) => (
                    <NextLink
                      key={index}
                      href={`${PATH_METAMODEL.instances}/${d.parent.id}/edit`}
                      passHref
                    >
                      <Link
                        onClick={closeModal}
                      >{`${d.parent.unicode_representation} >> ${d.field.name}`}</Link>
                    </NextLink>
                  ))}
                </Stack>
              </Stack>
            ) : (
              <Typography>
                ¿Estás seguro que quieres eliminar este modelo? Este proceso es
                irreversible
              </Typography>
            )}
            <Stack spacing={1} direction="row">
              <LoadingButton
                color="error"
                variant="contained"
                loading={submitting}
                disabled={dependencies.length !== 0}
                onClick={handleDelete}
              >
                Eliminar
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
