import { Router } from 'express';
import CategoryController from '../controllers/category';
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
        //Admin routes
        this._router.post('/admin/', verifyToken, this._controller.createCategory);
        this._router.get('/admin/', verifyToken, this._controller.getAllCategories);
        this._router.delete('/admin/:_id', verifyToken, this._controller.deleteCategory);
        this._router.get('/admin/:_id', verifyToken, this._controller.getCategoryById);
        this._router.put('/admin/:_id', verifyToken, this._controller.updateCategory)

        //Customer routes
        this._router.get('/:_id', this._controller.getCategoryById);
        this._router.get('/', this._controller.getAllCategories);
    }
};

export = new CategoryRouter().router;