import { Client } from "../../../../core/entities/client";
import { Project } from "../../../../core/entities/project";
import { User } from "../../../../core/entities/user";
import { builder } from "../builder";
import { ProjectType } from "./project";
import { UserType } from "./user";

export const ClientType = builder.objectRef<Client.Info>("Client").implement({
  fields: (t) => ({
    project: t.field({
      type: ProjectType,
      nullable: true,
      resolve: async (client) => {
        if (!client.projectId) return;
        const project = (await Project.get(client.projectId)).data;
        if (!project) return;
        return project;
      },
    }),
    client: t.field({
      type: UserType,
      nullable: true,
      resolve: async (client) => {
        if (!client.clientId) return;
        const user = (await User.get(client.clientId)).data;
        if (!user) return;
        return user;
      },
    }),
  }),
});
