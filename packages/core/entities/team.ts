import { Entity, EntityItem } from "electrodb";
import { Dynamo } from "./dynamo";

export * as Team from "./team";

export const TeamEntity = new Entity(
  {
    model: {
      version: "1",
      entity: "Team",
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
      title: {
        type: "string",
        required: true,
      },
    },
    indexes: {
      byProject: {
        pk: {
          field: "pk",
          composite: ["projectId"],
        },
        sk: {
          field: "sk",
          composite: ["id"],
        },
      },
    },
  },
  Dynamo.getConfiguration()
);

export type Info = EntityItem<typeof TeamEntity>;

export function create(item: Info) {
  return TeamEntity.create({ ...item }).go();
}

export function get(id: string, projectId: string) {
  return TeamEntity.get({
    id,
    projectId,
  }).go();
}

export function listTeamsByProjectId(projectId: string) {
  return TeamEntity.query
    .byProject({
      projectId,
    })
    .go();
}

export function update(item: Info) {
  return TeamEntity.update({ id: item.id, projectId: item.projectId })
    .data((attribute, operations) => {
      operations.set(attribute.title, item.title || "");
    })
    .go();
}

export function deletePermanently(projectId: string, teamId: string) {
  return TeamEntity.delete({
    projectId,
    id: teamId,
  }).go();
}
