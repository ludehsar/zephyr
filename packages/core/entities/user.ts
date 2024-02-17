import { Entity, EntityItem } from "electrodb";
import { Dynamo } from "./dynamo";

export * as User from "./user";

export const UserEntity = new Entity(
  {
    model: {
      version: "1",
      entity: "User",
      service: "auth",
    },
    attributes: {
      email: {
        type: "string",
        required: true,
      },
      name: {
        type: "string",
        default: "",
      },
      premiumTrialTaken: {
        type: "boolean",
        default: false,
      },
      planId: {
        type: "string",
        default: "",
      },
    },
    indexes: {
      byEmail: {
        pk: {
          field: "pk",
          composite: ["email"],
        },
        sk: {
          field: "sk",
          composite: [],
        },
      },
    },
  },
  Dynamo.getConfiguration()
);

export type Info = EntityItem<typeof UserEntity>;

export function fromEmail(email: string) {
  return UserEntity.get({
    email,
  }).go();
}

export function create(item: Info) {
  return UserEntity.create({
    email: item.email,
    name: item.name,
    planId: item.planId,
    premiumTrialTaken: item.premiumTrialTaken,
  }).go();
}
