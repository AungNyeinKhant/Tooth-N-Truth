import { PERMISSIONS_ENUM } from "../constants/permissions";

function getAllPermissions(obj: object): string[] {
  const perms: string[] = [];
  for (const val of Object.values(obj)) {
    if (typeof val === "string") perms.push(val);
    else if (typeof val === "object") perms.push(...getAllPermissions(val));
  }
  return perms;
}

export const PERMISSIONS = PERMISSIONS_ENUM;
export const ALL_PERMISSIONS = getAllPermissions(PERMISSIONS_ENUM);
export type Permission = (typeof ALL_PERMISSIONS)[number];
