import { Model, Document } from "mongoose";
import ErrorHandler from "../models/errorHandler";
const ObjectID = require('mongodb').ObjectID;
import Product from "../models/product";
import { IProductInput } from "../interfaces/product";


class ProductDb {
    protected _db:Model<any> = Product;

    async createProduct (product: IProductInput):Promise<Document> {
        try {
            const document: Document = await this._db.create(product);
            return document;
        } catch (error) {
            throw new ErrorHandler(401, error.message)
        }
    }
    async getProductById (_id: String):Promise<Document> {
        try {
            const document: Document = await this._db.findById(ObjectID(_id));
            return document;  
        } catch (error) {
            throw new ErrorHandler(401, error.message)
        }
        
    }
    async updateProduct (_id: string, body: any):Promise<IProductInput | any> {
        try {
            const filter = {"_id": ObjectID(_id)};
            const updateQuery:any = {};
            for (const key in body) {
                if (Object.prototype.hasOwnProperty.call(body, key)) {
                    const element = body[key];
                    updateQuery[key] = element;
                }
            };
            await this._db.updateOne(filter, updateQuery);
        } catch (error) {
            throw new ErrorHandler(401, error.message)
        }
        
    }
    async deleteProduct (_id: String):Promise<void> {
        try {
            await this._db.deleteOne({ _id });
        } catch (error) {
            throw new ErrorHandler(401, error.message)
        }
    }
    async getProductsByCategory (_id: String, params: any): Promise<Document[]> {
        const { sort } = params;
        let sortNumber = 1
        if (sort == 'high') {
            sortNumber = -1
        }
        
        const items: Document[] = await this._db.find({categories: _id}).sort({"price.value": sortNumber});
        // const items = await this._db.aggregate([
        //     {
        //         $match: {
        //             "categories": _id
        //             // "price.value": { 
        //             //     $gt: 1000,
        //             //     $lt: 4000
        //             // }
        //         }
        //     }
        // ])
        return items;
    }
    async getAllProducts (params:any):Promise<Document[]> {
        const { date } = params;
        const query:any = {};
        if (date == 'latest') {
            query._id = 1
        } 
        const items: Document[] = await this._db.find({}).sort(query);
        return items;
    }
}

export default new ProductDb();