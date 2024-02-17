import { NextjsSite, StackContext, use } from "sst/constructs";
import { ApiStack } from "./api-stack";

export const SiteStack = ({ stack }: StackContext) => {
  const { api } = use(ApiStack);
  const site = new NextjsSite(stack, "site", {
    bind: [api],
  });
  stack.addOutputs({
    SiteUrl: site.url,
  });
};
