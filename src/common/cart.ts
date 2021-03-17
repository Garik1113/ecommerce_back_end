import { IAddress } from "../interfaces/address";
import { ICartInput, ICart, ICartItemInput, TCartItemAttribute } from "../interfaces/cart";
import { TPrice } from "../interfaces/product";

export const getTotalPriceOfItems = (items: any[] = []): TPrice => {
    const value:number = items.reduce((initialState: number, current: ICartItemInput) => {
            initialState += (current.product.price.value * current.quantity)
            return initialState;
    }, 0);
    return {
        value,
        currency: "USD"
    };
}

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
        shippingAddress: cartObj.shippingAddress,
        billingAddress: cartObj.billingAddress,
        customerId: cartObj.customerId,
        totalPrice: getTotalPriceOfItems(cartObj.items),
        totalQty: getTotalQtyOfItems(cartObj.items)
    };

    return cart;
}

export const createEmptycart = (): ICartInput => {
    const cart: ICartInput = {
        items:[],
        paymentMethod: "",
        shippingAddress: {
            firstName: "",
            lastName: "",
            email: "",
            country: "",
            city: "",
            state: "",
            street: "",
            firstAddress: "",
            secondAddress: "",
            phone: "",
            zip: "",
            company: ""
        },
        billingAddress:  {
            firstName: "",
            lastName: "",
            email: "",
            country: "",
            city: "",
            state: "",
            street: "",
            firstAddress: "",
            secondAddress: "",
            phone: "",
            zip: "",
            company: ""
        },
        totalPrice: {value: 0, currency: "USD"},
        totalQty: 0,
        customerId: null
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

export const convertInputAddressToNormal = (address: any): IAddress => {
    return {
        firstName: address.firstName || "",
        lastName: address.lastName || "",
        email: address.email || "",
        country: address.country || "",
        state: address.state || "",
        city: address.city || "",
        street: address.street || "",
        firstAddress: address.firstAddress || "",
        secondAddress: address.secondAddress || "",
        phone: address.phone || "",
        zip: address.zip || "",
        company: address.company || ""
    }
}