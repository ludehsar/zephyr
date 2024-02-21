import { Entity, EntityItem } from "electrodb";
import { Dynamo } from "./dynamo";

export * as Project from "./project";

export const ProjectEntity = new Entity(
  {
    model: {
      version: "1",
      entity: "project",
      service: "zephyr",
    },
    attributes: {
      id: {
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
          composite: ["id"],
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

export type Info = EntityItem<typeof ProjectEntity>;

export function fromId(id: string) {
  return ProjectEntity.get({
    id,
  }).go();
}

export function create(item: Info) {
  return ProjectEntity.create({ ...item }).go();
}

export function update(item: Info) {
  return ProjectEntity.update({ id: item.id })
    .data((attribute, operations) => {
      operations.set(attribute.title, item.title || "");
    })
    .go();
}

export function deletePermanently(id: string) {
  return ProjectEntity.delete({
    id,
  }).go();
}
