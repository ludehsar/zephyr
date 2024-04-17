import { Entity, EntityItem } from "electrodb";
import DataLoader from "dataloader";
import { Dynamo } from "./dynamo";

export * as Client from "./client";

export const ClientEntity = new Entity(
  {
    model: {
      version: "1",
      entity: "Client",
      service: "Zephyr",
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
      byProject: {
        pk: {
          field: "pk",
          composite: ["projectId"],
        },
        sk: {
          field: "sk",
          composite: ["clientId"],
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

export function get(clientId: string, projectId: string) {
  return ClientEntity.get({
    clientId,
    projectId,
  }).go();
}

const clientsDataLoader = new DataLoader<
  string,
  { data: Info[]; cursor: string | null }
>((keys) => {
  const promises: Promise<{ data: Info[]; cursor: string | null }>[] = [];
  keys.map((key) =>
    promises.push(
      ClientEntity.query
        .byProject({
          projectId: key,
        })
        .go()
    )
  );
  return Promise.all(promises);
});

export function listClientsByProjectId(projectId: string) {
  return clientsDataLoader.load(projectId);
}

const projectsDataLoader = new DataLoader<
  string,
  { data: Info[]; cursor: string | null }
>((keys) => {
  const promises: Promise<{ data: Info[]; cursor: string | null }>[] = [];
  keys.map((key) =>
    promises.push(
      ClientEntity.query
        .byClient({
          clientId: key,
        })
        .go()
    )
  );
  return Promise.all(promises);
});

export function listProjectsByClientId(clientId: string) {
  return projectsDataLoader.load(clientId);
}

export function deletePermanently(projectId: string, clientId: string) {
  return ClientEntity.delete({
    projectId,
    clientId,
  }).go();
}
