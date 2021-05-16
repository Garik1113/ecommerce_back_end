import { Schema, Document, model } from 'mongoose';
import { IAddress } from '../interfaces/address';
import { ICartItemInput, ICartItem, PaymentMethod, ShippingMethod } from '../interfaces/cart';
import { ICustomer } from '../interfaces/customer';
import { TStatus } from '../interfaces/order';
import { TCurrency } from '../interfaces/product';

interface IOrderInput extends Document {
    items: ICartItemInput[],
    paymentMethod: PaymentMethod,
    shippingMethod: ShippingMethod,
    shippingAddress: IAddress,
    billingAddress: IAddress,
    totalQty: number,
    subTotal: number,
    totalPrice: number,
    currency: TCurrency,
    status: TStatus,
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
    paymentMethod: { type: {} },
    shippingMethod: { type: {} },
    shippingAddress: { type: {} },
    billingAddress: { type: {} },
    totalQty: { type: Number },
    subTotal: { type: Schema.Types.Decimal128 },
    totalPrice: { type: Schema.Types.Decimal128 },
    currency: { type: {} },
    status: { type: {} },
    cartId: { 
        type: Schema.Types.ObjectId,
        ref: "Cart" 
    }
}, { timestamps: true });

export default model<IOrder | IOrderInput>('Order', OrderSchem);