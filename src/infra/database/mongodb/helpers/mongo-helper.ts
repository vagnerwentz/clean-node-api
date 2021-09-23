import { Collection, MongoClient, InsertOneResult } from "mongodb";

import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/useCases/add-account";

type MapData = AddAccountModel;

type ReturnMap = AccountModel;

export const MongoHelper = {
  client: null as MongoClient,
  async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(process.env.MONGO_URL);
  },

  async disconnect(): Promise<void> {
    await this.client.close();
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  },

  map(collection: MapData, result: InsertOneResult<Document>): ReturnMap {
    return Object.assign({}, collection, {
      id: result.insertedId.toString(),
    });
  },
};
