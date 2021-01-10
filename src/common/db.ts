import { Model, MongooseFilterQuery, Document, MongooseDocument } from "mongoose";
import { ICategory } from "../models/category";
import isEmpty from 'lodash/isEmpty'
import { IProduct } from "../models/product";
import { IUser } from "../models/user";

export const getItemById = async (DbCollection: Model<any>, _id: string):Promise<Document> => {
    const item: Document = await DbCollection.findById(_id);
    return item;
};

export const findOne = async (DbCollection: Model<any>, queryObj:any):Promise<Document> => {
    const item: Document = await DbCollection.findOne(queryObj);
    return item;
};

export const getItems = async (DbCollection: Model<any>) => {
    const items: Document = await DbCollection.find();
    return items;
};

export const insertOne = async (DbCollection: Model<any>, item: ICategory | IProduct | IUser) => {
    const dbItem: Document = await DbCollection.create(item);
    return dbItem;
};

export const deleteOne = async (DbCollection: Model<any>, _id: string) => {
    await DbCollection.deleteOne({_id});
    return _id;
};

export const updateOne = async (DbCollection: Model<any>, _id: string, body: any) => {
    const filter:MongooseFilterQuery<any> = { _id };
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
    const updated: Document = await DbCollection.updateOne(filter, updateQuery);
    return updated;
}
