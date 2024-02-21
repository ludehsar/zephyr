import { Entity, EntityItem } from "electrodb";
import { Dynamo } from "./dynamo";

export * as Client from "./client";

export const ClientEntity = new Entity(
  {
    model: {
      version: "1",
      entity: "client",
      service: "zephyr",
    },
    attributes: {
      clientId: {
        type: "string",
        required: true,
        readOnly: true,
      },
      projectId: {
        type: "string",
        required: true,
        readOnly: true,
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
          composite: ["clientId"],
        },
      },
      gsi: {
        index: "gsi",
        pk: {
          field: "gsi1pk",
          composite: ["clientId"],
        },
        sk: {
          field: "gsi1sk",
          composite: ["projectId"],
        },
      },
    },
  },
  Dynamo.getConfiguration()
);

export type Info = EntityItem<typeof ClientEntity>;

export function create(item: Info) {
  return ClientEntity.create({ ...item }).go();
}

export function listClientsByProjectId(projectId: string) {
  return ClientEntity.query
    .primary({
      projectId,
    })
    .go();
}

export function listProjectsByClientId(clientId: string) {
  return ClientEntity.query
    .gsi({
      clientId: clientId,
    })
    .go();
}

export function deletePermanently(projectId: string, clientId: string) {
  return ClientEntity.delete({
    projectId,
    clientId,
  }).go();
}
