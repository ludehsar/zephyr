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
      timeEntryId: {
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
          composite: ["timeEntryId"],
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
          composite: ["timeEntryId"],
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
    timeEntryId: item.timeEntryId,
  })
    .data((attribute, operations) => {
      operations.set(attribute.note, item.note || "");
      operations.set(attribute.timeInMinute, item.timeInMinute || 5);
    })
    .go();
}

export function deletePermanently(timeEntryId: string, developerId: string) {
  return TimeEntryEntity.delete({
    developerId,
    timeEntryId,
  }).go();
}
