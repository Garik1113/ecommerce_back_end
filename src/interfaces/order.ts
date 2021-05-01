import { IAddress } from './address';
import { ICartItemInput } from './cart';
import { ICustomer } from './customer';

export interface IOrderInput {
    customer: ICustomer | null,
    items: ICartItemInput[],
    paymentMethod: string,
    shippingAddress: IAddress,
    billingAddress: IAddress,
    totalQty: number,
    totalPrice: number
    cartId: string,
    status: string
}

export interface IOrder extends IOrderInput {
    createdAt: string,
    _id: string
}