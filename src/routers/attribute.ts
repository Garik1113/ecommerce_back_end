import { Router } from "express";
import AttributeController from '../controllers/attribute';
import { verifyToken } from "../helpers/jwt";

class AttributeRouter {
    private _router: Router = Router();
    private _controller = AttributeController;
    get router () {
        return this._router;
    }

    constructor() {
        this._configure();
    }

    _configure() {
        this._router.post('/admin/attributes', verifyToken,  this._controller.createAttribute);
        this._router.put('/admin/attributes/:attribute_id',  verifyToken,  this._controller.updateAttribute);
        this._router.delete('/admin/attributes/:attribute_id', verifyToken,  this._controller.deleteAttribute);
        this._router.get('/admin/attributes/:attribute_id', verifyToken,  this._controller.getAttribute);
        this._router.get('/admin/attributes', verifyToken,  this._controller.getAttributes);
    }
}

export = new AttributeRouter().router;