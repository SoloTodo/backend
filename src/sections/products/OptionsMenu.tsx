import { useRouter } from "next/router";
import { PATH_PRODUCT, PATH_RATING, PATH_VISIT } from "src/routes/paths";
import Options from "../Options";
import { Option } from "src/frontend-utils/types/extras";
import { Product, Website } from "src/frontend-utils/types/product";
import { apiSettings } from "src/frontend-utils/settings";
import { useAppSelector } from "src/store/hooks";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { Category } from "src/frontend-utils/types/store";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Link,
  Menu,
  MenuItem,
  Modal,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { JSONTree } from "react-json-tree";

// const style = {
//   position: "absolute" as "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: '80%',
//   height: '80%',
//   bgcolor: "background.paper",
//   border: "2px solid #000",
//   boxShadow: 24,
//   p: 4,
// };

export default function OptionsMenu({
  product,
  websites,
}: {
  product: Product;
  websites: Website[];
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openModal, setOpenModal] = useState(false);
  const openMenu = Boolean(anchorEl);
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const router = useRouter();
  const id = router.query.id;
  const baseRoute = `${PATH_PRODUCT.root}/${id}`;

  const clone = () => {};

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const options: Option[] = [
    {
      text: "Historial pricing",
      path: `${baseRoute}/pricing_history`,
    },
    // {
    //   text: "Visitas (listado)",
    //   path: `${PATH_VISIT.root}/?products=${id}`,
    //   hasPermission: (
    //     apiResourceObjects[product.category] as Category
    //   ).permissions.includes("view_category_visits"),
    // },
    // {
    //   text: "Visitas (estadísticas)",
    //   path: `${PATH_VISIT.root}/stats?grouping=date&products=${id}`,
    //   hasPermission: (
    //     apiResourceObjects[product.category] as Category
    //   ).permissions.includes("view_category_visits"),
    // },
    {
      text: "Ratings",
      path: `${PATH_RATING.root}/products=${id}`,
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
        <>
          <Button
            id="basic-button"
            variant="contained"
            aria-controls={openMenu ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? "true" : undefined}
            onClick={handleClick}
            style={{ textAlign: "start" }}
          >
            Ver en sitio
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={() => setAnchorEl(null)}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {websites.map((w) => (
              <MenuItem key={w.id}>
                <Button
                  href={`${w.external_url}/products/${product.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ width: "100%", height: "100%" }}
                >
                  {w.name}
                </Button>
              </MenuItem>
            ))}
          </Menu>
        </>
      ),
    },
  ];

  return <Options options={options} defaultKey="text" />;
}
