import isEmpty from "lodash/isEmpty";
import { Model, Document } from "mongoose";
import Review from "../models/review";
import { IReviewInput } from '../interfaces/review';


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
        const document: Document = await this._db.findById(_id)
        return document;
    }
    async getReviews(product_id:any, customer_id:any):Promise<Document[]> {
        const query:any = {};
        if(product_id) {
            query.productId = product_id
        }
        if(customer_id) {
            query.customerId = customer_id
        }
        const documents: Document[] = await this.db.find(query).populate("customerId");
        return documents;
    }
    async deleteReview(reviewId: String):Promise<void> {
        await this.db.findByIdAndRemove(reviewId);
    }
    async updateReview(reviewId: String, body: any):Promise<void> {
        const filter = {"_id": reviewId};
        const updateQuery:any = {};
        if(isEmpty(body)){
            return;
        }
        for (const key in body) {
            if (Object.prototype.hasOwnProperty.call(body, key)) {
                const element = body[key];
                updateQuery[key] = element;
            }
        };
        await this.db.findByIdAndUpdate(filter, updateQuery);
    }
}

export default new ReviewDb();