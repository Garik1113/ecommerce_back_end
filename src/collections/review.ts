import isEmpty from "lodash/isEmpty";
import { Model, Document } from "mongoose";
import Review from "../models/review";
import { IReviewInput } from '../interfaces/review';
const ObjectID = require('mongodb');

class ReviewDb {
    protected _db: Model<any> = Review;
    get db () {
        return this._db;
    };

    async createReview(review: IReviewInput):Promise<Document> {
        const document: Document = await this.db.create(review);
        return document;
    }
    async getReviewById(_id: String):Promise<Document> {
        const document: Document = await this._db.findById(_id).populate(["customerId", "productId"])
        return document;
    }
    async getReviews(product_id:any, customer_id:any):Promise<Document[]> {
        const query:any = {};
        if (product_id) {
            query.productId = product_id
        }
        if (customer_id) {
            query.customerId = ObjectID(customer_id)
        }
        const documents: Document[] = await this.db.find({...query}).populate(["customerId", "productId"]);
        return documents;
    }
    async getReviewsByProductId(productId:any):Promise<Document[]> {
        const documents: Document[] = await this.db.find({productId, status: 'enabled'}).populate("customerId");
        return documents;
    }
    async deleteReview(reviewId: String):Promise<void> {
        await this.db.findByIdAndRemove(reviewId);
    }
    async updateReview(reviewId: String, status: string):Promise<void> {
        if (!status) {
            return;
        } else {
            await this.db.findByIdAndUpdate(reviewId, { status });
        }
    }
}

export default new ReviewDb();