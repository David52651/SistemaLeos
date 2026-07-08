import { ROLES } from "./roles";

export const PERMISSIONS = {

  gestionarUsuarios: [
    ROLES.ADMIN
  ],

  gestionarInventario: [
    ROLES.ADMIN,
    ROLES.ENCARGADO
  ],

  visualizarInventario: [
    ROLES.ADMIN,
    ROLES.ENCARGADO,
    ROLES.CONSULTA
  ],

  registrarMovimientos: [
    ROLES.ADMIN,
    ROLES.ENCARGADO
  ],

};