/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "zephyr",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          profile: process.env.AWS_PROFILE,
        },
        stripe: "0.0.24",
      },
    };
  },
  async run() {
    const storage = await import("./infra/storage");
    await import("./infra/api");
    return {
      MyBucket: storage.bucket.name,
    };
  },
});
