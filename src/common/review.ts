import { IReviewInput, IReview } from "../interfaces/review";

export const convertReviewObjectToDb = (reviewObj: any = {}):IReviewInput => {
    return {
        customerId: reviewObj.customerId,
        productId: reviewObj.productId,
        rating: reviewObj.rating,
        comment: reviewObj.comment
    }
}

export const convertDbReviewToNormal = (dbReview: any):IReview=> {
    return {
        _id: dbReview._id || "",
        customerId: dbReview.customerId,
        productId: dbReview.productId,
        rating: dbReview.rating,
        comment: dbReview.comment,
        customer: dbReview.customerId
    }
}