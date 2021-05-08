import { IAddress } from './address';
import { ICartItemInput, PaymentMethod, ShippingMethod } from './cart';
import { ICustomer } from './customer';
import { TCurrency } from './product';

export interface IOrderInput {
    customer: ICustomer | null,
    items: ICartItemInput[],
    paymentMethod: PaymentMethod,
    shippingMethod: ShippingMethod,
    shippingAddress: IAddress,
    billingAddress: IAddress,
    totalQty: number,
    subTotal: number,
    totalPrice: number
    cartId: string,
    status: string,
    currency: TCurrency
}

export interface IOrder extends IOrderInput {
    createdAt: string,
    _id: string
}