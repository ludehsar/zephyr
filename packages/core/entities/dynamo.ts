import { EntityConfiguration } from "electrodb";
import { DynamoDB } from "aws-sdk";
import { Config } from "sst/node/config";

export class Dynamo {
  public static getConfiguration(): EntityConfiguration {
    return {
      client: new DynamoDB.DocumentClient(),
      table: Config.TABLE_NAME,
    };
  }
}
