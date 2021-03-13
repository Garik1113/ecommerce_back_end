import { Router } from "express";
import OrderController from '../controllers/order';

class OrderRouter {
    private _router: Router = Router();
    private _controller = OrderController;

    get router () {
        return this._router;
    }

    constructor() {
        this._configure();
    }

    _configure() {
        this.router.post('/place_order', this._controller.placeOrder)
    }
}

export = new OrderRouter().router;