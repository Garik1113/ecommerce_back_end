import { IAddress } from "./address";
import { IProduct, TCurrency } from "./product";

export type PaymentMethod = {
    methodName: String,
    methodCode: String,
    enabled: boolean
}

export type ShippingMethod = {
    methodName: String,
    methodCode: String,
    price: number,
    enabled: boolean
}

export type TCartItemAttribute = {
    attributeId: string,
    valueId: string
}

export interface ICartItemInput {
    quantity: number,
    product: string | IProduct,
}

export interface ICartItem extends ICartItemInput {
    _id?: string
}

export interface ICartInput {
    customerId: string | null,
    items: ICartItemInput[],
    paymentMethod: PaymentMethod | null,
    shippingMethod: ShippingMethod | null,
    shippingAddress: IAddress | null,
    billingAddress: IAddress | null,
    subTotal: number,
    totalQty: number,
    totalPrice: number,
    currency: TCurrency
}

export interface ICart extends ICartInput {
    _id?: string,
    stripePaymentMethodId: string,
    items: ICartItem[]
}