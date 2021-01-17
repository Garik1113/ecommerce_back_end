import { Model, Document } from "mongoose";
import { deleteOne, getItemById, getItems, insertOne, updateOne } from '../common/db';
import { convertDbProductToNormal, convertProductObjectToDbFormat } from "../common/product";
import ErrorHandler from "../models/errorHandler";
import Product, { IProduct } from "../models/product";
import { TProduct } from "../types/product";
import ProductDb from '../collections/product';

class ProductController {
    private _DbCollection: Model<any> = Product;
    defaulMethod() {
        return {
            text:`You'ave reached the ${this.constructor.name} default method`
        };
    };
    public async createProduct(productObject:any):Promise<TProduct> {
        try {
            const readyForDbProduct: TProduct = convertProductObjectToDbFormat(productObject);
            const productDb: Document = await ProductDb.createProduct(readyForDbProduct);
            const product: TProduct = convertDbProductToNormal(productDb);

            return product;
        } catch (error) {
            console.log(error)
            throw new ErrorHandler(error.statusCode, error.message);
        }
    }
    public async getProductById(_id: string):Promise<TProduct> {
        try {
            const document: Document = await ProductDb.getProductById(_id);
            const product: TProduct = convertDbProductToNormal(document);

            return product;
        } catch (error) {
            console.log(error)
            throw new ErrorHandler(error.statusCode, error.message);
        }
    }
    public async updateProduct(_id: string,  body: any):Promise<void> {
        try {
            await ProductDb.updateProduct(_id, body);
        } catch (error) {
            console.log(error);
            throw new ErrorHandler(error.statusCode, error.message); 
        }
    }
    public async deleteProduct(_id: string):Promise<void> {
        try {
            await ProductDb.deleteProduct(_id)
        } catch (error) {
            console.log(error)
            throw new ErrorHandler(error.statusCode, error.message);
        }
    }
    public async getProductsByCategory(_id: String):Promise<TProduct[]> {
        try {
            const documents: Document[] = await ProductDb.getProductsByCategory(_id);
            const products: TProduct[] = documents.map(document => convertDbProductToNormal(document));

            return products;
        } catch (error) {
            console.log(error)
            throw new ErrorHandler(error.statusCode, error.message);
        }
    }
    public async getAllProducts():Promise<TProduct[]> {
        try {
            const documents: Document[] = await ProductDb.getAllProducts();
            const products: TProduct[] = documents.map(document => convertDbProductToNormal(document));
            
            return products;
        } catch (error) {
            console.log(error)
            throw new ErrorHandler(error.statusCode, error.message);
        }
    }
}

export = new ProductController();