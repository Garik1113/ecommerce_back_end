import { Router } from "express";
import ConfigController from '../controllers/config';
import { verifyToken } from "../helpers/jwt";

class ConfigRouter {
    private _router: Router = Router();
    private _controller: typeof ConfigController = ConfigController;
    get router () {
        return this._router;
    }
    constructor() {
        this._configure();
    }
    _configure() {
        this._router.post('/admin/', verifyToken, this._controller.createConfig);
        this._router.put('/admin/:_id', verifyToken, this._controller.updateConfig);
        this._router.get('/admin/', verifyToken, this._controller.getConfig);
        this._router.get('/', this._controller.getConfig);
        this._router.post('/admin/upload_logo', verifyToken, this._controller.uploadImage);
    }
}

export = new ConfigRouter().router;