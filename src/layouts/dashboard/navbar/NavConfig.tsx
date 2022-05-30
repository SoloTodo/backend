// components
import SvgIconStyle from "../../../components/SvgIconStyle";
import StoreIcon from "@mui/icons-material/Store";
import InboxIcon from "@mui/icons-material/Inbox";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ExploreIcon from "@mui/icons-material/Explore";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import VisibilityIcon from "@mui/icons-material/Visibility";
// routes
import {
  PATH_BANNERS,
  PATH_CATEGORY,
  PATH_ENTITY,
  PATH_PRODUCT,
  PATH_RATING,
  PATH_REPORTS,
  PATH_STORE,
  PATH_USER,
  PATH_WTB,
} from "src/routes/paths";

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  user: getIcon("ic_user"),
  ecommerce: getIcon("ic_ecommerce"),
  analytics: getIcon("ic_analytics"),
  dashboard: getIcon("ic_dashboard"),
  cart: getIcon("ic_cart"),
  store: <StoreIcon />,
  inbox: <InboxIcon />,
  thumbUp: <ThumbUpIcon />,
  explore: <ExploreIcon />,
  fileDownload: <FileDownloadIcon />,
  visibility: <VisibilityIcon />,
};

const sidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: "general",
    items: [
      { title: "Dashboard", path: "/", icon: ICONS.dashboard },
      {
        title: "Tiendas",
        path: "-",
        icon: ICONS.store,
        children: [
          { title: "Todas", path: PATH_STORE.root },
          {
            title: "Actualizar",
            path: PATH_STORE.update_pricing,
            hasPermission: "solotodo.update_store_pricing",
          },
        ],
        hasPermission: "solotodo.backend_list_stores",
      },
      {
        title: "Categorías",
        path: "-",
        icon: ICONS.cart,
        children: [{ title: "Todas", path: PATH_CATEGORY.root }],
        hasPermission: "solotodo.backend_list_categories",
      },
      {
        title: "Entidades",
        path: "-",
        icon: ICONS.inbox,
        children: [
          { title: "Todas", path: PATH_ENTITY.root },
          { title: "Pendientes", path: PATH_ENTITY.pending },
          { title: "Conflictos", path: PATH_ENTITY.conflicts },
        ],
        hasPermission: "solotodo.backend_list_entities",
      },
      {
        title: "Productos",
        path: "-",
        icon: ICONS.ecommerce,
        children: [{ title: "Todos", path: PATH_PRODUCT.root }],
        hasPermission: "solotodo.backend_list_products",
      },
      {
        title: "Ratings",
        path: "-",
        icon: ICONS.thumbUp,
        children: [
          { title: "Todos", path: PATH_RATING.root },
          { title: "Pendientes", path: PATH_RATING.pending },
        ],
        hasPermission: "solotodo.backend_list_ratings",
      },
      {
        title: "Donde Comprar",
        path: "-",
        icon: ICONS.explore,
        children: [
          { title: "Marcas", path: PATH_WTB.brands },
          { title: "Entidades", path: PATH_WTB.entities },
          { title: "Entidades pendientes", path: PATH_WTB.pending },
        ],
      },
      {
        title: "Reportes",
        path: "-",
        icon: ICONS.fileDownload,
        children: [{ title: "Todos", path: PATH_REPORTS.root }],
        hasPermission: "solotodo.view_category_reports",
      },
      {
        title: "Banner Visibility",
        path: "-",
        icon: ICONS.visibility,
        children: [
          { title: "Banners", path: PATH_BANNERS.banners },
          { title: "Assets", path: PATH_BANNERS.assets },
          { title: "Assets pendientes", path: PATH_BANNERS.assetsPending },
          { title: "Actualizaciones", path: PATH_BANNERS.updates },
          {
            title: "Últimas actualizaciones",
            path: PATH_BANNERS.updatesLatest,
          },
        ],
        hasPermission: "solotodo.view_store_banners",
      },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: "management",
    items: [
      {
        title: "users",
        path: "-",
        icon: ICONS.user,
        children: [
          { title: "Todos", path: PATH_USER.root },
          { title: "Mi usuario", path: `${PATH_USER.root}/me` },
        ],
        hasPermission: "solotodo.backend_list_users",
      },
    ],
  },
];

export default sidebarConfig;
