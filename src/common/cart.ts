import { IAddress } from "../interfaces/address";
import { ICartInput, ICart, ICartItemInput, ICartItem } from "../interfaces/cart";
import ProductDB from '../collections/product'
import { prepareProductData } from './product';
import { asyncForEach } from '../helpers/asyncForEach';

export const getTotalQtyOfItems = (items: any[] = []) => {
    const qty:number = items.reduce((initialState: number, current: ICartItemInput) => {
            initialState += current.quantity
            return initialState;
    }, 0);
    return qty;
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

type PrepareCartParams = {
    joinProductData: boolean
}

export const prepareCartData = async (cartObj:any = {}, params: PrepareCartParams): Promise<ICart> => {
    const { items = [] } = cartObj;
    const cartItems: ICartItem[] = []
    const { joinProductData } = params;
    if (joinProductData) {
        if (items && items.length) {
            await asyncForEach(items, async(item: ICartItem) => {
                const { product: productId, quantity, _id } = item;
                const productDb = await ProductDB.getProductById(String(productId));
                if (productDb) {
                    const product = await prepareProductData(productDb, { withAttributeData: true });
                    cartItems.push({
                        _id, 
                        product,
                        quantity
                    })
                }
            }) 
        }
    } else {
        cartObj.items = cartObj.items.map((e: any) => {
            return {
                quantity: e.quantity,
                product: e.product,
                _id: e._id
            }
        })
    }
    return {
        _id: cartObj._id,
        items: joinProductData ? cartItems : items,
        paymentMethod: cartObj.paymentMethod,
        shippingMethod: cartObj.shippingMethod,
        shippingAddress: cartObj.shippingAddress,
        billingAddress: cartObj.billingAddress,
        customerId: cartObj.customerId,
        subTotal: cartObj.subTotal,
        totalPrice: cartObj.totalPrice,
        totalQty: cartObj.totalQty,
        stripePaymentMethodId: cartObj.stripePaymentMethodId,
        currency: cartObj.currency
    };
}

export const prepareCartDataForDb = (cart: ICart): ICart => {
    cart.items = cart.items.map((e:ICartItem) => {
        return {
            quantity: e.quantity,
            product: typeof e.product == "object" ? e.product._id : e.product
        }
    })
    return cart;
}