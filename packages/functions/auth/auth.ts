import {
  AuthHandler,
  GoogleAdapter,
  Session,
  LinkAdapter,
} from "sst/node/auth";
import { Config } from "sst/node/config";
import { User } from "../../core/entities/user";

declare module "sst/node/auth" {
  export interface SessionTypes {
    user: User.Info;
  }
}

export const handler = AuthHandler({
  providers: {
    link: LinkAdapter({
      onLink: async (link, claims) => {
        return {
          statusCode: 200,
          body: JSON.stringify({ link, claims }),
        };
      },
      onSuccess: async (claims) => {
        let user = (await User.fromEmail(claims.email!)).data;
        if (!user) {
          user = (
            await User.create({
              email: claims.email!,
              name: claims.name,
            })
          ).data;
        }
        return Session.parameter({
          redirect: "http://localhost:3000",
          type: "user",
          properties: {
            ...user,
          },
        });
      },
      onError: async () => {},
    }),
    google: GoogleAdapter({
      mode: "oidc",
      clientID: Config.GOOGLE_CLIENT_ID,
      onSuccess: async (tokenset) => {
        const claims = tokenset.claims();
        let user = (await User.fromEmail(claims.email!)).data;
        if (!user) {
          user = (
            await User.create({
              email: claims.email!,
              name: claims.name,
            })
          ).data;
        }
        return Session.parameter({
          redirect: "http://localhost:3000",
          type: "user",
          properties: {
            ...user,
          },
        });
      },
    }),
  },
});
