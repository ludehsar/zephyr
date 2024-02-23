import { Entity, EntityItem } from "electrodb";
import { Dynamo } from "./dynamo";

export * as Payment from "./payment";

export const PaymentEntity = new Entity(
  {
    model: {
      version: "1",
      entity: "Payment",
      service: "Zephyr",
    },
    attributes: {
      id: {
        type: "string",
        required: true,
        readOnly: true,
      },
      projectId: {
        type: "string",
        required: true,
        readOnly: true,
      },
      invoiceId: {
        type: "string",
        required: true,
        readOnly: true,
      },
      clientId: {
        type: "string",
        required: true,
        readOnly: true,
      },
      developerId: {
        type: "string",
        required: true,
        readOnly: true,
      },
      amount: {
        type: "number",
        required: true,
        readOnly: true,
      },
      dueDate: {
        type: "string",
        required: true,
      },
      status: {
        type: ["OUTSTANDING", "PAID", "REFUNDED"] as const,
        required: true,
        default: "OUTSTANDING",
      },
    },
    indexes: {
      byDeveloper: {
        pk: {
          field: "pk",
          composite: ["developerId"],
        },
        sk: {
          field: "sk",
          composite: ["id"],
        },
      },
      byClient: {
        index: "gsi1",
        pk: {
          field: "gsi1pk",
          composite: ["clientId"],
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

export type Info = EntityItem<typeof PaymentEntity>;

export function create(item: Info) {
  return PaymentEntity.create({ ...item }).go();
}

export function get(id: string, developerId: string) {
  return PaymentEntity.get({
    id,
    developerId,
  }).go();
}

export function listTeamsByDeveloperId(developerId: string) {
  return PaymentEntity.query
    .byDeveloper({
      developerId,
    })
    .go();
}

export function listTeamsByClientId(clientId: string) {
  return PaymentEntity.query
    .byClient({
      clientId,
    })
    .go();
}

export function update(item: Info) {
  return PaymentEntity.update({ id: item.id, developerId: item.developerId })
    .data((attribute, operations) => {
      operations.set(attribute.dueDate, item.dueDate || "");
      operations.set(attribute.status, item.status || "");
    })
    .go();
}

export function deletePermanently(developerId: string, teamId: string) {
  return PaymentEntity.delete({
    developerId,
    id: teamId,
  }).go();
}
