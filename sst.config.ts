import { type SSTConfig } from "sst";
import { Config, NextjsSite } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "zephyr",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, "site");
      stack.addOutputs({
        SiteUrl: site.url,
      });
      // const api = new Api(stack, "api", {
      //   routes: {
      //     "GET /": "packages/functions/src/time.handler",
      //   },
      // });
    });
  },
} satisfies SSTConfig;
