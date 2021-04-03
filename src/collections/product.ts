import { Model, Document } from "mongoose";
import ErrorHandler from "../models/errorHandler";
const ObjectID = require('mongodb').ObjectID;
import Product from "../models/product";
import { IProductInput } from "../interfaces/product";
import { replaceQuotes } from '../helpers/objectId';


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
    async getProductsByCategory (category_id: String, params: any): Promise<Document[]> {
        const { date, ids, name, sort, limit, page, perPage=1, discount, price_min, price_max } = params;
        console.log(price_min)
        const matchParams: any = {
            $match: {},
        };
        const sortParams: any = {
            $sort: {}
        };
        const aggr:any = [];
        if (category_id) {
            matchParams.$match.categories = ObjectID(category_id) ;
        }
        if(ids) {
            const matchIds = ids.split(",").map((id: string) => ObjectID(id));
            matchParams.$match._id = {
                $in: matchIds
            }
        }
        if(discount) {
            matchParams.$match.discount = {
                $gt: 0
            }
        }
        if(price_min && price_min !== "undefined") {
            matchParams.$match.price = {
                $gt: Number(price_min)
            };
        }
        if(price_max && price_max !== "undefined") {
            matchParams.$match.price = {
                ...matchParams.$match.price,
                $lt: Number(price_max)
            };
        }
        aggr.push(matchParams)
        if (date == "latest") {
            sortParams.$sort.createdAt = -1;
            aggr.push(sortParams)
        } else if (date == "newest") {
            sortParams.$sort.createdAt = 1;
            aggr.push(sortParams)
        }

        if (page) {
            aggr.push({$skip: Number(page) * Number(limit)})
        }
        if(limit) {
            aggr.push({$limit: Number(limit)})
        }
        
        console.log(JSON.stringify(aggr))
        const items: Document[] = await this._db.aggregate(aggr);
        return items;
    }
    async getAllProducts (params:any):Promise<Document[]> {
        const { date, ids, name, sort, limit, skip, perPage = 2 } = params;
        const matchParams: any = {};
        const sortParams: any = {};
        const aggr:any = [
            {  
                $match: matchParams,
            }
        ];
        if(ids) {
            const matchIds = ids.split(",").map((id: string) => ObjectID(id));
            matchParams._id = {
                $in: matchIds
            }
        }
        if (name) {
            matchParams.name = {
                $search: "/" + replaceQuotes(name) + "/"
            }
        }
        if (date == "latest") {
            sortParams.createdAt = -1;
            aggr.push(sortParams)
        }

        if(limit) {
            aggr.push({$limit: Number(limit)})
        }
        if (skip) {
            aggr.push({$skip: Number(skip) * Number(perPage)})
        }
        console.log(aggr)
        const items: Document[] = await this._db.aggregate(aggr);
        return items;
    }
}

export default new ProductDb();