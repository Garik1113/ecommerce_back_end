import { IAddress } from "./address";
import { IProduct } from "./product";

export type TCartItemAttribute = {
    attributeId: string,
    valueId: string
}

export interface ICartItemInput {
    quantity: number,
    product: IProduct
}

export interface ICartItem extends ICartItemInput {
    _id: string
}

export interface ICartInput {
    customerId: string | null,
    items: ICartItemInput[],
    paymentMethod: string,
    shippingAddress: IAddress,
    billingAddress: IAddress,
    totalQty: number,
    totalPrice: number
}

export interface ICart extends ICartInput {
    _id: string,
    stripePaymentMethodId: string,
    items: ICartItem[]
}