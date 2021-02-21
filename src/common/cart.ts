import { Document } from "mongoose";
import { TCart } from "../types/cart";

export const convertDbCartToNormal = (cartObj: any): TCart => {
    const cart: TCart = {
        _id: cartObj._id,
        items: cartObj.items,
        paymentMethod: cartObj.paymentMethod,
        shippingAddress: cartObj.shippingAddress,
        userId: cartObj.userId
    };

    return cart;
}