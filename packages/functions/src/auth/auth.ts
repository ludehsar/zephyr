import {
  AuthHandler,
  GoogleAdapter,
  Session,
  LinkAdapter,
} from "sst/node/auth";
import { Config } from "sst/node/config";
import { User } from "../../../core/entities/user";
import { ulid } from "ulid";

declare module "sst/node/auth" {
  export interface SessionTypes {
    user: User.Info;
  }
}

const getOrCreateUserFromClaims = async (
  claims: Record<string, any>
): Promise<User.Info> => {
  let user = (await User.getByEmail(claims.email!)).data[0];
  if (!user) {
    const id = ulid();
    user = (
      await User.create({
        userId: id,
        email: claims.email!,
        name: claims.name,
      })
    ).data;
  }
  if (!user) {
    throw new Error("User not found or created.");
  }
  return user;
};

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
        const user = await getOrCreateUserFromClaims(claims);
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
        const user = await getOrCreateUserFromClaims(claims);
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
