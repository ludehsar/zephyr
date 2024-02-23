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

function hashForSharding(str: string, numberOfShards: number) {
  let hash = 0;
  let i = 0;
  let len = str.length;
  while (i < len) {
    hash = str.charCodeAt(i++) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  hash = Math.abs(hash);
  return hash % numberOfShards;
}

const getOrCreateUserFromClaims = async (
  claims: Record<string, any>
): Promise<User.Info> => {
  let user = await User.get(claims.email!);
  if (!user.data) {
    const id = ulid();
    user = await User.create({
      id,
      shardId: hashForSharding(id, 25),
      email: claims.email!,
      name: claims.name,
    });
  }
  if (!user.data) {
    throw new Error("User not found or created.");
  }
  return user.data;
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
