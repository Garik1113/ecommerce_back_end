import { IAddress } from "../interfaces/address";
import { ICartInput, ICart, ICartItemInput, TCartItemAttribute } from "../interfaces/cart";

export const getTotalPriceOfItems = (items: any[] = []): number => {
    const value:number = items.reduce((initialState: number, current: ICartItemInput) => {
        const price = current.product.discountedPrice || current.product.price;
        initialState += (price * current.quantity);
        return initialState;
    }, 0);

    return value;
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
        totalQty: getTotalQtyOfItems(cartObj.items),
        stripePaymentMethodId: cartObj.stripePaymentMethodId
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
            company: "",
            isBillingAddress: false,
            isShippingAddress: false
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
            company: "",
            isBillingAddress: false,
            isShippingAddress: false
        },
        totalPrice: 0,
        totalQty: 0,
        customerId: null
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
        firstAddress: address.firstAddress || "",
        secondAddress: address.secondAddress || "",
        phone: address.phone || "",
        zip: address.zip || "",
        company: address.company || "",
        isBillingAddress: address.isBillingAddress,
        isShippingAddress: address.isShippingAddress
    }
}