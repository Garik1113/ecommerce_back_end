import isEmpty from "lodash/isEmpty";
import { Model, Document } from "mongoose";
import Banner from "../models/banner";
import { IBannerInput } from '../interfaces/banner';


class BannerDb {
    protected _db: Model<any> = Banner;
    get db () {
        return this._db;
    };

    async createBanner(banner: IBannerInput):Promise<Document> {
        const document: Document = await this.db.create(banner);
        return document;
    }
    async getBannerById(_id: String):Promise<Document> {
        const document: Document = await this._db.findById(_id)
        return document;
    }
    async getBanners():Promise<Document[]> {
        const documents: Document[] = await this.db.find();
        return documents;
    }
    async deleteBanner(bannerId: String):Promise<void> {
        await this.db.findByIdAndRemove(bannerId);
    }
    async updateBanner(bannerId: String, body: any):Promise<void> {
        const filter = {"_id": bannerId};
        const updateQuery:any = {};
        if(isEmpty(body)){
            return;
        }
        for (const key in body) {
            if (Object.prototype.hasOwnProperty.call(body, key)) {
                const element = body[key];
                updateQuery[key] = element;
            }
        };
        await this.db.findByIdAndUpdate(filter, updateQuery);
    }
}

export default new BannerDb();