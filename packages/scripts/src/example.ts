import { Resource } from "sst";
import { Example } from "@zephyr/core/example";

console.log(`${Example.hello()} Linked to ${Resource.MyBucket.name}.`);
