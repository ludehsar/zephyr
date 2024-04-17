import { builder } from "../builder";
import { Project } from "../../../../core/entities/project";
import { Developer } from "../../../../core/entities/developer";
import { requireUser } from "../requireUser";
import { Client } from "../../../../core/entities/client";
import { DeveloperType } from "./developer";
import { ClientType } from "./client";

export const ProjectType = builder
  .objectRef<Project.Info>("Project")
  .implement({
    fields: (t) => ({
      projectId: t.exposeString("projectId"),
      title: t.exposeString("title", { nullable: true }),
    }),
  });

builder.queryFields((t) => ({
  project: t.field({
    type: ProjectType,
    nullable: true,
    args: {
      projectId: t.arg.string({
        required: true,
      }),
    },
    resolve: async (_, args) => {
      return (await Project.get(args.projectId)).data;
    },
  }),
  developerProjects: t.field({
    type: [DeveloperType],
    nullable: true,
    resolve: async (_, args) => {
      const session = requireUser();
      return (
        await Developer.listProjectsByDeveloperId(session.properties.userId)
      ).data;
    },
  }),
  clientProjects: t.field({
    type: [ClientType],
    nullable: true,
    resolve: async (_, args) => {
      const session = requireUser();
      return (await Client.listProjectsByClientId(session.properties.userId))
        .data;
    },
  }),
}));

builder.mutationFields((t) => ({
  createProject: t.field({
    type: ProjectType,
    args: {
      projectId: t.arg.string({
        required: true,
      }),
      title: t.arg.string({
        required: true,
      }),
      hourlyRate: t.arg.float({
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const session = requireUser();
      const project = (
        await Project.create({
          projectId: args.projectId,
          title: args.title,
        })
      ).data;
      await Developer.create({
        developerId: session.properties.userId,
        hourlyRate: args.hourlyRate,
        projectId: project.projectId,
      });
      return project;
    },
  }),
  updateProject: t.field({
    type: ProjectType,
    args: {
      projectId: t.arg.string({
        required: true,
      }),
      title: t.arg.string({
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const project = (
        await Project.update({
          projectId: args.projectId,
          title: args.title,
        })
      ).data;
      return {
        projectId: project.projectId || "",
        title: project.title || "",
      };
    },
  }),
  deleteProject: t.field({
    type: ProjectType,
    args: {
      projectId: t.arg.string({
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const project = (await Project.deletePermanently(args.projectId)).data;
      return {
        projectId: project.projectId || "",
        title: project.title || "",
      };
    },
  }),
}));
