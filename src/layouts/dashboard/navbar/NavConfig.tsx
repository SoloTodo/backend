// components
import SvgIconStyle from '../../../components/SvgIconStyle';
import StoreIcon from '@mui/icons-material/Store';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  user: getIcon('ic_user'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  store: <StoreIcon />
};

const sidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general v3.0.0',
    items: [
      { title: 'Dashboard', path: '/dashboard/one', icon: ICONS.dashboard },
      { title: 'Tiendas', path: '/dashboard/two', icon: ICONS.store },
      { title: 'Categorías', path: '/dashboard/three', icon: ICONS.analytics },
      { title: 'Productos', path: '/dashboard/four', icon: ICONS.ecommerce },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      {
        title: 'user',
        path: '/dashboard/user',
        icon: ICONS.user,
        children: [
          { title: 'Four', path: '/dashboard/user/four' },
          { title: 'Five', path: '/dashboard/user/five' },
          { title: 'Six', path: '/dashboard/user/six' },
        ],
      },
    ],
  },
];

export default sidebarConfig;
