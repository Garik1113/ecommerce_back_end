import { Model, Document } from "mongoose";
import Filter from "../models/filters";
import { IFilterInput } from '../interfaces/filters';
import ErrorHandler from '../models/errorHandler';
const ObjectID = require('mongodb').ObjectID;

class FilterDb {
    protected _db: Model<any> = Filter;
    get db () {
        return this._db;
    };

    async createFilter(filter: IFilterInput):Promise<Document> {
        const document: Document = await this.db.create(filter);
        return document;
    }
    async getFilters():Promise<Document[]> {
        const documents: Document[] = await this.db.find({});
        return documents;
    }
    async customerGetFilters():Promise<Document[]> {
        const documents: Document[] = await this.db.find({allowed: true});
        return documents;
    }
    async getFilterById(filterId: string):Promise<Document> {
        const document: Document = await this.db.findById(filterId);
        return document;
    }
    async deleteFilter(filterId: string):Promise<void> {
         await this.db.findByIdAndDelete(filterId);
    }
    async updateFilter (_id: string, filterData: any):Promise<IFilterInput | any> {
        try {
            const filter = {"_id": ObjectID(_id)};
            const updateQuery:any = {};
            for (const key in filterData) {
                if (Object.prototype.hasOwnProperty.call(filterData, key)) {
                    const element = filterData[key];
                    updateQuery[key] = element;
                }
            };
            await this._db.updateOne(filter, updateQuery, { new: true });
        } catch (error) {
            throw new ErrorHandler(401, error.message)
        }
    }
    
}

export default new FilterDb();