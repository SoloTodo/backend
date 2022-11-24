import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { MetaField, MetaModel } from "src/frontend-utils/types/metamodel";
import MetaModelInstanceForm from "./MetaModelInstanceForm";
import CloseIcon from "@mui/icons-material/Close";

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

export default function MetaModelInstanceModal({
  metaField,
}: {
  metaField: MetaField;
}) {
  const [open, setOpen] = useState(false);
  const [metaModel, setMetaModel] = useState<MetaModel>();

  useEffect(() => {
    jwtFetch(null, `metamodels/meta_models/${metaField.model.id}/`).then(
      (json) => {
        setMetaModel(json);
      }
    );
    // if (instanceModelId) {
    //   jwtFetch(null, `metamodels/instance_models/${instanceModelId}/`).then(
    //     (json) => {
    //       setInstanceModel(json);
    //     }
    //   );
    // }
  }, [open]);

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Agregar
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5">Agregar Instancia</Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <br />
          {metaModel && <MetaModelInstanceForm metaModel={metaModel} />}
        </Box>
      </Modal>
    </>
  );
}
