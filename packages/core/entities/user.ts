import { Entity, EntityItem } from "electrodb";
import { Dynamo } from "./dynamo";

export * as User from "./user";

export const UserEntity = new Entity(
  {
    model: {
      version: "1",
      entity: "User",
      service: "Zephyr",
    },
    attributes: {
      id: {
        type: "string",
        required: true,
        readOnly: true,
      },
      shardId: {
        type: "number",
        required: true,
        readOnly: true,
      },
      email: {
        type: "string",
        required: true,
        readOnly: true,
      },
      name: {
        type: "string",
      },
      premiumTrialTaken: {
        type: "boolean",
        default: false,
      },
      planId: {
        type: ["FREE", "PREMIUM", "BUSINESS"] as const,
        default: "FREE",
      },
    },
    indexes: {
      primary: {
        pk: {
          field: "pk",
          composite: ["email"],
        },
        sk: {
          field: "sk",
          composite: [],
        },
      },
      list: {
        index: "gsi1",
        pk: {
          field: "gsi1pk",
          composite: ["shardId"],
        },
        sk: {
          field: "gsi1sk",
          composite: ["id"],
        },
      },
    },
  },
  Dynamo.getConfiguration()
);

export type Info = EntityItem<typeof UserEntity>;

export function get(email: string) {
  return UserEntity.get({
    email,
  }).go();
}

export function create(item: Info) {
  return UserEntity.create({ ...item }).go();
}

export function update(item: Info) {
  return UserEntity.update({ email: item.email })
    .data((attribute, operations) => {
      operations.set(attribute.name, item.name || "");
      operations.set(attribute.planId, item.planId || "FREE");
      operations.set(
        attribute.premiumTrialTaken,
        item.premiumTrialTaken || false
      );
    })
    .go();
}

export function deletePermanently(email: string) {
  return UserEntity.delete({
    email,
  }).go();
}
