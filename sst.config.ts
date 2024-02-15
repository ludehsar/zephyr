import { SSTConfig } from "sst";

export default {
  config(_input) {
    return {
      name: "zephyr",
      region: "us-east-1",
    };
  },
  stacks(app) {
    // app.stack(function Site({ stack }) {
    //   const site = new NextjsSite(stack, "site");
    //   stack.addOutputs({
    //     SiteUrl: site.url,
    //   });
    // });
  },
} satisfies SSTConfig;
