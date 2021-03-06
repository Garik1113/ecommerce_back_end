import { Model, Document } from "mongoose";
import { convertDbProductToNormal, convertProductObjectToDbFormat } from "../common/product";
import ErrorHandler from "../models/errorHandler";
import Product from "../models/product";
import { IProduct, IProductDb } from "../types/product";
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
    public async createProduct(req: Request, res: Response, next: NextFunction):Promise<IProduct | any> {
        try {
            const productObject: any = req.body;
            const readyForDbProduct: IProduct = convertProductObjectToDbFormat(productObject);
            const productDb: Document = await ProductDb.createProduct(readyForDbProduct);
            const product: IProductDb = convertDbProductToNormal(productDb);

            res.status(200).json({product})
        } catch (error) {
            next(error);
        }
    }
    public async getProductById(req: Request, res: Response, next: NextFunction):Promise<IProduct | any> {
        const {_id} = req.params;
        try {
            const document: Document = await ProductDb.getProductById(_id);
            const product: IProductDb = convertDbProductToNormal(document);

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
    public async getProductsByCategory(req: Request, res: Response, next: NextFunction):Promise<IProduct[] | any> {
        const { _id } = req.params;
        try {
            const documents: Document[] = await ProductDb.getProductsByCategory(_id);
            const products: IProductDb[] = documents.map(convertDbProductToNormal);
            res.status(200).json({ products });
        } catch (error) {
            next(error)
        }
    }
    public async getAllProducts(req: Request, res: Response, next: NextFunction):Promise<IProduct[] | any> {
        try {
            const documents: Document[] = await ProductDb.getAllProducts();
            const products: IProductDb[] = documents.map(document => convertDbProductToNormal(document));
            
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