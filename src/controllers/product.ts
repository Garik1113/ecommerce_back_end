import { Model, Document } from "mongoose";
import { convertDbProductToNormal, convertProductObjectToDbFormat, getFiltersFromParams } from "../common/product";
import ErrorHandler from "../models/errorHandler";
import Product from "../models/product";
import { IProductInput, IProduct } from "../interfaces/product";
import ProductDb from '../collections/product';
import CategoryDb from '../collections/category';
const ObjectID = require('mongodb').ObjectID;
import Category from "../models/category";
import { NextFunction, Request, Response } from "express";
import { uploadFile } from "../aws/aws";
import { UploadedFile } from "express-fileupload";
import { asyncForEach } from '../helpers/asyncForEach';
import { convertDbCategoryToNormal } from '../common/category';

class ProductController {
    private _DbCollection: Model<any> = Product;
    defaulMethod() {
        return {
            text:`You'ave reached the ${this.constructor.name} default method`
        };
    };
    public async createProduct(req: Request, res: Response, next: NextFunction):Promise<IProductInput | any> {
        try {
            const productObject: any = req.body;
            const readyForDbProduct: IProductInput = convertProductObjectToDbFormat(productObject);
            const productDb: Document = await ProductDb.createProduct(readyForDbProduct);
            const product: IProduct = convertDbProductToNormal(productDb);
            const { categories } = product;
            await asyncForEach(categories, async (id:string) => {
                await Category.updateOne({_id: id}, {
                    $push: {
                        products: ObjectID(product._id)
                    }
                })
            })
            res.status(200).json({ product })
        } catch (error) {
            next(error);
        }
    }
    public async getProductById(req: Request, res: Response, next: NextFunction):Promise<IProductInput | any> {
        const {_id} = req.params;
        try {
            const document: Document = await ProductDb.getProductById(_id);
            const product: IProduct = convertDbProductToNormal(document);

            res.status(200).json({ product })
        } catch (error) {
            next(error)
        }
    }
    public async updateProduct(req: Request, res: Response, next: NextFunction):Promise<void> {
        const { _id } = req.params;
        const { body } = req;
        try {
            await ProductDb.updateProduct(_id, convertProductObjectToDbFormat(body));
            res.status(200).json({ status: "Updated" });
        } catch (error) {
            next(error) 
        }
    }
    public async deleteProduct(req: Request, res: Response, next: NextFunction):Promise<void> {
        const { _id } = req.params;
        try {
            await ProductDb.deleteProduct(_id);
            res.status(200).json({ status: "Deleted" });
        } catch (error) {
            next(error);
        }
    }
    public async getProductsByCategory(req: Request, res: Response, next: NextFunction):Promise<IProductInput[] | any> {
        const { category_id } = req.params;
        try {
            const documents: Document[] = await ProductDb.getProductsByCategory(category_id, req.query);
            if(category_id) {
                const categoryResult:Document = await CategoryDb.getCategoryById(category_id);
                const category = convertDbCategoryToNormal(categoryResult);
                const products: IProduct[] = documents.map(convertDbProductToNormal);
                res.status(200).json({ products, totalProducts:  category.products.length});
            } else {
                const products: IProduct[] = documents.map(convertDbProductToNormal);
                res.status(200).json({ products });
            }
        } catch (error) {
            next(error)
        }
    }
    public async getAllProducts(req: Request, res: Response, next: NextFunction):Promise<IProductInput[] | any> {
        const { date, ids, name, limit, skip } = req.query;
        try {
            const documents: Document[] = await ProductDb.getAllProducts({ date, ids, name, limit, skip });
            const products: IProduct[] = documents.map(document => convertDbProductToNormal(document));
            res.status(200).json({ products });
        } catch (error) {
            next(error)
        }
    }
    public async uploadImage(req: Request, res: Response, next: NextFunction):Promise<void> {
        try {
            if (req.files) {
                if(req.files.image) {
                    const fileName: string = await uploadFile("products", req.files.image as UploadedFile);
                    res.status(200).json({ fileName })
                }
            } else {
                throw new ErrorHandler(309, "Image not found");
            }
        } catch (error) {
            next(error)
        }
    }
}

export = new ProductController();