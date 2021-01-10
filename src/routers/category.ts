import { Router, Request, Response, NextFunction } from 'express';
import CategoryController from '../controllers/category';
import { Document } from 'mongoose';

class CategoryRouter {
    private _router = Router();
    private _controller = CategoryController;

    get router() {
        return this._router;
    }

    constructor() {
        this._configure();
    }

    /**
     * Connect routes to their matching controller endpoints.
    */
     private _configure() {
        this._router.post('/create_one', async (req: Request, res: Response, next: NextFunction) => {    
            try {
                const result = await this._controller.createOne(req.body);
                res.status(200).json(result);
            } catch (error) {
                next(error);
            };
        });
        this._router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {    
            try {
                await this._controller.deleteOne(req.params.id);
                res.status(200).json({status: "Deleted"});
            } catch (error) {
                next(error);
            };
        });
        this._router.put('/:_id', async (req: Request, res: Response, next: NextFunction) => {
            const { _id } = req.params;
            try {
                await this._controller.updateOne( _id, req.body);
                res.status(200).json({status: "Updated"});
            } catch (error) {
                next(error);
            };
        });
        this._router.get('/:_id', async (req: Request, res: Response, next: NextFunction) => {
            const { _id } = req.params;
            try {
                const category:Document = await this._controller.getOne(_id);
                res.status(200).json({ category });
            } catch (error) {
                next(error);
            };
        });
        this._router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const categories: Document = await this._controller.getAll();
                res.status(200).json({ categories });
            } catch (error) {
                next(error);
            };
        });
    }
};

export = new CategoryRouter().router;