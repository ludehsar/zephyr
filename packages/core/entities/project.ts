import { Entity, EntityItem } from "electrodb";
import { Dynamo } from "./dynamo";

export * as Project from "./project";

export const ProjectEntity = new Entity(
  {
    model: {
      version: "1",
      entity: "Project",
      service: "Zephyr",
    },
    attributes: {
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
      primary: {
        pk: {
          field: "pk",
          composite: ["projectId"],
        },
        sk: {
          field: "sk",
          composite: ["projectId"],
        },
      },
    },
  },
  Dynamo.getConfiguration()
);

export type Info = EntityItem<typeof ProjectEntity>;

export function get(projectId: string) {
  return ProjectEntity.get({
    projectId,
  }).go();
}

export function create(item: Info) {
  return ProjectEntity.create({ ...item }).go();
}

export function update(item: Info) {
  return ProjectEntity.update({ projectId: item.projectId })
    .data((attribute, operations) => {
      operations.set(attribute.title, item.title || "");
    })
    .go();
}

export function deletePermanently(projectId: string) {
  return ProjectEntity.delete({
    projectId,
  }).go();
}
