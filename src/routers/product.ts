import { NextFunction, Router, Request, Response } from "express";
import ProductController from '../controllers/product';
import { Document } from 'mongoose';
import { TProduct } from "../types/product";
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
        this._router.get('/admin/get_products', verifyToken, this._controller.getAllProducts);
        this._router.get('/admin/get_product/:_id', verifyToken, this._controller.getProductById);
        this._router.put('/admin/update/:_id', verifyToken, this._controller.updateProduct);
        this._router.get('/admin/products_by_category/:_id', verifyToken, this._controller.getProductsByCategory);
        this._router.delete('/admin/:_id', verifyToken, this._controller.deleteProduct);
        this._router.post('/admin/upload_product_image', verifyToken, this._controller.uploadImage);
        this._router.post('/admin/values/upload_product_image', verifyToken, this._controller.uploadValueImage);
        
    }
}

export = new ProductRouter().router;