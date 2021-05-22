import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";
import ReviewDb from '../collections/review';
import { convertReviewObjectToDb, convertDbReviewToNormal } from "../common/review";
import ErrorHandler from "../models/errorHandler";
import { IReview, IReviewInput } from "../interfaces/review";
import ProductDb from '../collections/product';
import { convertDbProductToNormal, convertProductObjectToDbFormat } from '../common/product';
import { IProduct } from '../interfaces/product';

class ReviewController {
    protected _db: typeof ReviewDb = ReviewDb;
    get db () {
        return this._db
    };

    public createReview = async(req: Request, res: Response, next: NextFunction):Promise<void>=> {
        try {
            const review: IReviewInput = convertReviewObjectToDb(req.body);
            const productDb = await ProductDb.getProductById(review.productId);
            if (!productDb) {
                throw new ErrorHandler(203, "Product not found")
            }
            const result: Document = await this.db.createReview(review);
            const document: Document = await this.db.getReviewById(result._id);
            const reviewResult: IReview = convertDbReviewToNormal(document);
            res.status(200).json({review: reviewResult});
        } catch (error) {
            next(error);
        }    
    }
    public getReviewById = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { _id } = req.params;
        try {
            const document: Document = await this.db.getReviewById(_id);
            const review: IReviewInput = convertDbReviewToNormal(document);
            res.status(200).json({ review });
        } catch (error) {
            next(error);
        }    
    }
    public getReviews = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
        const { product_id, customer_id } = req.query;
        try {
            const documents: Document[] = await this.db.getReviews(product_id, customer_id);
            const reviews: IReview[] = documents.map(convertDbReviewToNormal);
            res.status(200).json({ reviews });
        } catch (error) {
            next(error);
        }    
    }
    public getReviewsbyProductId = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
        const { product_id } = req.query;
        try {
            const documents: Document[] = await this.db.getReviewsByProductId(product_id);
            const reviews: IReview[] = documents.map(convertDbReviewToNormal);
            res.status(200).json({ reviews });
        } catch (error) {
            next(error);
        }    
    }
    public deleteReview = async(req: Request, res: Response, next: NextFunction): Promise<void>=> {
        const { _id } = req.params;
        try {
            await this.db.deleteReview(_id);
            res.status(200).json({ status: "Deleted" });
        } catch (error) {
            next(error);
        }    
    }
    public updateReview =  async(req: Request, res: Response, next: NextFunction): Promise<void>=> {
        const { _id } = req.params;
        const { status } = req.body;
        try {
            if (status == 'enabled') {
                const document: Document = await this.db.getReviewById(_id);
                const review: IReview = convertDbReviewToNormal(document);
                const productResult = review.productId;
                if (!productResult) {
                    throw new ErrorHandler(203, "Product not found")
                }
                const product:IProduct = convertDbProductToNormal(productResult);
                const productReviews: Document[] = await this.db.getReviews(product._id, false);
                const reviews: IReview[] = productReviews.map(convertDbReviewToNormal);
                let rating = 0;
                for (let index = 0; index < reviews.length; index++) {
                    const element = reviews[index];
                    rating += Number(element.rating)
                }
                const averageRating = Math.ceil(Number(rating / reviews.length));
                await ProductDb.updateProduct(product._id, { ...convertProductObjectToDbFormat(product), averageRating });
            }
            await this.db.updateReview(_id, status);
            res.status(200).json({ status: "updated" });
        } catch (error) {
            next(error);
        }    
    }
}

export default new ReviewController();