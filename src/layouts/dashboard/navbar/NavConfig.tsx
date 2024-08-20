// components
import SvgIconStyle from "../../../components/SvgIconStyle";
import StoreIcon from "@mui/icons-material/Store";
import InboxIcon from "@mui/icons-material/Inbox";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ExploreIcon from "@mui/icons-material/Explore";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import StorageIcon from "@mui/icons-material/Storage";
import CompareIcon from "@mui/icons-material/Compare";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StorefrontIcon from "@mui/icons-material/Storefront";
import KeyIcon from "@mui/icons-material/Key";
import SellIcon from "@mui/icons-material/Sell";
// routes
import {
  PATH_ALERT,
  PATH_BANNERS,
  PATH_BRAND_COMPARISONS,
  PATH_CATEGORY,
  PATH_ENTITY,
  PATH_KEYWORD,
  PATH_METAMODEL,
  PATH_MICROSITE,
  PATH_PRODUCT,
  PATH_RATING,
  PATH_REPORTS,
  PATH_STORE,
  PATH_STORE_SUBSCRIPTION,
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
  storage: <StorageIcon />,
  compare: <CompareIcon />,
  alert: <NotificationsIcon />,
  storeFront: <StorefrontIcon />,
  key: <KeyIcon />,
  sell: <SellIcon />,
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
        icon: ICONS.dashboard,
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
            hasPermission: "solotodo.backend_list_entities",
          },
          {
            title: "Pendientes",
            path: PATH_ENTITY.pending,
            hasPermission: "solotodo.backend_view_pending_entities",
          },
          {
            title: "Conflictos",
            path: PATH_ENTITY.conflicts,
            hasPermission: "solotodo.backend_view_entity_conflicts",
          },
        ],
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
          },
          {
            title: "Campos pendientes",
            path: PATH_PRODUCT.pending_fields,
            hasPermission: "solotodo.is_category_staff",
          },
        ],
      },
      {
        title: "Comparación de marcas",
        path: "-",
        icon: ICONS.compare,
        hasPermission: "brand_comparisons.backend_list_brand_comparisons",
        children: [
          {
            title: "Todos",
            path: PATH_BRAND_COMPARISONS.root,
            hasPermission: "brand_comparisons.backend_list_brand_comparisons",
          },
        ],
      },
      {
        title: "Sitios",
        path: PATH_MICROSITE.root,
        icon: ICONS.sell,
        hasPermission: "microsite.pricing_view_microsite",
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
        title: "Alertas",
        path: PATH_ALERT.root,
        icon: ICONS.alert,
        hasPermission: "deactivated_section",
      },
      {
        title: "Suscripción a tiendas",
        path: PATH_STORE_SUBSCRIPTION.root,
        icon: ICONS.storeFront,
        hasPermission: "deactivated_section",
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
          },
        ],
      },
      {
        title: "Banner Visibility",
        path: "-",
        icon: ICONS.visibility,
        hasPermission: "banners.backend_list_banners",
        children: [
          {
            title: "Banners",
            path: PATH_BANNERS.banners,
            hasPermission: "banners.backend_list_banners",
          },
          {
            title: "Assets",
            path: PATH_BANNERS.assets,
            hasPermission: "banners.is_staff_of_banner_assets",
          },
          {
            title: "Assets pendientes",
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
          {
            title: "Active Participation",
            path: PATH_BANNERS.activeParticipation,
            hasPermission: "banners.backend_list_banners",
          },
          {
            title: "Historic Participation",
            path: PATH_BANNERS.historicParticipation,
            hasPermission: "banners.backend_list_banners",
          },
        ],
      },
      {
        title: "Keyword Visibility",
        path: "-",
        icon: ICONS.key,
        hasPermission: "keyword_search_positions.backend_list_keyword_searches",
        children: [
          {
            title: "Búsquedas",
            path: PATH_KEYWORD.root,
            hasPermission:
              "keyword_search_positions.backend_list_keyword_searches",
          },
          {
            title: "Reporte actual",
            path: PATH_KEYWORD.report,
            hasPermission:
              "keyword_search_positions.backend_list_keyword_searches",
          },
        ],
      },
      {
        title: "Metamodel",
        path: PATH_METAMODEL.models,
        icon: ICONS.storage,
        hasPermission: "is_staff",
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
            hasPermission: "solotodo.backend_list_users",
          },
          {
            title: "Mi usuario",
            path: `${PATH_USER.root}/me`,
            hasPermission: "solotodo.view_users_with_staff_actions",
          },
        ],
      },
    ],
  },
];

export default sidebarConfig;
