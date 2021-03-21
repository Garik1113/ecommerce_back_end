import { Router } from "express";
import SliderController from '../controllers/slider';
import { verifyToken } from "../helpers/jwt";

class SliderRouter {
    private _router: Router = Router();
    private _controller: typeof SliderController = SliderController;
    get router () {
        return this._router;
    }
    constructor() {
        this._configure();
    }
    _configure() {
        this._router.post('/admin/', verifyToken, this._controller.createSlider);
        this._router.get('/admin/:_id', verifyToken, this._controller.getSliderById);
        this._router.delete('/admin/:_id', verifyToken, this._controller.deleteSlider);
        this._router.put('/admin/:_id', verifyToken, this._controller.updateSlider);
        this._router.get('/admin/', verifyToken, this._controller.getSliders);
        this._router.post('/admin/add_slider_image', verifyToken, this._controller.uploadImage);
        this._router.get('/get_home_slider', this._controller.getHomeSlider);
    }
}

export = new SliderRouter().router;