import { Router } from 'express';
import CategoryRouter from './category';
import ProductRouter from './product';
import UserRouter from './user';
import CartRouter from './cart';
import BannerRouter from './banner';
import CustomerRouter from './customer';
import OrderRouter from './order';

class MainRouter {
    private _router = Router();
    private _subRouterCategory = CategoryRouter;
    private _subRouterProduct = ProductRouter;
    private _subRouterUser = UserRouter;
    private _subRouterCart = CartRouter;
    private _subRouterBanner = BannerRouter;
    private _subRouterCustomer = CustomerRouter;
    private _subRouterOrder = OrderRouter;

    get router() {
        return this._router;
    }

    constructor() {
        this._configure();
    }

    private _configure() {
        this._router.use('/categories', this._subRouterCategory);
        this._router.use('/products', this._subRouterProduct);
        this._router.use('/users', this._subRouterUser);
        this._router.use('/cart', this._subRouterCart);
        this._router.use('/banners', this._subRouterBanner);
        this._router.use('/customers', this._subRouterCustomer);
        this._router.use('/orders', this._subRouterOrder);
    }
}

export = new MainRouter().router;