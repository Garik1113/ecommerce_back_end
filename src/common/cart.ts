import { IAddress } from "../interfaces/address";
import { ICartInput, ICart, ICartItemInput, TCartItemAttribute } from "../interfaces/cart";

export const getTotalQtyOfItems = (items: any[] = []) => {
    const qty:number = items.reduce((initialState: number, current: ICartItemInput) => {
            initialState += current.quantity
            return initialState;
    }, 0);
    return qty;
}

export const convertDbCartToNormal = (cartObj: any = {}): ICart => {
    const cart: ICart = {
        _id: cartObj._id,
        items: cartObj.items || [],
        paymentMethod: cartObj.paymentMethod,
        shippingMethod: cartObj.shippingMethod,
        shippingAddress: cartObj.shippingAddress,
        billingAddress: cartObj.billingAddress,
        customerId: cartObj.customerId,
        totalPrice: cartObj.totalPrice,
        subTotal: cartObj.subTotal,
        totalQty: cartObj.totalQty,
        stripePaymentMethodId: cartObj.stripePaymentMethodId,
        currency: cartObj.currency
    };

    return cart;
}

export const createEmptycart = (): ICartInput => {
    const cart: ICartInput = {
        items:[],
        paymentMethod: null,
        shippingMethod:null,
        shippingAddress: null,
        billingAddress: null,
        subTotal: 0,
        totalPrice: 0,
        totalQty: 0,
        customerId: null,
        currency: {
            name: "AMD",
            code: "amd",
            symbol: "$"
        }
    };

    return cart;
}

export const convertInputAddressToNormal = (address: any): IAddress => {
    return {
        firstName: address.firstName || "",
        lastName: address.lastName || "",
        email: address.email || "",
        country: address.country || "",
        state: address.state || "",
        city: address.city || "",
        street: address.street || "",
        address: address.address || "",
        additionalInformation: address.additionalInformation || "",
        phone: address.phone || "",
        zip: address.zip || "",
        company: address.company || "",
        isBillingAddress: address.isBillingAddress,
        isShippingAddress: address.isShippingAddress
    }
}