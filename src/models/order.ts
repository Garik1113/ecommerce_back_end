import { Schema, Document, model } from 'mongoose';
import { TAddress } from '../types/address';
import { ICartItem, ICartItemDb } from '../types/cart';
import { TPrice } from '../types/product';

export interface IOrder extends Document {
    id: string,
    items: ICartItem[],
    paymentMethod: string,
    shippingAddress: TAddress,
    billingAddress: TAddress,
    totalQty: number,
    totalPrice: TPrice
};

export interface IOrderDb extends IOrder {
    _id: string
    items: ICartItemDb[]
}

const OrderSchem: Schema = new Schema({
    items:  [
        { 
            id: String,
            product: { 
                type: Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: { type: Number },
            cartItemAttributes: [
                {
                    attributeId: {
                        type: String
                    },
                    valueId: {
                        type: String
                    }
                }
            ]
        }
    ],
    paymentMethod: { type: String },
    shippingAddress: { type: {} },
    billingAddress: { type: {} },
    totalQty: { type: Number },
    totalPrice: { type: {} }
});

export default model<IOrder | IOrderDb>('Order', OrderSchem);