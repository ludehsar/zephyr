import { Entity, EntityItem } from "electrodb";
import { Dynamo } from "./dynamo";

export * as Invoice from "./invoice";

export const InvoiceEntity = new Entity(
  {
    model: {
      version: "1",
      entity: "Invoice",
      service: "Zephyr",
    },
    attributes: {
      invoiceId: {
        type: "string",
        required: true,
        readOnly: true,
      },
      developerId: {
        type: "string",
        required: true,
        readOnly: true,
      },
      projectId: {
        type: "string",
        required: true,
        readOnly: true,
      },
      startDate: {
        type: "string",
        required: true,
        readOnly: true,
      },
      endDate: {
        type: "string",
        required: true,
        readOnly: true,
      },
      totalAmount: {
        type: "number",
        required: true,
        readOnly: true,
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
          composite: ["invoiceId"],
        },
      },
      byProject: {
        index: "gsi1",
        pk: {
          field: "gsi1pk",
          composite: ["projectId"],
        },
        sk: {
          field: "gsi1sk",
          composite: ["invoiceId"],
        },
      },
    },
  },
  Dynamo.getConfiguration()
);

export type Info = EntityItem<typeof InvoiceEntity>;

export function create(item: Info) {
  return InvoiceEntity.create({ ...item }).go();
}

export function get(invoiceId: string, developerId: string) {
  return InvoiceEntity.get({
    developerId,
    invoiceId,
  }).go();
}

export function listTeamsByDeveloperId(developerId: string) {
  return InvoiceEntity.query
    .byDeveloper({
      developerId,
    })
    .go();
}

export function listTeamsByProjectId(projectId: string) {
  return InvoiceEntity.query
    .byProject({
      projectId,
    })
    .go();
}

export function deletePermanently(invoiceId: string, developerId: string) {
  return InvoiceEntity.delete({
    developerId,
    invoiceId,
  }).go();
}
