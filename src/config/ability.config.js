import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import { AppUserRole } from "../utils/index.js";

export const defineAbilitiesFor = (user) => {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
  const roles = user?.roles || [];

  if (roles.includes(AppUserRole.ADMIN)) {
    can("manage", "all");
    return build();
  }

  can("create", "User");
  cannot("create", "User", {
    roles: {
      $elemMatch: { $eq: AppUserRole.ADMIN },
    },
  });
  can("read", "Article");
  can("read", "Category");
  cannot("update", "Article", ["authorId"]);

  if (roles.includes(AppUserRole.USER)) {
    can("create", "Article");
    can(["update", "delete"], "Article", { authorId: user.id });
    can(["read", "update"], "User", { id: user.id });
    cannot("update", "User", ["roles"]);
  }

  return build();
};
