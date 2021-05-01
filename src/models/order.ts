import { Schema, Document, model } from 'mongoose';
import { IAddress } from '../interfaces/address';
import { ICartItemInput, ICartItem } from '../interfaces/cart';
import { ICustomer } from '../interfaces/customer';

interface IOrderInput extends Document {
    items: ICartItemInput[],
    paymentMethod: string,
    shippingAddress: IAddress,
    billingAddress: IAddress,
    totalQty: number,
    totalPrice: number,
    status: string,
    cartId: string,
    customer: ICustomer
};

interface IOrder extends IOrderInput {
    _id: string
    items: ICartItem[]
}

const OrderSchem: Schema = new Schema({
    items:  [
        { 
            id: String,
            product: {  type: {} },
            quantity: { type: Number }
        }
    ],
    customer: { type: {}},
    paymentMethod: { type: String },
    shippingAddress: { type: {} },
    billingAddress: { type: {} },
    totalQty: { type: Number },
    totalPrice: { type: Number },
    status: { type: String, default: "pending" },
    cartId: { 
        type: Schema.Types.ObjectId,
        ref: "Cart" 
    }
}, { timestamps: true });

export default model<IOrder | IOrderInput>('Order', OrderSchem);