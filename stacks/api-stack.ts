import { Api, StackContext } from "sst/constructs";

export const ApiStack = ({ stack }: StackContext) => {
  const api = new Api(stack, "api", {
    routes: {
      "GET /api/v1": "packages/functions/src/hello.handler",
    },
  });
  stack.addOutputs({
    ApiUrl: api.url,
  });
  return {
    api,
  };
};
