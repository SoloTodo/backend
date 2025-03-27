import {ReactElement} from "react";
import NextLink from "next/link";
import {
  Button,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Link,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Layout from "src/layouts";
// hooks
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
// types
import {Entity} from "src/frontend-utils/types/entity";
import { Category } from "src/frontend-utils/types/store";
// components
import CategorySelect from "src/components/my_components/CategorySelect";
import ConditionSelect from "src/components/my_components/ConditionSelect";
import VisibilitySwitch from "src/components/my_components/VisibilitySwitch";
// paths
import { PATH_PRODUCT } from "src/routes/paths";
import EntitySecInfoComponent from "./EntitySecInfoComponent";
import { useState } from "react";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";

// ----------------------------------------------------------------------

AssociateInformation.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function AssociateInformation({
  entity,
  setEntity
}: {
  entity: Entity;
  setEntity: Function;
}) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const hasStaffPermission = (
    apiResourceObjects[entity.category] as Category
  ).permissions.includes("is_category_staff");

  const [reason, setReason] = useState("");
  const [openAssociationModel, setOpenAssociationModel] = useState(false);
  const handleOpenAssociationModal = () => setOpenAssociationModel(true);
  const handleCloseAssociationModal = () => {
    setOpenAssociationModel(false);
    setReason("");
  };

  const handleDissociate = async () => {
    await jwtFetch(null, `${entity.url}dissociate/`, {
      method: "post",
      body: JSON.stringify({ reason: reason }),
    })
      .then((data) => {
        setEntity(data);
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReason(event.target.value);
  };

  const dissociateModalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Card>
      <CardHeader title="Información" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Nombre</Typography>
            <Typography>{entity.name}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Condición</Typography>
            <ConditionSelect
              entity={entity}
              hasStaffPermission={hasStaffPermission}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Tienda</Typography>
            <Typography>{apiResourceObjects[entity.store].name}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Categoría</Typography>
            <CategorySelect
              entity={entity}
              setEntity={setEntity}
              hasStaffPermission={hasStaffPermission}
            />
          </Grid>
         
          <Grid item xs={12} md={6}>
            <Typography variant="h6">URL</Typography>
            <Typography>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={entity.external_url}
              >
                {entity.external_url}
              </Link>
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Producto actual</Typography>
            <Box sx={{display: 'flex'}}>
            <Typography>
              {entity.product ? (
                <NextLink
                  href={`${PATH_PRODUCT.root}/${entity.product.id}`}
                  passHref
                >
                  <Link>{entity.product.name}</Link>
                </NextLink>
              ) : (
                "N/A"
              )}
            </Typography>
            {entity.product && (
              <>
                <Button sx={{marginLeft: "10px", padding: "0px 10px"}} variant="contained" size="small" onClick={handleOpenAssociationModal}>
                  Disociar
                </Button>
                <Modal
                  open={openAssociationModel}
                  onClose={handleCloseAssociationModal}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={dissociateModalStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                      Confirme disociación de la entidad
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      Por favor confirme la disociación de la entidad
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      Esta entidad fue asociada por un usuario distinto. Si es posible
                      por favor deje un mensaje para el/ella especificando el motivo
                      para disociar la entidad.
                    </Typography>
                    <br />
                    <TextField
                      id="reasons"
                      label="Motivo de la disociación (opcional)"
                      multiline
                      rows={3}
                      value={reason}
                      onChange={handleChange}
                      style={{ width: "100%" }}
                    />
                    <br />
                    <br />
                    <Stack
                      direction="row"
                      justifyContent="flex-end"
                      divider={<Divider orientation="vertical" flexItem />}
                      spacing={2}
                    >
                      <Button
                        variant="contained"
                        onClick={handleDissociate}
                      >
                        Disociar
                      </Button>
                      <Button variant="contained" onClick={handleCloseAssociationModal}>
                        Cancelar
                      </Button>
                    </Stack>
                  </Box>
                </Modal>
              </>
            )}
          </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">¿Visible?</Typography>
            <VisibilitySwitch
              entity={entity}
              hasStaffPermission={hasStaffPermission}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Plan celular actual</Typography>
            <Typography>
              {entity.cell_plan ? (
                <NextLink
                  href={`${PATH_PRODUCT.root}/${entity.cell_plan.id}`}
                  passHref
                >
                  <Link>{entity.cell_plan.name}</Link>
                </NextLink>
              ) : (
                "N/A"
              )}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <EntitySecInfoComponent entity={entity} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Bundle actual</Typography>
            <Typography>{entity.bundle ? entity.bundle.name : "N/A"}</Typography>
          </Grid>
          {entity.cell_plan_name && (
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Nombre plan celular</Typography>
              <Typography>{entity.cell_plan_name}</Typography>
            </Grid>
          )}
          {entity.seller && (
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Vendedor</Typography>
              <Typography>{entity.seller}</Typography>
            </Grid>
          )}
          {entity.part_number && (
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Part number</Typography>
              <Typography>{entity.part_number}</Typography>
            </Grid>
          )}
          {entity.ean && (
            <Grid item xs={12} md={6}>
              <Typography variant="h6">EAN</Typography>
              <Typography>{entity.ean}</Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}
