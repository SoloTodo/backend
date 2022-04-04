
function path(root: string, sublink: string) {
    return `${root}${sublink}`;
  }

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';
const ROOTS_STORE = '/stores';
const ROOTS_CATEGORY = '/categories';
const ROOTS_ENTITIY = '/entities';
const ROOTS_USER = '/users';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: '/login',
  change_password: path(ROOTS_AUTH, '/change_password'),
  reset_password: path(ROOTS_AUTH, '/reset_password'),
  verify: path(ROOTS_AUTH, '/verify')
};

export const PATH_DASHBOARD = {
  root: path(ROOTS_DASHBOARD, '/one'),
}

export const PATH_STORE = {
  root: ROOTS_STORE,
  all: path(ROOTS_STORE, '/all'),
  update_pricing: path(ROOTS_STORE, '/update_pricing')
}

export const PATH_CATEGORY = {
  root: ROOTS_CATEGORY,
}

export const PATH_ENTITY = {
  root: ROOTS_ENTITIY,
  pending: path(ROOTS_ENTITIY, '/pending'),
  conflicts: path(ROOTS_ENTITIY, '/conflicts'),
  estimated_sales: path(ROOTS_ENTITIY, '/estimated_sales'),
}

export const PATH_USER = {
  root: ROOTS_USER,
}