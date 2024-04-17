import { Api, StackContext, use } from "sst/constructs";
import { DatabaseStack } from "./database-stack";

export const ApiStack = ({ stack }: StackContext) => {
  const { table, TABLE_NAME } = use(DatabaseStack);
  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [table, TABLE_NAME],
      },
    },
    routes: {
      "POST /graphql": {
        type: "graphql",
        function: {
          handler: "packages/functions/src/graphql/graphql.handler",
        },
        pothos: {
          schema: "packages/functions/src/graphql/schema.ts",
          output: "graphql/schema.graphql",
          commands: [
            "npx genql --output ./graphql/genql --schema ./graphql/schema.graphql --esm",
          ],
        },
      },
    },
  });
  stack.addOutputs({
    ApiUrl: api.url,
  });
  return {
    api,
  };
};
