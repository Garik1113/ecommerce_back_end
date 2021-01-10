import { Model, Document } from "mongoose";
import { deleteOne, getItemById, getItems, insertOne, updateOne } from '../common/db';
import ErrorHandler from "../models/errorHandler";
import Product, { IProduct } from "../models/product";

class ProductController {
    private _DbCollection: Model<any> = Product;
    defaulMethod() {
        return {
            text:`You'ave reached the ${this.constructor.name} default method`
        };
    };
    public async createOne(productObject:IProduct):Promise<Document> {
        try {
            const product:Document = await insertOne(this._DbCollection, productObject);
            return product;
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
        } catch (error) {
            console.log(error);
            throw new ErrorHandler(error.statusCode, error.message); 
        }
    }
    public async getOne(_id: string):Promise<Document> {
        try {
            const product:Document = await getItemById(this._DbCollection, _id);
            return product;
        } catch (error) {
            console.log(error)
            throw new ErrorHandler(error.statusCode, error.message);
        }
    }
    public async getAll():Promise<Document> {
        try {
            const products: Document = await getItems(this._DbCollection);
            return products;
        } catch (error) {
            console.log(error)
            throw new ErrorHandler(error.statusCode, error.message);
        }
    }
}

export = new ProductController();