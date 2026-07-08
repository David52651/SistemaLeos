import useRole from "./useRole";
import { PERMISSIONS } from "@/config/permissions";

export default function usePermission(permission) {

  const { role } = useRole();

  const allowedRoles =
    PERMISSIONS[permission] || [];

  return allowedRoles.includes(role);

}