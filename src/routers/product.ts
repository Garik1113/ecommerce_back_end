import { Router } from "express";
import ProductController from '../controllers/product';
import { verifyToken } from "../helpers/jwt";


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
        //Admin Routes
        this._router.post('/admin', verifyToken, this._controller.createProduct);
        this._router.get('/admin/get_products', verifyToken, this._controller.adminGetProducts);
        this._router.get('/admin/get_product/:_id', verifyToken, this._controller.adminGetProductById);
        this._router.put('/admin/update/:_id', verifyToken, this._controller.updateProduct);
        this._router.delete('/admin/:_id', verifyToken, this._controller.deleteProduct);
        this._router.post('/admin/upload_image', verifyToken, this._controller.uploadImage);
        //Customer Routes
        this._router.get('/get_products/', this._controller.getProducts);
        this._router.get('/get_product/:_id', this._controller.getProductById);
        this._router.get('/search', this._controller.searchProduct);
        
    }
}

export = new ProductRouter().router;