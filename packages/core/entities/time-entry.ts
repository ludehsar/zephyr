import { Entity, EntityItem } from "electrodb";
import { Dynamo } from "./dynamo";

export * as TimeEntry from "./time-entry";

export const TimeEntryEntity = new Entity(
  {
    model: {
      version: "1",
      entity: "TimeEntry",
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
      date: {
        type: "string",
        required: true,
        readOnly: true,
      },
      timeInMinute: {
        type: "number",
        required: true,
      },
      note: {
        type: "string",
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

export type Info = EntityItem<typeof TimeEntryEntity>;

export function create(item: Info) {
  return TimeEntryEntity.create({ ...item }).go();
}

export function listTeamsByDeveloperId(developerId: string) {
  return TimeEntryEntity.query
    .byDeveloper({
      developerId,
    })
    .go();
}

export function listTeamsByProjectId(projectId: string) {
  return TimeEntryEntity.query
    .byProject({
      projectId,
    })
    .go();
}

export function update(item: Info) {
  return TimeEntryEntity.update({
    developerId: item.developerId,
    invoiceId: item.invoiceId,
  })
    .data((attribute, operations) => {
      operations.set(attribute.note, item.note || "");
      operations.set(attribute.timeInMinute, item.timeInMinute || 5);
    })
    .go();
}

export function deletePermanently(invoiceId: string, developerId: string) {
  return TimeEntryEntity.delete({
    developerId,
    invoiceId,
  }).go();
}
