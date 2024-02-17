import { builder } from "../builder";
import { User } from "../../../core/entities/user";
import { requireUser } from "../requireUser";

const UserType = builder.objectRef<User.Info>("User").implement({
  fields: (t) => ({
    email: t.exposeString("email"),
    name: t.exposeString("name", { nullable: true }),
    planId: t.exposeString("planId", { nullable: true }),
    premiumTrialTaken: t.exposeBoolean("premiumTrialTaken", { nullable: true }),
  }),
});

builder.queryFields((t) => ({
  session: t.field({
    type: UserType,
    nullable: true,
    resolve: async () => {
      const session = requireUser();
      return (await User.fromEmail(session.properties.email)).data;
    },
  }),
}));
