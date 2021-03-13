import { ICartDb } from '../types/cart';
import { IOrderDb, IOrderInput } from '../types/order';

export const convertCartToOrder = (cart: ICartDb):IOrderInput => {
    return {
        cartId: cart._id,
        shippingAddress: cart.shippingAddress,
        billingAddress: cart.billingAddress,
        userId: cart.userId,
        paymentMethod: cart.paymentMethod,
        totalPrice: cart.totalPrice,
        totalQty: cart.totalQty,
        items: cart.items
    }
}

export const convertDbOrderToNormal = (orderObj: any):IOrderDb => {
    return {
        _id: orderObj._id,
        cartId: orderObj._id,
        shippingAddress: orderObj.shippingAddress,
        billingAddress: orderObj.billingAddress,
        userId: orderObj.userId,
        paymentMethod: orderObj.paymentMethod,
        totalPrice: orderObj.totalPrice,
        totalQty: orderObj.totalQty,
        items: orderObj.items
    }
}