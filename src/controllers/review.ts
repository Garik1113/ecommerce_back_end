import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { Document } from "mongoose";
import { uploadFile } from "../aws/aws";
import ReviewDb from '../collections/review';
import { convertReviewObjectToDb, convertDbReviewToNormal } from "../common/review";
import ErrorHandler from "../models/errorHandler";
import { IReview, IReviewInput } from "../interfaces/review";

class ReviewController {
    protected _db: typeof ReviewDb = ReviewDb;
    get db () {
        return this._db
    };

    public createReview = async(req: Request, res: Response, next: NextFunction):Promise<void>=> {
        try {
            const review: IReviewInput = convertReviewObjectToDb(req.body);
            const result: Document = await this.db.createReview(review);
            const document: Document = await this.db.getReviewById(result._id);
            const reviewResult: IReviewInput = convertDbReviewToNormal(document);
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
        try {
            await this.db.updateReview(_id, req.body);
            res.status(200).json({ status: "updated" });
        } catch (error) {
            next(error);
        }    
    }
    public async uploadImage(req: Request, res: Response, next: NextFunction):Promise<void> {
        try {
            if (req.files) {
                if (req.files.image) {
                    const fileName: string = await uploadFile('reviews', req.files.image as UploadedFile);
                    res.status(200).json({ fileName })
                }
            } else {
                throw new ErrorHandler(309, "Image not found")
            }
        } catch (error) {
            next(error)
        }
    }
}

export default new ReviewController();