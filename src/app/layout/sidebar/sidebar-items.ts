import { RouteInfo } from './sidebar.metadata';
export const ROUTES: RouteInfo[] = [
  {
    path: '',
    title: 'MENUITEMS.MAIN.TEXT',
    iconType: '',
    icon: '',
    class: '',
    groupTitle: true,
    badge: '',
    badgeClass: '',
    role: ['All'],
    submenu: [],
  },

  // Admin Modules
  {
    path: '/admin/dashboard/main',
    title: 'Panel',
    iconType: 'material-icons-two-tone',
    icon: 'space_dashboard',
    class: '',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    role: ['Admin'],
    submenu: [],
  },

  {
    path: '/admin/admin-materiales',
    title: 'Materiales',
    iconType: 'material-icons-two-tone',
    icon: 'category',
    class: '',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    role: ['Admin'],
    submenu: [],
  },
  {
    path: '/admin/admin-centros',
    title: 'Periodos',
    iconType: 'material-icons-two-tone',
    icon: 'date_range',
    class: '',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    role: ['Admin'],
    submenu: [],
  },
  {
    path: '/admin/admin-solicitudes',
    title: 'Solicitudes',
    iconType: 'material-icons-two-tone',
    icon: 'view_list',
    class: '',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    role: ['Admin'],
    submenu: [],
  },
  // Almacenista Modules

  {
    path: '/almacenista/dashboard',
    title: 'Panel',
    iconType: 'material-icons-two-tone',
    icon: 'space_dashboard',
    class: '',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    role: ['Almacenista'],
    submenu: [],
  },
   {
    path: '/almacenista/admin-sol',
    title: 'Surtir',
    iconType: 'material-icons-two-tone',
    icon: 'view_list',
    class: '',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    role: ['Almacenista'],
    submenu: [],
  },

  // Coordinador Modules

  {
    path: '/coordinador/dashboard',
    title: 'Panel',
    iconType: 'material-icons-two-tone',
    icon: 'space_dashboard',
    class: '',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    role: ['Coordinador'],
    submenu: [],
  },
  {
    path: '/coordinador/solicitudes',
    title: 'Mis Solicitudes',
    iconType: 'material-icons-two-tone',
    icon: 'list',
    class: '',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    role: ['Coordinador'],
    submenu: [],
  }, 
   {
    path: '/coordinador/admin-sol',
    title: 'Administrar',
    iconType: 'material-icons-two-tone',
    icon: 'view_list',
    class: '',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    role: ['Coordinador'],
    submenu: [],
  },
  {
   path: '/coordinador/sol-hist',
   title: 'Historico',
   iconType: 'fas fa-history fa-lg',
   icon: '',
   class: '',
   groupTitle: false,
   badge: '',
   badgeClass: '',
   role: ['Coordinador'],
   submenu: [],
 },
  {
    path: '/coordinador/admin-per',
    title: 'Periodos',
    iconType: 'material-icons-two-tone',
    icon: 'date_range',
    class: '',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    role: ['Coordinador'],
    submenu: [],
  },

  // solicitante Modules

  {
    path: '/solicitante/dashboard',
    title: 'Panel',
    iconType: 'material-icons-two-tone',
    icon: 'space_dashboard',
    class: '',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    role: ['Solicitante'],
    submenu: [],
  },
  {
    path: '/solicitante/solicitudes',
    title: 'Mis Solicitudes',
    iconType: 'material-icons-two-tone',
    icon: 'list',
    class: '',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    role: ['Solicitante'],
    submenu: [],
  },

  
  // Capturista Modules

  {
    path: '/capturista/dashboard',
    title: 'Panel',
    iconType: 'material-icons-two-tone',
    icon: 'space_dashboard',
    class: '',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    role: ['Capturista'],
    submenu: [],
  },
  {
    path: '/capturista/solicitudes',
    title: 'Mis Solicitudes',
    iconType: 'material-icons-two-tone',
    icon: 'list',
    class: '',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    role: ['Capturista'],
    submenu: [],
  },

  // Common Module


];
