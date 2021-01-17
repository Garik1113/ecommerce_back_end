import { TAddress } from "./address";
import { TProduct } from "./product";

export type TCartItem = {
    quantity: number,
    item: TProduct
}

export type TCart = {
    _id?: string,
    items?: TCartItem[],
    paymentMethod: string,
    shippingAddress: TAddress[],
    userId?: string
}