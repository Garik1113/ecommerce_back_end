import { Model, Document } from "mongoose";
import Attribute from '../models/attribute'
import ErrorHandler from '../models/errorHandler';
import { IAttributeInput } from '../interfaces/attribute';
const ObjectID = require('mongodb').ObjectID;

class AttributeDb {
    protected _db: Model<any> = Attribute;
    get db () {
        return this._db;
    };

    async createAttribute(attribute: IAttributeInput):Promise<Document> {
        const document: Document = await this.db.create(attribute);
        return document;
    }
    async getAttributes():Promise<Document[]> {
        const documents: Document[] = await this.db.find({});
        return documents;
    }
    async customerGetFilters():Promise<Document[]> {
        const documents: Document[] = await this.db.find({allowed: true});
        return documents;
    }
    async getAttributeById(attributeId: string):Promise<Document> {
        const document: Document = await this.db.findById(attributeId);
        return document;
    }
    async deleteAttribute(attributeId: string):Promise<void> {
         await this.db.findByIdAndDelete(attributeId);
    }
    async updateAttribute (_id: string, attributeData: any):Promise<void> {
        try {
            const attribute = {"_id": ObjectID(_id)};
            const updateQuery:any = {};
            for (const key in attributeData) {
                if (Object.prototype.hasOwnProperty.call(attributeData, key)) {
                    const element = attributeData[key];
                    updateQuery[key] = element;
                }
            };
            await this._db.updateOne(attribute, updateQuery, { new: true });
        } catch (error) {
            throw new ErrorHandler(401, error.message)
        }
    }
    
}

export default new AttributeDb();