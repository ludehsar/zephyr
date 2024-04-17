import { builder } from "../builder";
import { User } from "../../../../core/entities/user";
import { requireUser } from "../requireUser";

export const UserType = builder.objectRef<User.Info>("User").implement({
  fields: (t) => ({
    userId: t.exposeString("userId"),
    email: t.exposeString("email"),
    name: t.exposeString("name", { nullable: true }),
    plan: t.exposeString("plan", { nullable: true }),
    premiumTrialTaken: t.exposeBoolean("premiumTrialTaken", { nullable: true }),
  }),
});

builder.queryFields((t) => ({
  session: t.field({
    type: UserType,
    nullable: true,
    resolve: async () => {
      const session = requireUser();
      return (await User.getByEmail(session.properties.email)).data[0];
    },
  }),
}));
