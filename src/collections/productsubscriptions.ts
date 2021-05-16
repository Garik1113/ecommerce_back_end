import isEmpty from "lodash/isEmpty";
import { Model, Document } from "mongoose";
import ProductSubscription from "../models/productSubscriptions";
import { IProductSubscriptionInput } from '../interfaces/productSubscription';
import { replaceQuotes } from '../helpers/objectId';


class ProductSubscriptionDb {
    protected _db: Model<any> = ProductSubscription;
    get db () {
        return this._db;
    };

    async createProductSubscription(pro: IProductSubscriptionInput):Promise<Document> {
        const { customerId, productId } = pro;
        const existing: Document = await this.db.findOne({customerId: replaceQuotes(String(customerId)), productId})
        if (existing) {
            return existing
        } else {
            const document: Document = await this.db.create(pro);
            return document;
        }
    }
    async getProductSubscriptionById(_id: String):Promise<Document> {
        const document: Document = await this._db.findById(_id).populate(["productId", "customerId"]);
        return document;
    }
    async getProductSubscriptions():Promise<Document[]> {
        const documents: Document[] = await this.db.find().populate(["productId", "customerId"]);
        return documents;
    }
    async deleteProductSubscription(productSubscriptionId: String):Promise<void> {
        await this.db.findByIdAndRemove(productSubscriptionId);
    }
    async deleteProductSubscriptionByProductId(productId: String):Promise<void> {
        await this.db.deleteMany({productId});
    }
    async deleteProductSubscriptionByCustomerId(customerId: String):Promise<void> {
        await this.db.deleteMany({customerId});
    }
    async updateBanner(productSubscriptionId: String, body: any):Promise<void> {
        const filter = {"_id": productSubscriptionId};
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

export default new ProductSubscriptionDb();