function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = "/auth";
const ROOTS_DASHBOARD = "/";
const ROOTS_STORE = "/stores";
const ROOTS_CATEGORY = "/categories";
const ROOTS_ENTITIY = "/entities";
const ROOTS_USER = "/users";
const ROOTS_PRODUCT = "/products";
const ROOTS_VISIT = "/visits";
const ROOTS_RATING = "/ratings";
const ROOTS_WTB = "/wtb";
const ROOTS_REPORTS = "/reports";
const ROOTS_BANNERS = "/banners";
const ROOTS_METAMODEL = "/metamodel";
const ROOTS_BRAND_COMPARISONS = "/brand_comparisons";
const ROOTS_ALERT = "/alerts";
const ROOTS_STORE_SUBSCRIPTION = "/store_subscriptions";
const ROOTS_KEYWORD = "/keyword_searches";
const ROOTS_MICROSITE = "/microsites";

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: "/login",
  change_password: path(ROOTS_AUTH, "/change_password"),
  reset_password: path(ROOTS_AUTH, "/reset_password"),
  verify: path(ROOTS_AUTH, "/verify"),
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
};

export const PATH_STORE = {
  root: ROOTS_STORE,
  all: path(ROOTS_STORE, "/all"),
  update_pricing: path(ROOTS_STORE, "/update_pricing"),
  section_positions_update_logs: path(ROOTS_STORE, "/section_positions_update_logs"),
};

export const PATH_CATEGORY = {
  root: ROOTS_CATEGORY,
};

export const PATH_ENTITY = {
  root: ROOTS_ENTITIY,
  pending: path(ROOTS_ENTITIY, "/pending"),
  conflicts: path(ROOTS_ENTITIY, "/conflicts"),
  estimated_sales: path(ROOTS_ENTITIY, "/estimated_sales"),
};

export const PATH_USER = {
  root: ROOTS_USER,
};

export const PATH_PRODUCT = {
  root: ROOTS_PRODUCT,
  pending_fields: path(ROOTS_PRODUCT, "/pending_fields"),
};

export const PATH_VISIT = {
  root: ROOTS_VISIT,
};

export const PATH_RATING = {
  root: ROOTS_RATING,
  pending: path(ROOTS_RATING, "/pending"),
};

export const PATH_WTB = {
  root: ROOTS_WTB,
  brands: path(ROOTS_WTB, "/brands"),
  entities: path(ROOTS_WTB, "/entities"),
  pending: path(ROOTS_WTB, "/entities/pending"),
};

export const PATH_REPORTS = {
  root: ROOTS_REPORTS,
};

export const PATH_BANNERS = {
  banners: ROOTS_BANNERS,
  assets: path(ROOTS_BANNERS, "/assets"),
  assetsPending: path(ROOTS_BANNERS, "/assets/pending"),
  updates: path(ROOTS_BANNERS, "/updates"),
  updatesLatest: path(ROOTS_BANNERS, "/updates/latest"),
  activeParticipation: path(ROOTS_BANNERS, "/active_participation"),
  historicParticipation: path(ROOTS_BANNERS, "/historic_participation"),
};

export const PATH_METAMODEL = {
  metamodel: ROOTS_METAMODEL,
  models: path(ROOTS_METAMODEL, "/models"),
  instances: path(ROOTS_METAMODEL, "/instances"),
};
export const PATH_BRAND_COMPARISONS = {
  root: ROOTS_BRAND_COMPARISONS,
};

export const PATH_ALERT = {
  root: ROOTS_ALERT,
};

export const PATH_STORE_SUBSCRIPTION = {
  root: ROOTS_STORE_SUBSCRIPTION,
};

export const PATH_KEYWORD = {
  root: ROOTS_KEYWORD,
  report: path(ROOTS_KEYWORD, "/active_report"),
  updates: "/keyword_search_updates",
};

export const PATH_MICROSITE = {
  root: ROOTS_MICROSITE,
};
