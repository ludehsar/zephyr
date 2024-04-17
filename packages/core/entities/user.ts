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
      userId: {
        type: "string",
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
          composite: ["userId"],
        },
        sk: {
          field: "sk",
          composite: ["userId"],
        },
      },
      byEmail: {
        index: "gsi1",
        pk: {
          field: "gsi1pk",
          composite: ["email"],
        },
        sk: {
          field: "gsi1sk",
          composite: ["email"],
        },
      },
    },
  },
  Dynamo.getConfiguration()
);

export type Info = EntityItem<typeof UserEntity>;

export function get(userId: string) {
  return UserEntity.get({
    userId,
  }).go();
}

export async function getByEmail(email: string) {
  return (
    await UserEntity.query
      .byEmail({
        email,
      })
      .go()
  ).data.at(0);
}

export function create(item: Info) {
  return UserEntity.create({ ...item }).go();
}

export function update(item: Info) {
  return UserEntity.update({ userId: item.userId })
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

export function deletePermanently(userId: string) {
  return UserEntity.delete({
    userId,
  }).go();
}
