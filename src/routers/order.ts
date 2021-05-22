import { Router } from "express";
import OrderController from '../controllers/order';
import { verifyCustomerToken, verifyToken } from '../helpers/jwt';

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
        this.router.post('/', this._controller.placeOrder)
        this.router.get('/', verifyCustomerToken, this._controller.getOrdersByCustomer)
        this.router.get('/admin', verifyToken, this._controller.getOrders)
        this.router.delete('/admin/:orderId', verifyToken, this._controller.deleteOrder)
        this.router.get('/admin/:orderId', verifyToken, this._controller.getOrder)
        this.router.put('/admin/status', verifyToken, this._controller.updateOrderStatus)
    }
}

export = new OrderRouter().router;