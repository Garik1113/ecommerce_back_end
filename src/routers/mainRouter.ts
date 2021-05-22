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
import AttributeRouter from './attribute';
import LocationRoutes from './locations';
import ProductSubscriptionRouter from './productSubscription';
import ConfigRoutes from './config';
import FaqRouter from './faq';

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
    private _subAttributeRouter = AttributeRouter;
    private _subLocationRouter = LocationRoutes;
    private _subConfigRouter = ConfigRoutes;
    private _subProductSubscriptionRouter = ProductSubscriptionRouter;
    private _subFaqRouter = FaqRouter;


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
        this._router.use('/attributes', this._subAttributeRouter);
        this._router.use('/locations', this._subLocationRouter);
        this._router.use('/configs', this._subConfigRouter);
        this._router.use('/productSubscriptions', this._subProductSubscriptionRouter);
        this._router.use('/faqs', this._subFaqRouter);
    }
}

export = new MainRouter().router;