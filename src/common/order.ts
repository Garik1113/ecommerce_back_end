import { ICart } from '../interfaces/cart';
import { IOrder, IOrderInput } from '../interfaces/order';

export const convertCartToOrder = (cart: ICart):IOrderInput => {
    return {
        cartId: cart._id,
        shippingAddress: cart.shippingAddress,
        billingAddress: cart.billingAddress,
        customerId: cart.customerId,
        paymentMethod: cart.paymentMethod,
        totalPrice: cart.totalPrice,
        totalQty: cart.totalQty,
        items: cart.items,
        status: "pending"
    }
}

export const convertDbOrderToNormal = (orderObj: any):IOrder => {
    return {
        _id: orderObj._id,
        cartId: orderObj._id,
        shippingAddress: orderObj.shippingAddress,
        billingAddress: orderObj.billingAddress,
        customerId: orderObj.customerId,
        paymentMethod: orderObj.paymentMethod,
        totalPrice: orderObj.totalPrice,
        totalQty: orderObj.totalQty,
        items: orderObj.items,
        status: orderObj.status
    }
}