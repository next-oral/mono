import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

export const statement = {
  ...defaultStatements,
  clinic: ["create", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({ clinic: ["update"] });
export const admin = ac.newRole({
  clinic: ["create", "update", "delete"],
  ...adminAc.statements,
});
