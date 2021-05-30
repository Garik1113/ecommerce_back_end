import { Model, Document } from "mongoose";
import ErrorHandler from "../models/errorHandler";
const ObjectID = require('mongodb').ObjectID;
import Product from "../models/product";
import ConfigController from '../controllers/config';
import { IProductInput } from "../interfaces/product";
import { replaceQuotes } from '../helpers/objectId';
import AttributeDb from './attribute';
import { convertDbAttributeToNormal } from '../common/attribute';
import { isEmpty } from 'lodash';


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
    async getProducts (params: any): Promise<any> {
        const perPage = await ConfigController.getConfigValue("productsPerPage");
        const { ids, page, discount, price_min, price_max, sort, sort_dir, category_id } = params;
        const attributesResult = await AttributeDb.getAttributes();
        const attributeCodes = attributesResult.map(convertDbAttributeToNormal).map(a => a.code);
        const filters:any = {};
        for (const key in params) {
            if (Object.prototype.hasOwnProperty.call(params, key)) {
                const value = params[key];
                if (attributeCodes.includes(key) && value) {
                    filters[key] = value;
                }
            }
        }
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
            matchParams.$match.discountedPrice = {
                $gt: 0
            }
        }
        if (price_min && price_min !== "undefined") {
            matchParams.$match.defaultPrice = {
                $gte: Number(price_min)
            };
        }
        if (price_max && price_max !== "undefined") {
            matchParams.$match.defaultPrice = {
                ...matchParams.$match.defaultPrice,
                $lte: Number(price_max)
            };
        }
        
        if (!isEmpty(filters)) {
            for (const key in filters) {
                if (Object.prototype.hasOwnProperty.call(filters, key)) {
                    const element = filters[key];
                    matchParams.$match = {
                        ...matchParams.$match,
                        [`filters.${key}`]: element
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
                sortParams.$sort.defaultPrice = -1;
            } else {
                sortParams.$sort.defaultPrice = 1;
            }
            aggr.push(sortParams);
        }
        if (page) {
            aggr.push({$skip: Number(page) * Number(perPage)})
        }
        if (perPage) {
            aggr.push({$limit: Number(perPage)});
        }
        console.log("matchParams['$match']", matchParams['$match'])
        const items: any[] | any = await this._db.aggregate([
            {
                $facet: {
                    products: aggr,
                    total: [
                        {
                            $match: matchParams['$match']
                        },
                        {
                            $count: "count"
                        },
                    ],
                    prices: [
                        {
                            $group: {
                                _id: "_id",
                                minPrice: { 
                                    $min: "$defaultPrice",
                                },
                                maxPrice: { 
                                    $max: "$defaultPrice",
                                },
                            }
                        }
                    ]
                }
            }
        ]).catch(e => console.log("Error", e))

        const total = items[0].total[0] ? items[0].total[0].count: 1;
        const  minPrice = items[0].prices[0] ? items[0].prices[0].minPrice : 0;
        const  maxPrice =  items[0].prices[0] ? items[0].prices[0].maxPrice : 0;

        return {
            products: items[0].products,
            totals: total,
            perPage: perPage || 9,
            minPrice,
            maxPrice,
        };
    }
    async searchProduct (searchQuery: any):Promise<Document[]> {
        try {
            const documents: Document[] = await this._db.aggregate([
                {
                    $match: {
                        name: {
                            $regex: eval("/" + searchQuery + "/")
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