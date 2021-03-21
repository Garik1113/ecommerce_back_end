import { Router } from "express";
import FilterController from '../controllers/filter';
import { verifyToken } from "../helpers/jwt";

class FilterRouter {
    private _router: Router = Router();
    private _controller = FilterController;
    get router () {
        return this._router;
    }

    constructor() {
        this._configure();
    }

    _configure() {
        this._router.post('/admin/filters', verifyToken,  this._controller.createFilter);
        this._router.put('/admin/filters/:filter_id',  verifyToken,  this._controller.updateFilter);
        this._router.delete('/admin/filters/:filter_id', verifyToken,  this._controller.deleteFilter);
        this._router.get('/admin/filters/:filter_id', verifyToken,  this._controller.getFilter);
        this._router.get('/admin/filters', verifyToken,  this._controller.getFilters);
        this._router.get('/filters', this._controller.customerGetFilters);
    }
}

export = new FilterRouter().router;