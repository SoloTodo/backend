import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
// hooks
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
// paths
import { apiSettings } from "src/frontend-utils/settings";
import { PATH_ENTITY } from "src/routes/paths";
// types
import { Entity } from "src/frontend-utils/types/entity";
import { Option } from "src/frontend-utils/types/extras";
import { Category, Store } from "src/frontend-utils/types/store";
// components
import Options from "../Options";

export default function UpdatePricingInformation({
  entity,
  setEntity,
}: {
  entity: Entity;
  setEntity: Function;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const hasStaffPermission = (
    apiResourceObjects[entity.category] as Category
  ).permissions.includes("is_category_staff");
  const baseRoute = `${PATH_ENTITY.root}/${entity.id}`;

  const createAlert = () => {
    const store = apiResourceObjects[entity.store];
    const data = {
      stores: [store.id],
      product: entity.product!.id,
    };
    jwtFetch(null, apiSettings.apiResourceEndpoints.alerts, {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((_) => {
        enqueueSnackbar("Alerta creada exitosamente");
      })
      .catch((err) => {
        enqueueSnackbar(
          "Error al crear la alerta, por favor intente de nuevo",
          { variant: "error" }
        );
      });
  };

  const options: Option[] = [
    {
      key: 1,
      text: "Eventos",
      path: `${baseRoute}/events`,
    },
    {
      key: 2,
      text: "Historial pricing",
      path: `${baseRoute}/pricing_history`,
    },
    {
      key: 3,
      text: "Historial posicionamiento",
      path: `${baseRoute}/position_history`,
    },
    {
      key: 4,
      text: "",
      path: "",
      hasPermission: (
        apiResourceObjects[entity.category] as Category
      ).permissions.includes("view_category_reports"),
      renderObject: entity.product ? (
        <Button variant="contained" onClick={createAlert}>
          Crear alerta
        </Button>
      ) : <></>,
    },
  ];

  if (hasStaffPermission)
    options.splice(3, 0, {
      key: 5,
      text: "Asociar",
      path: `${baseRoute}/associate`,
    });

  const handleUpdatePricing = () => {
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.entities}${entity.id}/update_pricing/`,
      {
        method: "POST",
      }
    )
      .then((data) => {
        setEntity(data);
        enqueueSnackbar(
          "La información de pricing ha sido actualizada y debiera mostrarse en los paneles inferiores. Si está incorrecta por favor contacte a nuestro staff",
          { persist: true }
        );
      })
      .catch((err) => {
        enqueueSnackbar(
          "Error al ejecutar la petición, por favor intente de nuevo",
          { variant: "error" }
        );
      });
  };

  return (
    <>
      <Stack spacing={2}>
        <Options options={options} />
        <Card>
          <CardHeader title="Actualizar información" />
          <CardContent>
            <Stack spacing={2}>
              <Typography>
                Obtiene la información actualizada de la entidad desde el sitio
                de la tienda
              </Typography>
              <Button
                variant="contained"
                onClick={handleUpdatePricing}
                disabled={
                  !(
                    hasStaffPermission ||
                    (
                      apiResourceObjects[entity.store] as Store
                    ).permissions.includes("update_store_pricing") ||
                    (
                      apiResourceObjects[entity.category] as Category
                    ).permissions.includes("update_category_entities_pricing")
                  )
                }
              >
                Actualizar información
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </>
  );
}
