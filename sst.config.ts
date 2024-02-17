import { type SSTConfig } from "sst";
import { AuthStack } from "./stacks/auth-stack";
import { ApiStack } from "./stacks/api-stack";
import { SiteStack } from "./stacks/site-stack";
import { DatabaseStack } from "./stacks/database-stack";

export default {
  config(_input) {
    return {
      name: "zephyr",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(DatabaseStack).stack(ApiStack).stack(AuthStack).stack(SiteStack);
  },
} satisfies SSTConfig;
