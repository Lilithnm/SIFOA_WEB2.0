// Sidebar route metadata
export interface RouteInfo {
  path: string;
  title: string;
  iconType: string;
  expediente: boolean;
  icon: string;
  class: string;
  groupTitle: boolean;
  badge: string;
  badgeClass: string;
  role: string[];
  submenu: RouteInfo[];
}
