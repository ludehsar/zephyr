import { NextjsSite, StackContext } from "sst/constructs";

export const SiteStack = ({ stack }: StackContext) => {
  const site = new NextjsSite(stack, "site");
  stack.addOutputs({
    SiteUrl: site.url,
  });
};
