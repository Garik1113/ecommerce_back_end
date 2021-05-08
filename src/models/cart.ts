import { Schema, Document, model } from 'mongoose';
import { IAddress } from '../interfaces/address';
import { ICartItemInput, ICartItem, ShippingMethod, PaymentMethod } from '../interfaces/cart';
import { TCurrency } from '../interfaces/product';

interface ICartInput extends Document {
    id: string,
    items: ICartItemInput[],
    paymentMethod: PaymentMethod,
    shippingMethod: ShippingMethod,
    shippingAddress: IAddress,
    billingAddress: IAddress,
    totalQty: number,
    subTotal: number,
    totalPrice: number,
    customerId: string,
    stripePaymentMethodId: string,
    currency: TCurrency
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
    paymentMethod: { type: {} },
    shippingMethod: { type: {} },
    shippingAddress: { type: {} },
    billingAddress: { type: {} },
    totalQty: { type: Number },
    subTotal: { type: {} },
    totalPrice: { type: {} },
    currency: { type: {} },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: "Customer"
    },
    stripePaymentMethodId: { type: String }
});

export default model<ICartInput | ICart>('Cart', CartSchema);