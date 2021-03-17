import { Schema, Document, model } from 'mongoose';
import { IAddress } from '../interfaces/address';
import { ICartItemInput, ICartItem } from '../interfaces/cart';
import { TPrice } from '../interfaces/product';

interface IOrderInput extends Document {
    items: ICartItemInput[],
    paymentMethod: string,
    shippingAddress: IAddress,
    billingAddress: IAddress,
    totalQty: number,
    totalPrice: TPrice,
    status: string,
    cartId: string,
    customerId: string
};

interface IOrder extends IOrderInput {
    _id: string
    items: ICartItem[]
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
    totalPrice: { type: {} },
    status: { type: String, default: "pending" },
    cartId: { 
        type: Schema.Types.ObjectId,
        ref: "Cart" 
    },
    customerId: { 
        type: Schema.Types.ObjectId,
        ref: "Customer" 
    }
}, {timestamps: true});

export default model<IOrder | IOrderInput>('Order', OrderSchem);