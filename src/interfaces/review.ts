import { ICustomer } from './customer';

export interface IReviewInput {
    customerId: string,
    productId: string,
    rating: number,
    comment: string
};

export interface IReview extends IReviewInput {
    _id: string,
    customer: ICustomer
}