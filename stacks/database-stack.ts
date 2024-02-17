import { Api, Config, StackContext, Table } from "sst/constructs";

export const DatabaseStack = ({ stack, app }: StackContext) => {
  const table = new Table(stack, "table", {
    fields: {
      pk: "string",
      sk: "string",
      gsi1pk: "string",
      gsi1sk: "string",
    },
    primaryIndex: {
      partitionKey: "pk",
      sortKey: "sk",
    },
    globalIndexes: {
      gsi1: {
        partitionKey: "gsi1pk",
        sortKey: "gsi1sk",
      },
    },
  });
  return {
    table,
    TABLE_NAME: new Config.Parameter(stack, "TABLE_NAME", {
      value: table.tableName,
    }),
  };
};
