import { Model, Document } from "mongoose";
import ErrorHandler from "../models/errorHandler";
const ObjectID = require('mongodb').ObjectID;
import Product from "../models/product";
import ConfigController from '../controllers/config';
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
    async getProductById (_id: string):Promise<Document> {
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
    async getProducts (category_id: String, params: any): Promise<any> {
        const perPage = await ConfigController.getConfigValue("productsPerPage")
        const { date, ids, limit, page, discount, price_min, price_max, sort, sort_dir, size, color } = params;
        let matchParams: any = {
            $match: {},
        };
        const sortParams: any = {
            $sort: {}
        };
        const aggr:any = [];
        if (category_id) {
            matchParams.$match.categories = ObjectID(category_id) ;
        }
        if (ids) {
            const matchIds = ids.split(",").map((id: string) => ObjectID(id));
            matchParams.$match._id = {
                $in: matchIds
            }
        }
        if (discount) {
            matchParams.$match.discount = {
                $gt: 0
            }
        }
        if (price_min && price_min !== "undefined") {
            matchParams.$match.price = {
                $gt: Number(price_min)
            };
        }
        if (price_max && price_max !== "undefined") {
            matchParams.$match.price = {
                ...matchParams.$match.price,
                $lt: Number(price_max)
            };
        }
        
        if (size && color) {
            matchParams.$match = {
                ...matchParams.$match,
                $and: [
                    {
                       configurableAttributes: {
                            $elemMatch: {
                                "selectedValue._id": String(size)
                            } 
                        }
                    },
                    {
                        configurableAttributes: {
                            $elemMatch: {
                                "selectedValue._id": String(color)
                            } 
                        }
                    },  
                ]
            }
        } else if (size || color) {
            matchParams.$match = {
                ...matchParams.$match,
                configurableAttributes: {
                    $elemMatch: {
                        "selectedValue._id": String(size || color)
                    } 
                }
            }
        }
        aggr.push(matchParams);
        if (sort == "date") {
            if (sort_dir == "asc") {
                sortParams.$sort.createdAt = -1;
            } else {
                sortParams.$sort.createdAt = 1;
            }
            aggr.push(sortParams);
        } else if (sort == "name") {
            if (sort_dir == "asc") {
                sortParams.$sort.name = -1;
            } else {
                sortParams.$sort.name = 1;
            }
            aggr.push(sortParams);
        } else if (sort == "price") {
            if (sort_dir == "asc") {
                sortParams.$sort.price = -1;
            } else {
                sortParams.$sort.price = 1;
            }
            aggr.push(sortParams);
        }
        if (page) {
            aggr.push({$skip: Number(page) * Number(perPage)})
        }
        if (perPage) {
            aggr.push({$limit: Number(perPage)});
        }
        const items: any[] | any = await this._db.aggregate([
            {
                $facet: {
                    products: aggr,
                    totalsCount: [
                        {$count: "totals"}
                    ]
                }
            }
        ]).catch(e => console.log("Error", e))
        return {
            products: items[0].products,
            totals: items[0].totalsCount[0].totals
        };
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
        const items: Document[] = await this._db.aggregate(aggr);
        return items;
    }
    async searchProduct (searchQuery: any):Promise<Document[]> {
        try {
            const documents: Document[] = await this._db.aggregate([
                {
                    $match: {
                        name: {
                            $regex: eval("/" + searchQuery + "/")
                            // $search: {
                            //     $regex: eval("/" + searchQuery + "/")
                            // }
                            // // $search: searchQuery
                        }
                    }
                }
            ])
            return documents;  
        } catch (error) {
            throw new ErrorHandler(401, error.message)
        }
        
    }
}

export default new ProductDb();