import { Router } from 'express';
import CategoryRouter from './category';
import ProductRouter from './product';
import UserRouter from './user';
import CartRouter from './cart';
import BannerRouter from './banner';
import CustomerRouter from './customer';
import OrderRouter from './order';
import FilterRouter from './filter';
import SliderRouter from './slider';
import ReviewRouter from './review';

class MainRouter {
    private _router = Router();
    private _subRouterCategory = CategoryRouter;
    private _subRouterProduct = ProductRouter;
    private _subRouterUser = UserRouter;
    private _subRouterCart = CartRouter;
    private _subRouterBanner = BannerRouter;
    private _subRouterCustomer = CustomerRouter;
    private _subRouterOrder = OrderRouter;
    private _subFilterRouter = FilterRouter;
    private _subSliderRouter = SliderRouter;
    private _subReviewRouter = ReviewRouter;

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
        this._router.use('/filters', this._subFilterRouter);
        this._router.use('/sliders', this._subSliderRouter);
        this._router.use('/reviews', this._subReviewRouter);
    }
}

export = new MainRouter().router;