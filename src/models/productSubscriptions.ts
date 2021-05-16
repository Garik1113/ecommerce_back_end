import { Schema, model, Document } from 'mongoose';

interface IProductSubscriptionInput extends Document {
    productId: string,
    customerId: string,

};

interface IProductSubscription extends IProductSubscriptionInput {
    _id: string
}

const ProductSubscriptionSchema:Schema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product"
    },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: "Customer"
    }
}, {timestamps: true});

export default model<IProductSubscription | IProductSubscriptionInput>('ProductSubscription', ProductSubscriptionSchema);