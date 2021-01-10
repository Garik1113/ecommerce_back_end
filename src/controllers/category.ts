import { Model, Document} from "mongoose";
import { deleteOne, getItemById, getItems, insertOne, updateOne } from '../common/db'
import Category, { ICategory } from "../models/category";
import ErrorHandler from "../models/errorHandler";
import { IProduct } from "../models/product";

class CategoryController {
    private _DbCollection: Model<any> = Category;
    defaulMethod() {
        return {
            text:`You'ave reached the ${this.constructor.name} default method`
        };
    };
    public async createOne(categoryObject:ICategory):Promise<Document>   {
        try {
            const category:Document = await insertOne(this._DbCollection, categoryObject);
            return category;
        } catch (error) {
            console.log(error)
            throw new ErrorHandler(error.statusCode, error.message);
        }
    }
    public async deleteOne(_id: string):Promise<void> {
        try {
            await deleteOne(this._DbCollection, _id);
        } catch (error) {
            console.log(error)
            throw new ErrorHandler(error.statusCode, error.message);
        }
    }
    public async updateOne(_id: string,  body: any):Promise<void> {
        try {
            await updateOne(this._DbCollection, _id, body);
            return;
        } catch (error) {
            console.log(error);
            throw new ErrorHandler(error.statusCode, error.message); 
        }
    }
    public async getOne(_id: string):Promise<Document> {
        try {
            const category:Document = await getItemById(this._DbCollection, _id);
            return category;
        } catch (error) {
            console.log(error)
            throw new ErrorHandler(error.statusCode, error.message);
        }
    }
    public async getAll():Promise<Document> {
        try {
            const categories: Document = await getItems(this._DbCollection);
            return categories;
        } catch (error) {
            console.log(error)
            throw new ErrorHandler(error.statusCode, error.message);
        }
    }
}

export = new CategoryController();