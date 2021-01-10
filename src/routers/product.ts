import { NextFunction, Router, Request, Response } from "express";
import ProductController from '../controllers/product'
import { IProduct } from "../models/product";
import { Document } from 'mongoose';

class ProductRouter {
    private _router: Router = Router();
    private _controller = ProductController;
    get router () {
        return this._router;
    }

    constructor() {
        this._configure();
    }

    _configure() {
        this._router.post('/', async (req: Request, res: Response, next: NextFunction):Promise<void> => {    
            try {
                const result = await this._controller.createOne(req.body);
                res.status(200).json(result);
            } catch (error) {
                next(error);
            };
        });
        this._router.delete('/:_id', async (req: Request, res: Response, next: NextFunction):Promise<void> => {    
            try {
                await this._controller.deleteOne(req.params._id);
                res.status(200).json({ status: "Deleted" });
            } catch (error) {
                next(error);
            };
        });
        this._router.put('/:_id', async (req: Request, res: Response, next: NextFunction):Promise<void> => {
            const { _id } = req.params;
            try {
                await this._controller.updateOne( _id, req.body);
                res.status(200).json({ status: "Updated" });
            } catch (error) {
                next(error);
            };
        });
        this._router.get('/:_id', async (req: Request, res: Response, next: NextFunction):Promise<void> => {
            const { _id } = req.params;
            try {
                const product: Document = await this._controller.getOne(_id);
                res.status(200).json({ product });
            } catch (error) {
                next(error);
            };
        });
        this._router.get('/', async (req: Request, res: Response, next: NextFunction):Promise<void> => {
            try {
                const products: Document = await this._controller.getAll();
                res.status(200).json({ products });
            } catch (error) {
                next(error);
            };
        });
    }
}

export = new ProductRouter().router;