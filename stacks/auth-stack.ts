import { Auth, Config, StackContext, use } from "sst/constructs";
import { ApiStack } from "./api-stack";
import { DatabaseStack } from "./database-stack";

export const AuthStack = ({ stack }: StackContext) => {
  const { api } = use(ApiStack);
  const { table, TABLE_NAME } = use(DatabaseStack);
  const GOOGLE_CLIENT_ID = new Config.Secret(stack, "GOOGLE_CLIENT_ID");
  const auth = new Auth(stack, "auth", {
    authenticator: {
      handler: "packages/functions/src/auth/auth.handler",
      bind: [table, GOOGLE_CLIENT_ID, TABLE_NAME],
    },
  });
  auth.attach(stack, {
    api,
    prefix: "/auth",
  });
};
