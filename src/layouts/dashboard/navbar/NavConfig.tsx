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
      {
        title: "Dashboard",
        path: "/",
        icon: ICONS.dashboard
      },
      {
        title: "Tiendas",
        path: "-",
        icon: ICONS.store,
        children: [
          {
            title: "Todas",
            path: PATH_STORE.root,
            hasPermission: "solotodo.backend_list_stores",
          },
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
        hasPermission: "solotodo.backend_list_entities",
        children: [
          {
            title: "Todas",
            path: PATH_ENTITY.root,
            hasPermission: "solotodo.backend_list_entities"
          },
          {
            title: "Pendientes",
            path: PATH_ENTITY.pending,
            hasPermission: "solotodo.backend_view_pending_entities"
          },
          {
            title: "Conflictos",
            path: PATH_ENTITY.conflicts,
            hasPermission: "solotodo.backend_view_entity_conflicts"
          },
        ]
      },
      {
        title: "Productos",
        path: "-",
        icon: ICONS.ecommerce,
        hasPermission: "solotodo.backend_list_products",
        children: [
            {
              title: "Todos",
              path: PATH_PRODUCT.root,
              hasPermission: "solotodo.backend_list_products",
            }
        ],
      },
      {
        title: "Ratings",
        path: "-",
        icon: ICONS.thumbUp,
        hasPermission: "solotodo.backend_list_ratings",
        children: [
          {
            title: "Todos",
            path: PATH_RATING.root,
            hasPermission: "solotodo.backend_list_ratings",
          },
          {
            title: "Pendientes",
            path: PATH_RATING.pending,
            hasPermission: "solotodo.is_ratings_staff",
          },
        ],
      },
      {
        title: "Donde Comprar",
        path: "-",
        icon: ICONS.explore,
        hasPermission: "wtb.backend_view_wtb",
        children: [
          {
            title: "Marcas",
            path: PATH_WTB.brands,
            hasPermission: "wtb.backend_view_wtb",
          },
          {
            title: "Entidades",
            path: PATH_WTB.entities,
            hasPermission: "wtb.backend_view_wtb",
          },
          {
            title: "Entidades pendientes",
            path: PATH_WTB.pending,
            hasPermission: "wtb.backend_view_pending_wtb_entities",
          },
        ],
      },
      {
        title: "Reportes",
        path: "-",
        icon: ICONS.fileDownload,
        hasPermission: "reports.backend_list_reports",
        children: [
            {
              title: "Todos",
              path: PATH_REPORTS.root,
              hasPermission: "reports.backend_list_reports",
            }
        ],
      },
      {
        title: "Banner Visibility",
        path: "-",
        icon: ICONS.visibility,
        hasPermission: "banners.is_staff_of_banner_assets",
        children: [
          {
            title: "Banners",
            path: PATH_BANNERS.banners,
            hasPermission: "banners.is_staff_of_banner_assets",
          },
          { title: "Assets",
            path: PATH_BANNERS.assets,
            hasPermission: "banners.is_staff_of_banner_assets",
          },
          { title: "Assets pendientes",
            path: PATH_BANNERS.assetsPending,
            hasPermission: "banners.is_staff_of_banner_assets",
          },
          {
            title: "Actualizaciones",
            path: PATH_BANNERS.updates,
            hasPermission: "banners.is_staff_of_banner_assets",
          },
          {
            title: "Últimas actualizaciones",
            path: PATH_BANNERS.updatesLatest,
            hasPermission: "banners.is_staff_of_banner_assets",
          },
        ],
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
        hasPermission: "solotodo.backend_list_users",
        children: [
          {
            title: "Todos",
            path: PATH_USER.root,
            requiredPermission: "solotodo.backend_list_users",
          },
          {
            title: "Mi usuario",
            path: `${PATH_USER.root}/me`,
            requiredPermission: "solotodo.view_users_with_staff_actions",
          },
        ],
      },
    ],
  },
];

export default sidebarConfig;
