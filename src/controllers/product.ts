import { Model, Document } from "mongoose";
import { convertDbProductToNormal, convertProductObjectToDbFormat } from "../common/product";
import ErrorHandler from "../models/errorHandler";
import Product, { IProduct } from "../models/product";
import { TProduct } from "../types/product";
import ProductDb from '../collections/product';
import { NextFunction, Request, Response } from "express";
import { uploadFile } from "../aws/aws";
import { UploadedFile } from "express-fileupload";

class ProductController {
    private _DbCollection: Model<any> = Product;
    defaulMethod() {
        return {
            text:`You'ave reached the ${this.constructor.name} default method`
        };
    };
    public async createProduct(req: Request, res: Response, next: NextFunction):Promise<TProduct | any> {
        try {
            const productObject: any = req.body;
            const readyForDbProduct: TProduct = convertProductObjectToDbFormat(productObject);
            const productDb: Document = await ProductDb.createProduct(readyForDbProduct);
            const product: TProduct = convertDbProductToNormal(productDb);

            res.status(200).json({product})
        } catch (error) {
            next(error);
        }
    }
    public async getProductById(req: Request, res: Response, next: NextFunction):Promise<TProduct | any> {
        const {_id} = req.params;
        try {
            const document: Document = await ProductDb.getProductById(_id);
            const product: TProduct = convertDbProductToNormal(document);

            res.status(200).json({product})
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
    public async getProductsByCategory(req: Request, res: Response, next: NextFunction):Promise<TProduct[] | any> {
        const { _id } = req.params;
        try {
            const documents: Document[] = await ProductDb.getProductsByCategory(_id);
            const products: TProduct[] = documents.map(convertDbProductToNormal);
            res.status(200).json({ products });
        } catch (error) {
            next(error)
        }
    }
    public async getAllProducts(req: Request, res: Response, next: NextFunction):Promise<TProduct[] | any> {
        try {
            const documents: Document[] = await ProductDb.getAllProducts();
            const products: TProduct[] = documents.map(document => convertDbProductToNormal(document));
            
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