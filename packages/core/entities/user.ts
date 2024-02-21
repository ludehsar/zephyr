import { Entity, EntityItem } from "electrodb";
import { Dynamo } from "./dynamo";

export * as User from "./user";

export const UserEntity = new Entity(
  {
    model: {
      version: "1",
      entity: "user",
      service: "zephyr",
    },
    attributes: {
      id: {
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
      primary: {
        pk: {
          field: "pk",
          composite: ["email"],
        },
        sk: {
          field: "sk",
          composite: ["id"],
        },
      },
      byPlan: {
        index: "gsi1",
        pk: {
          field: "gsi1pk",
          composite: ["planId"],
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

export function fromEmailAndUserId(email: string, userId: string) {
  return UserEntity.get({
    email,
    id: userId,
  }).go();
}

export function create(item: Info) {
  return UserEntity.create({ ...item }).go();
}

export function update(item: Info) {
  return UserEntity.update({ email: item.email, id: item.id })
    .data((attribute, operations) => {
      operations.set(attribute.name, item.name || "");
      operations.set(attribute.planId, item.planId || "");
      operations.set(
        attribute.premiumTrialTaken,
        item.premiumTrialTaken || false
      );
    })
    .go();
}

export function deletePermanently(email: string, userId: string) {
  return UserEntity.delete({
    email,
    id: userId,
  }).go();
}
