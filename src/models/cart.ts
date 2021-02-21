import { Schema, Document, model } from 'mongoose';
import { TAddress } from '../types/address';
import { TCartItem } from '../types/cart';

export interface ICart extends Document {
    _id?: string,
    items?: TCartItem[],
    paymentMethod: string,
    shippingAddress: TAddress,
    billingAddress: TAddress
};

const CartSchema:Schema = new Schema({
    items:  [
        { 
            item: { type: {} },
            quantity: { type: Number }
        }
    ],
    paymentMethod: { type: String },
    shippingAddress: { type: {} },
    billingAddress: { type: {} }
});

export default model<ICart>('Cart', CartSchema);