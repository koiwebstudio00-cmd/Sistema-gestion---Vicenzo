import type { UserRole } from '../features/demo/DemoModule';

export const APP_ROUTES = {
  login: '/',
  dashboard: '/dashboard',
  recepcion: '/recepcion',
  produccion: '/produccion',
  tioFranco: '/tio-franco',
  catering: '/catering',
} as const;

export type AppPath = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];

export const DEFAULT_VIEW_BY_ROLE: Record<UserRole, string> = {
  JEFE: 'AGENDA',
  JULIA: 'AGENDA',
  MILI: 'AGENDA',
  ENCARGADO: 'AGENDA',
  PRODUCCION: 'EVENTOS',
  TIO_FRANCO: 'EVENTOS',
  CATERING: 'EVENTOS',
  INVITADO: 'GUESTS',
  CONTROL: 'GUESTS',
  CLIENTE: 'GUESTS',
  GUILLERMINA: 'COBROS'
};

export const ROLE_HOME_BY_ROLE: Record<UserRole, AppPath> = {
  JEFE: APP_ROUTES.dashboard,
  JULIA: APP_ROUTES.recepcion,
  MILI: APP_ROUTES.recepcion,
  ENCARGADO: APP_ROUTES.recepcion,
  PRODUCCION: APP_ROUTES.produccion,
  TIO_FRANCO: APP_ROUTES.tioFranco,
  CATERING: APP_ROUTES.catering,
  INVITADO: APP_ROUTES.login, 
  CONTROL: APP_ROUTES.login,
  CLIENTE: APP_ROUTES.login,
  GUILLERMINA: APP_ROUTES.dashboard
};

export const normalizePath = (pathname: string): AppPath => {
  const cleanPath = pathname.replace(/\/+$/, '') || '/';
  const knownPaths = Object.values(APP_ROUTES) as AppPath[];
  return knownPaths.includes(cleanPath as AppPath) ? (cleanPath as AppPath) : APP_ROUTES.login;
};

export const getHomeRouteForRole = (role: UserRole): AppPath => ROLE_HOME_BY_ROLE[role];
