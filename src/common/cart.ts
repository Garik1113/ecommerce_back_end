import { add } from "lodash";
import { TAddress } from "../types/address";
import { ICartDb, ICartItem, TCartItemAttribute } from "../types/cart";
import { TPrice } from "../types/product";

export const getTotalPriceOfItems = (items: any[] = []): TPrice => {
    const value:number = items.reduce((initialState: number, current: ICartItem) => {
            initialState += (current.product.price.value * current.quantity)
            return initialState;
    }, 0);
    return {
        value,
        currency: "USD"
    };
}

export const getTotalQtyOfItems = (items: any[] = []) => {
    const qty:number = items.reduce((initialState: number, current: ICartItem) => {
            initialState += current.quantity
            return initialState;
    }, 0);
    return qty;
}

export const convertDbCartToNormal = (cartObj: any = {}): ICartDb => {
    const cart: ICartDb = {
        _id: cartObj._id,
        items: cartObj.items || [],
        paymentMethod: cartObj.paymentMethod,
        shippingAddress: cartObj.shippingAddress,
        billingAddress: cartObj.billingAddress,
        userId: cartObj.userId,
        totalPrice: getTotalPriceOfItems(cartObj.items),
        totalQty: getTotalQtyOfItems(cartObj.items)
    };

    return cart;
}

export const convertCartAttributesToNormal = (attributes: any[] = []): TCartItemAttribute[] => {
    return attributes.map(e => {
        return {
            attributeId: String(e.attributeId),
            valueId: String(e.valueId)
        }
    })
}

export const convertInputAddressToNormal = (address: any): TAddress => {
    return {
        firstName: address.firstName || "",
        lastName: address.lastName || "",
        firstAddress: address.firstAddress || "",
        secondAddress: address.secondAddress || "",
        country: address.country || "",
        state: address.state || "",
        city: address.city || "",
        phone: address.phone || "",
        zip: address.zip || 0
    }
}