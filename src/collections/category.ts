import { Model, Document } from "mongoose";
const ObjectID = require('mongodb').ObjectID;
import Category from "../models/category";
import isEmpty from 'lodash/isEmpty'
import { ICategoryInput } from "../interfaces/category";
import { ParsedUrlQuery } from 'querystring';

class CategoryDb {
    protected _db:Model<any> = Category;
    get db() {
        return this._db;
    }

    async createItem (category: ICategoryInput):Promise<Document> {
        const document:Document = await this._db.create(category);
        return document;
    }

    async getCategoryById (_id: String):Promise<Document> {
        const document:Document = await this._db.findById(_id);
        return document;
    }

    async deleteCategory (_id: String):Promise<void> {
        await this._db.deleteOne({_id});
    }

    async updateCategory (_id: string, body: any):Promise<Document | any> {
        const filter = {"_id": ObjectID(_id)};
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
        const updated: Document = await this._db.findByIdAndUpdate(filter, updateQuery);
        return updated;
    }

    async getCategories(include_in_menu: any):Promise<Document[]> {
        const query = include_in_menu ? {
            include_in_menu: true
        } : {}
        const items: Document[] = await this._db.find(query);
        return items;
    }
    
}

export default new CategoryDb()