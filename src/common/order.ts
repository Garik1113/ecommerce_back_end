import CustomerDb from '../collections/customer';
import { IOrder, IOrderInput } from '../interfaces/order';
import { convertDbCustomerToNormal } from './customer';

export const convertCartToOrder = (cart: any):IOrderInput => {
    return {
        cartId: cart._id,
        shippingAddress: cart.shippingAddress,
        billingAddress: cart.billingAddress,
        shippingMethod: cart.shippingMethod,
        customer: cart.customerId ? convertDbCustomerToNormal(cart.customerId) : null,
        paymentMethod: cart.paymentMethod,
        subTotal: cart.subTotal,
        totalPrice: cart.totalPrice,
        totalQty: cart.totalQty,
        items: cart.items,
        status: {
            value: 'new',
            name: "New"
        },
        currency: cart.currency
    }
}

export const convertDbOrderToNormal = async(orderObj: any):Promise<IOrder> => {
    return {
        _id: orderObj._id,
        cartId: orderObj._id,
        shippingAddress: orderObj.shippingAddress,
        billingAddress: orderObj.billingAddress,
        customer: await CustomerDb.getCustomerById(orderObj.customer),
        paymentMethod: orderObj.paymentMethod,
        shippingMethod: orderObj.shippingMethod,
        subTotal: orderObj.subTotal,
        totalPrice: Number(orderObj.totalPrice),
        totalQty: orderObj.totalQty,
        items: orderObj.items,
        status: orderObj.status,
        createdAt: orderObj.createdAt,
        currency: orderObj.currency
    }
}