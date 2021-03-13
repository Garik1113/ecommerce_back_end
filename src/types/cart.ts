import { TAddress } from "./address";
import { TPrice, IProduct, IProductDb } from "./product";

export type TCartItemAttribute = {
    id?: string,
    attributeId: string,
    valueId: string
}

export interface ICartItem {
    quantity: number,
    product: IProductDb,
    cartItemAttributes: TCartItemAttribute[]
}

export interface ICartItemDb extends ICartItem {
    _id: string
}

export interface ICart {
    userId?: string,
    items: ICartItem[],
    paymentMethod?: string,
    shippingAddress?: TAddress,
    billingAddress?: TAddress,
    totalQty: number,
    totalPrice: TPrice
}

export interface ICartDb extends ICart {
    _id: string
    items: ICartItemDb[]
}