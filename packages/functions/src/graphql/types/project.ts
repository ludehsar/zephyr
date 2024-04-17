import { builder } from "../builder";
import { Project } from "../../../../core/entities/project";

const ProjectType = builder.objectRef<Project.Info>("Project").implement({
  fields: (t) => ({
    projectId: t.exposeString("projectId", { nullable: true }),
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
    },
    resolve: async (_, args) =>
      (
        await Project.create({
          projectId: args.projectId,
          title: args.title,
        })
      ).data,
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
