import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";
import ProductSubscriptionDb from '../collections/productsubscriptions';
import { convertDbProductSubscriptionToNormal, convertProductSubscriptionObjectToDb } from "../common/productSubscription";
import { IProductSubscriptionInput } from "../interfaces/productSubscription";

class ProductSubscriptionController {
    protected _db: typeof ProductSubscriptionDb = ProductSubscriptionDb;
    get db () {
        return this._db
    };

    public createProductSubscription = async(req: Request, res: Response, next: NextFunction):Promise<void>=> {
        try {
            const productSubscription: IProductSubscriptionInput = convertProductSubscriptionObjectToDb(req.body);
            const result: Document = await this.db.createProductSubscription(productSubscription);
            const document: Document = await this.db.getProductSubscriptionById(result._id);
            const productSubscriptionResult: IProductSubscriptionInput = convertDbProductSubscriptionToNormal(document);
            res.status(200).json({productSubscription: productSubscriptionResult});
        } catch (error) {
            next(error);
        }    
    }
    public getProductSubscriptionById = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { _id } = req.params;
        try {
            const document: Document = await this.db.getProductSubscriptionById(_id);
            const productSubscription: IProductSubscriptionInput = convertDbProductSubscriptionToNormal(document);
            res.status(200).json({ productSubscription });
        } catch (error) {
            next(error);
        }    
    }
    public getProductSubscriptions = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
        try {
            const documents: Document[] = await this.db.getProductSubscriptions();
            const productSubscriptions: IProductSubscriptionInput[] = documents.map(convertDbProductSubscriptionToNormal);
            res.status(200).json({ productSubscriptions });
        } catch (error) {
            next(error);
        }    
    }
    public deleteProductSubscription = async(req: Request, res: Response, next: NextFunction): Promise<void>=> {
        const { _id } = req.params;
        try {
            await this.db.deleteProductSubscription(_id);
            res.status(200).json({ status: "Deleted" });
        } catch (error) {
            next(error);
        }    
    }
}

export default new ProductSubscriptionController();