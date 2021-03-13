import { ICart } from './cart';

export interface IOrderInput extends ICart {
    cartId: string
}

export interface IOrderDb extends IOrderInput {
    _id: string
}