import { Entity, EntityItem } from "electrodb";
import DataLoader from "dataloader";
import { Dynamo } from "./dynamo";

export * as Developer from "./developer";

export const DeveloperEntity = new Entity(
  {
    model: {
      version: "1",
      entity: "Developer",
      service: "Zephyr",
    },
    attributes: {
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
      hourlyRate: {
        type: "number",
        required: true,
        default: 25,
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
          composite: ["developerId"],
        },
      },
      byDeveloper: {
        index: "gsi1",
        pk: {
          field: "gsi1pk",
          composite: ["developerId"],
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

export type Info = EntityItem<typeof DeveloperEntity>;

export function create(item: Info) {
  return DeveloperEntity.create({ ...item }).go();
}

export function get(developerId: string, projectId: string) {
  return DeveloperEntity.get({
    developerId,
    projectId,
  }).go();
}

const developersDataLoader = new DataLoader<
  string,
  { data: Info[]; cursor: string | null }
>((keys) => {
  const promises: Promise<{ data: Info[]; cursor: string | null }>[] = [];
  keys.map((key) =>
    promises.push(
      DeveloperEntity.query
        .byProject({
          projectId: key,
        })
        .go()
    )
  );
  return Promise.all(promises);
});

export function listDevelopersByProjectId(projectId: string) {
  return developersDataLoader.load(projectId);
}

const projectsDataLoader = new DataLoader<
  string,
  { data: Info[]; cursor: string | null }
>((keys) => {
  const promises: Promise<{ data: Info[]; cursor: string | null }>[] = [];
  keys.map((key) =>
    promises.push(
      DeveloperEntity.query
        .byDeveloper({
          developerId: key,
        })
        .go()
    )
  );
  return Promise.all(promises);
});

export function listProjectsByDeveloperId(developerId: string) {
  return projectsDataLoader.load(developerId);
}

export function update(item: Info) {
  return DeveloperEntity.update({
    developerId: item.developerId,
    projectId: item.projectId,
  })
    .data((attribute, operations) => {
      operations.set(attribute.hourlyRate, item.hourlyRate || 25);
    })
    .go();
}

export function deletePermanently(projectId: string, developerId: string) {
  return DeveloperEntity.delete({
    projectId,
    developerId,
  }).go();
}
