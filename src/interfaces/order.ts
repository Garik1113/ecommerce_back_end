import { ICartInput } from './cart';

export interface IOrderInput extends ICartInput {
    cartId: string,
    customerId: string | null,
    status: string
}

export interface IOrder extends IOrderInput {
    _id: string
}