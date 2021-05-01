import { IOrder, IOrderInput } from '../interfaces/order';
import { convertDbCustomerToNormal } from './customer';

export const convertCartToOrder = (cart: any):IOrderInput => {
    return {
        cartId: cart._id,
        shippingAddress: cart.shippingAddress,
        billingAddress: cart.billingAddress,
        customer: cart.customerId ? convertDbCustomerToNormal(cart.customerId) : null,
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
        customer: orderObj.customer,
        paymentMethod: orderObj.paymentMethod,
        totalPrice: orderObj.totalPrice,
        totalQty: orderObj.totalQty,
        items: orderObj.items,
        status: orderObj.status,
        createdAt: orderObj.createdAt
    }
}