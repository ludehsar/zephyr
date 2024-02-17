import { ApiHandler } from "sst/node/api";
import { useSession } from "sst/node/auth";

export const handler = ApiHandler(async (event) => {
  const session = useSession();

  if (session.type !== "user") {
    throw new Error("Not authenticated");
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: session.properties.email }),
  };
});
