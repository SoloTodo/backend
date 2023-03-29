import { PATH_PRODUCT, PATH_RATING } from "src/routes/paths";
import Options from "../Options";
import { Option } from "src/frontend-utils/types/extras";
import { Product } from "src/frontend-utils/types/product";
import { apiSettings } from "src/frontend-utils/settings";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { Category } from "src/frontend-utils/types/store";
import { Dialog, DialogContent, DialogTitle, Link } from "@mui/material";
import { useState } from "react";
import { JSONTree } from "react-json-tree";
import { useSnackbar } from "notistack";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import AddAlertModal from "./AddAlertModal";

export default function OptionsMenu({ product }: { product: Product }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [openModal, setOpenModal] = useState(false);
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const baseRoute = `${PATH_PRODUCT.root}/${product.id}`;

  const clone = () => {
    const key = enqueueSnackbar("Clonando, por favor espere!", {
      persist: true,
      variant: "info",
    });
    jwtFetch(null, product.url + "clone/", {
      method: "POST",
    }).then((data) => {
      closeSnackbar(key);
      const clonedInstanceId = data.instance_id;
      const clonedInstanceUrl = `${apiSettings.endpoint}metamodel/instances/${clonedInstanceId}`;
      window.open(clonedInstanceUrl, "_blank");
    });
  };

  const options: Option[] = [
    {
      text: "Historial pricing",
      path: `${baseRoute}/pricing_history`,
    },
    {
      text: "Ratings",
      path: `${PATH_RATING.root}/products=${product.id}`,
      hasPermission: (
        apiResourceObjects[product.category] as Category
      ).permissions.includes("solotodo.backend_list_ratings"),
    },
    {
      text: "Entidades asociadas",
      path: `${baseRoute}/entities`,
      hasPermission: (
        apiResourceObjects[product.category] as Category
      ).permissions.includes("is_category_staff"),
    },
    {
      text: "Entidades WTB asociadas",
      path: `${baseRoute}/wtb_entities`,
      hasPermission: (
        apiResourceObjects[product.category] as Category
      ).permissions.includes("is_category_staff"),
    },
    {
      text: "Editar",
      path: `${apiSettings.endpoint}metamodel/instances/${product.instance_model_id}`,
      hasPermission: (
        apiResourceObjects[product.category] as Category
      ).permissions.includes("is_category_staff"),
    },
    {
      text: "Fusionar",
      path: `${baseRoute}/fuse`,
      hasPermission: (
        apiResourceObjects[product.category] as Category
      ).permissions.includes("is_category_staff"),
    },
    {
      text: "Clonar",
      path: `${baseRoute}/clone`,
      hasPermission: (
        apiResourceObjects[product.category] as Category
      ).permissions.includes("is_category_staff"),
      renderObject: (
        <Link
          component="button"
          variant="body1"
          onClick={clone}
          style={{ textAlign: "start" }}
        >
          Clonar
        </Link>
      ),
    },
    {
      text: "Especificaciones (como JSON)",
      path: `${baseRoute}/clone`,
      hasPermission: (
        apiResourceObjects[product.category] as Category
      ).permissions.includes("is_category_staff"),
      renderObject: (
        <>
          <Link
            component="button"
            variant="body1"
            onClick={() => setOpenModal(true)}
            style={{ textAlign: "start" }}
          >
            Especificaciones (como JSON)
          </Link>
          <Dialog
            open={openModal}
            onClose={() => setOpenModal(false)}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            scroll="paper"
            maxWidth="lg"
          >
            <DialogTitle id="scroll-dialog-title">Especificaciones</DialogTitle>
            <DialogContent>
              <JSONTree data={product.specs} theme="default" />
            </DialogContent>
          </Dialog>
        </>
      ),
    },
    {
      text: "Ver en sitio",
      path: `${baseRoute}/ver`,
      renderObject: (
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={`https://www.solotodo.cl/products/${product.id}`}
        >
          Ver en SoloTodo
        </Link>
      ),
    },
    {
      text: "",
      path: "",
      renderObject: <AddAlertModal product={product} />,
    },
  ];

  return <Options options={options} defaultKey="text" />;
}
