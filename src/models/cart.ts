import { Schema, Document, model } from 'mongoose';
import { IAddress } from '../interfaces/address';
import { ICartItemInput, ICartItem } from '../interfaces/cart';

interface ICartInput extends Document {
    id: string,
    items: ICartItemInput[],
    paymentMethod: string,
    shippingAddress: IAddress,
    billingAddress: IAddress,
    totalQty: number,
    totalPrice: number,
    customerId: string,
    stripePaymentMethodId: string,
};

interface ICart extends ICartInput {
    _id: string
    items: ICartItem[]
}

const CartSchema:Schema = new Schema({
    items:  [
        { 
            id: String,
            product: { 
                type: Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: { type: Number },
        }
    ],
    paymentMethod: { type: String },
    shippingAddress: { type: {} },
    billingAddress: { type: {} },
    totalQty: { type: Number },
    totalPrice: { type: {} },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: "Customer"
    },
    stripePaymentMethodId: { type: String }
});

export default model<ICartInput | ICart>('Cart', CartSchema);