import { Router } from "express";
import BannerController from '../controllers/banner';
import { verifyToken } from "../helpers/jwt";
import { validateAddToCart } from "../helpers/validation";

class BannerRouter {
    private _router: Router = Router();
    private _controller: typeof BannerController = BannerController;
    get router () {
        return this._router;
    }
    constructor() {
        this._configure();
    }
    _configure() {
        this._router.post('/admin/create', verifyToken, this._controller.createBanner);
        this._router.get('/admin/:_id', verifyToken, this._controller.getBannerById);
        this._router.delete('/admin/:_id', verifyToken, this._controller.deleteBanner);
        this._router.put('/admin/:_id', verifyToken, this._controller.updateBanner);
        this._router.get('/admin/', verifyToken, this._controller.getBanners);
        this._router.get('/:_id', this._controller.getBannerById);
        this._router.post('/admin/add_banner_image', verifyToken, this._controller.uploadImage);
    }
}

export = new BannerRouter().router;