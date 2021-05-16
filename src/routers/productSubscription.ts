import { Router } from "express";
import ProductSubscriptionController from '../controllers/productSubscription';
import { verifyCustomerToken, verifyToken } from "../helpers/jwt";

class ProductSubscriptionRouter {
    private _router: Router = Router();
    private _controller = ProductSubscriptionController;
    get router () {
        return this._router;
    }

    constructor() {
        this._configure();
    }

    _configure() {
        this._router.post('/', verifyCustomerToken,  this._controller.createProductSubscription);
        this._router.delete('/admin/:_id', verifyToken,  this._controller.deleteProductSubscription);
        this._router.get('/admin/:_id', verifyToken,  this._controller.getProductSubscriptionById);
        this._router.get('/admin/', verifyToken,  this._controller.getProductSubscriptions);
    }
}

export = new ProductSubscriptionRouter().router;