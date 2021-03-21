import { Router } from "express";
import ReviewController from '../controllers/review';
import { verifyCustomerToken } from "../helpers/jwt";

class ReviewRouter {
    private _router: Router = Router();
    private _controller: typeof ReviewController = ReviewController;
    get router () {
        return this._router;
    }
    constructor() {
        this._configure();
    }
    _configure() {
        this._router.post('/admin/create', verifyCustomerToken, this._controller.createReview);
        this._router.get('/admin/:_id', verifyCustomerToken, this._controller.getReviewById);
        this._router.delete('/admin/:_id', verifyCustomerToken, this._controller.deleteReview);
        this._router.put('/admin/:_id', verifyCustomerToken, this._controller.updateReview);
        this._router.get('/admin/', verifyCustomerToken, this._controller.getReviews);
        this._router.get('/:_id', this._controller.getReviewById);

        //Customer Routes
        this._router.post('/', verifyCustomerToken, this._controller.createReview);
        this._router.get('/', verifyCustomerToken, this._controller.getReviews);
        this._router.get('/:_id', verifyCustomerToken, this._controller.getReviewById);
        this._router.delete('/:_id', verifyCustomerToken, this._controller.deleteReview);
        this._router.put('/:_id', verifyCustomerToken, this._controller.updateReview);
        
        this._router.get('/:_id', this._controller.getReviewById);
    }
}

export = new ReviewRouter().router;