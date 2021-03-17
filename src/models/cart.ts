import { Schema, Document, model } from 'mongoose';
import { IAddress } from '../interfaces/address';
import { ICartItemInput, ICartItem } from '../interfaces/cart';
import { TPrice } from '../interfaces/product';

export interface ICartInput extends Document {
    id: string,
    items: ICartItemInput[],
    paymentMethod: string,
    shippingAddress: IAddress,
    billingAddress: IAddress,
    totalQty: number,
    totalPrice: TPrice,
    customerId: string
};

export interface ICart extends ICartInput {
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
    customerId: {
        type: Schema.Types.ObjectId,
        ref: "Customer"
    }
});

export default model<ICartInput | ICart>('Cart', CartSchema);