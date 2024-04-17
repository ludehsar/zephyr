import { Developer } from "../../../../core/entities/developer";
import { Project } from "../../../../core/entities/project";
import { User } from "../../../../core/entities/user";
import { builder } from "../builder";
import { ProjectType } from "./project";
import { UserType } from "./user";

export const DeveloperType = builder
  .objectRef<Developer.Info>("Developer")
  .implement({
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
      developer: t.field({
        type: UserType,
        nullable: true,
        resolve: async (client) => {
          if (!client.developerId) return;
          const user = (await User.get(client.developerId)).data;
          if (!user) return;
          return user;
        },
      }),
      hourlyRate: t.exposeFloat("hourlyRate"),
    }),
  });
