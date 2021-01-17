import { Model, Document } from "mongoose";
import { convertDbProductToNormal } from "../common/product";
const ObjectID = require('mongodb').ObjectID;
import Product, { IProduct } from "../models/product";
import { TProduct } from "../types/product";

class ProductDb {
    protected _db:Model<any> = Product;

    async createProduct (productObj: any):Promise<Document> {
        const document: Document = await this._db.create(productObj);
        return document;
    }

    async getProductById (_id: String):Promise<Document> {
        const document: Document = await this._db.findById(_id);
        return document;
    }
    async updateProduct (_id: string, body: any):Promise<TProduct | any> {
        const filter = {"_id": ObjectID(_id)};
        const updateQuery:any = {};
        for (const key in body) {
            if (Object.prototype.hasOwnProperty.call(body, key)) {
                const element = body[key];
                updateQuery[key] = element;
            }
        };
        const updated: Document = await this._db.updateOne(filter, updateQuery);

        return updated;
    }
    async deleteProduct (_id: String):Promise<void> {
        await this._db.deleteOne({ _id });
    }
    async getProductsByCategory (_id: String): Promise<Document[]> {
        const items: Document[] = await this._db.find({category_id: _id});
        return items;
    }
    async getAllProducts ():Promise<Document[]> {
        const items: Document[] = await this._db.find();
        return items;
    }
}

export default new ProductDb()