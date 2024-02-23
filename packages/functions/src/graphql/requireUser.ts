import { useSession } from "sst/node/auth";

export function requireUser() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const session = useSession();
  if (session.type !== "user") {
    throw new Error("Expected user session");
  }
  return session;
}
