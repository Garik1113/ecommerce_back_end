import { Model, Document } from "mongoose";
const ObjectID = require('mongodb').ObjectID;
import Category, { ICategory } from "../models/category";
import isEmpty from 'lodash/isEmpty'
import { TCategory } from "../types/category";

class CategoryDb {
    protected _db:Model<ICategory> = Category;
    get db() {
        return this._db;
    }

    async createItem (category: TCategory):Promise<Document> {
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

    async getCategories():Promise<Document[]> {
        const items: Document[] = await this._db.find();
        return items;
    }
}

export default new CategoryDb()