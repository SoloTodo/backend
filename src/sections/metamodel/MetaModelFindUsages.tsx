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
import { MetaField, MetaModel } from "src/frontend-utils/types/metamodel";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import CustomTable from "../CustomTable";
import { GridColumns } from "@mui/x-data-grid";
import { PATH_METAMODEL } from "src/routes/paths";

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

export default function MetaModelFindUsages({
  metaModel,
}: {
  metaModel: MetaModel;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usages, setUsages] = useState<MetaField[]>([]);

  const openModal = () => {
    setLoading(true);
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.metamodel_meta_fields}?models=${metaModel.id}`
    )
      .then((res) => setUsages(res))
      .finally(() => setLoading(false));
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const columns: GridColumns<MetaField> = [
    {
      headerName: "Field",
      field: "name",
    },
    {
      headerName: "Model",
      field: "model.name",
      renderCell: (params) => (
        <NextLink
          href={`${PATH_METAMODEL.models}/${params.row.parent.id}/edit`}
          passHref
        >
          <Link onClick={closeModal}>{params.row.parent.name}</Link>
        </NextLink>
      ),
    },
  ];

  return (
    <>
      <Button variant="contained" fullWidth onClick={openModal}>
        Encontrar Usos
      </Button>
      <Modal open={open} onClose={closeModal}>
        <Box sx={style}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5">Encontrar Usos</Typography>
            <IconButton onClick={closeModal}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <br />
          {loading ? (
            <Box textAlign="center">
              <CircularProgress color="inherit" />
            </Box>
          ) : usages.length !== 0 ? (
            <CustomTable data={usages} columns={columns} />
          ) : (
            <Typography>
              <i>Sin usos encontrados</i>
            </Typography>
          )}
        </Box>
      </Modal>
    </>
  );
}
