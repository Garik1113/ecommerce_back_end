import isEmpty from "lodash/isEmpty";
import { Model, Document } from "mongoose";
import Order, { IOrder } from "../models/order";
import { IOrderInput } from '../types/order';


class OrderDb {
    protected _db: Model<IOrder> = Order;
    get db () {
        return this._db;
    };

    async placeOrder(order: IOrderInput):Promise<Document> {
        const document: Document = await this.db.create(order);
        return document;
    }
    async getBannerById(_id: String):Promise<Document> {
        const document: Document = await this._db.findById(_id)
        return document;
    }
    async getBanners():Promise<Document[]> {
        const documents: Document[] = await this._db.find();
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
        await this._db.findByIdAndUpdate(filter, updateQuery);
    }
}

export default new OrderDb();