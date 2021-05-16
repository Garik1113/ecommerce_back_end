import { IAddress } from './address';
import { ICartItemInput, PaymentMethod, ShippingMethod } from './cart';
import { ICustomer } from './customer';
import { TCurrency } from './product';

export type TStatus = {
    name: string,
    value: string
}

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
    status: TStatus,
    currency: TCurrency
}

export interface IOrder extends IOrderInput {
    createdAt: string,
    _id: string
}