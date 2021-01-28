import { Router, Request, Response, NextFunction } from 'express';
import CategoryController from '../controllers/category';
import { Document, ObjectId } from 'mongoose';
import { TCategory } from '../types/category';
import { verifyToken } from '../helpers/jwt';

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
        this._router.post('/admin/', verifyToken, async (req: Request, res: Response, next: NextFunction) => {    
            try {
                const result = await this._controller.createCategory(req.body);
                res.status(200).json(result);
            } catch (error) {
                next(error);
            };
        });
        this._router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const categories: TCategory[] = await this._controller.getAllCategories();
                res.status(200).json({ categories });
            } catch (error) {
                next(error);
            };
        });
        this._router.get('/admin/', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
            try {
                const categories: TCategory[] = await this._controller.adminGetAllCategories();
                res.status(200).json({ categories });
            } catch (error) {
                next(error);
            };
        });
        this._router.delete('/admin/:_id', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
            try {
                await this._controller.deleteCategory(req.params._id);
                res.status(200).json({status: "Deleted"});
            } catch (error) {
                next(error);
            };
        });
        this._router.get('/:_id', async (req: Request, res: Response, next: NextFunction) => {
            const _id:String = req.params._id;
            try {
                const category:TCategory = await this._controller.getCategoryById(_id);
                res.status(200).json({ category });
            } catch (error) {
                next(error);
            };
        });
        this._router.get('/admin/:_id', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
            const _id:String = req.params._id;
            try {
                const category:TCategory = await this._controller.getCategoryById(_id);
                res.status(200).json({ category });
            } catch (error) {
                next(error);
            };
        });
        this._router.put('/admin/:_id', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
            const { _id } = req.params;
            try {
                await this._controller.updateCategory( _id, req.body);
                res.status(200).json({status: "Updated"});
            } catch (error) {
                next(error);
            };
        });
    }
};

export = new CategoryRouter().router;