import isEmpty from "lodash/isEmpty";
import { Model, Document } from "mongoose";
import Config from "../models/config";
import { IConfigInput } from "../interfaces/config";


class ConfigDb {
    protected _db: Model<any> = Config;
    get db () {
        return this._db;
    };

    async createConfig(config: IConfigInput):Promise<Document> {
        const document: Document = await this.db.create({ config });
        return document
    }
    async getConfig():Promise<Document> {
        const document: Document = await this.db.findOne();
        return document;
    }
    async deleteBanner(bannerId: String):Promise<void> {
        await this.db.findByIdAndRemove(bannerId);
    }
    async updateConfig(configId: String, body: any):Promise<void> {
        await this.db.findByIdAndUpdate(configId, {config: body});
    }
}

export default new ConfigDb();