// components
import SvgIconStyle from "../../../components/SvgIconStyle";
import StoreIcon from "@mui/icons-material/Store";
import InboxIcon from "@mui/icons-material/Inbox";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ExploreIcon from '@mui/icons-material/Explore';
// routes
import {
  PATH_CATEGORY,
  PATH_ENTITY,
  PATH_PRODUCT,
  PATH_RATING,
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
};

const sidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: "general v3.0.0",
    items: [
      { title: "Dashboard", path: "/dashboard/one", icon: ICONS.dashboard },
      {
        title: "Tiendas",
        path: "-",
        icon: ICONS.store,
        children: [
          { title: "Todas", path: PATH_STORE.root },
          { title: "Actualizar", path: PATH_STORE.update_pricing },
        ],
      },
      {
        title: "Categorías",
        path: "-",
        icon: ICONS.cart,
        children: [{ title: "Todas", path: PATH_CATEGORY.root }],
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
      },
      {
        title: "Productos",
        path: "-",
        icon: ICONS.ecommerce,
        children: [
          { title: "Todos", path: PATH_PRODUCT.root },
        ],
      },
      {
        title: "Ratings",
        path: "-",
        icon: ICONS.thumbUp,
        children: [
          { title: "Todos", path: PATH_RATING.root },
          { title: "Pendientes", path: PATH_RATING.pending },
        ],
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
      },
    ],
  },
];

export default sidebarConfig;
