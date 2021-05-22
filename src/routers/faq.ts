import { Router } from "express";
import FaqController from '../controllers/faq';
import { verifyToken } from "../helpers/jwt";

class FaqRouter {
    private _router: Router = Router();
    private _controller: typeof FaqController = FaqController;
    get router () {
        return this._router;
    }
    constructor() {
        this._configure();
    }
    _configure() {
        this._router.post('/admin/create', verifyToken, this._controller.createFaq);
        this._router.get('/admin/:_id', verifyToken, this._controller.getFaqById);
        this._router.delete('/admin/:_id', verifyToken, this._controller.deleteFaq);
        this._router.put('/admin/:_id', verifyToken, this._controller.updateFaq);
        this._router.get('/admin/', verifyToken, this._controller.getFaqs);
        this._router.get('/', this._controller.getFaqs);
    }
}

export = new FaqRouter().router;