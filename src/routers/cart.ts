import { Router } from "express";
import CartController from '../controllers/cart';
import { validateAddToCart } from "../helpers/validation";

class CartRouter {
    private _router: Router = Router();
    private _controller = CartController;

    get router () {
        return this._router;
    }

    constructor() {
        this._configure();
    }

    _configure() {
        this.router.post('/create', this._controller.createCart);
        this.router.put('/add_item', validateAddToCart(), this._controller.addItemToCart);
        this.router.put('/delete', this._controller.deleteCartItem);
        this.router.put('/quantity', this._controller.changeCartItemQuantity);
        this.router.get('/:cartId', this._controller.getCart);
        this.router.put('/add-shipping-address', this._controller.addShippingAddress)
        this.router.put('/add-billing-address', this._controller.addBillingAddress)
        this.router.put('/add-payment-method', this._controller.addPaymentMethod)
        
    }
}

export = new CartRouter().router;