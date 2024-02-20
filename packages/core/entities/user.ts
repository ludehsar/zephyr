import { Entity, EntityItem } from "electrodb";
import { Dynamo } from "./dynamo";

export * as User from "./user";

export const UserEntity = new Entity(
  {
    model: {
      version: "1",
      entity: "user",
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
      profilePicture: {
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
  return UserEntity.create({ ...item }).go();
}

export function update(item: Info) {
  return UserEntity.patch({ email: item.email })
    .set({
      ...item,
    })
    .go();
}
