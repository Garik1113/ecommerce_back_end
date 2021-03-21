import { Schema, model, Document } from 'mongoose';


interface IReviewInput extends Document {
    customerId: string,
    productId: string,
    rating: number,
    comment: string
};

interface IReview extends IReviewInput {
    _id: string
}

const ReviewSchem:Schema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: "Customer", 
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product", 
        required: true
    },
    comment: { type: String, default: ""},
    rating: { type: Number, default: 5, max: 10}
}, {timestamps: true});

export default model<IReview | IReviewInput>('Review', ReviewSchem);