import { Document } from "mongoose";
import ErrorHandler from "../models/errorHandler";
import CartDb from '../collections/cart';
import { Result, ValidationError, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { ICartInput, ICartItemInput, ICartItem, ICart } from "../interfaces/cart";
import { prepareCartData, convertInputAddressToNormal, createEmptycart, prepareCartDataForDb } from "../common/cart";
import ProductDB from "../collections/product";
import { IProduct } from "../interfaces/product";
import { prepareProductData,  getTotalPriceOfProduct } from "../common/product";
import { IAddress } from "../interfaces/address";
import { replaceQuotes } from '../helpers/objectId';
const ObjectID = require('mongodb').ObjectID;

const gerProductPrice = (product: any) => {
    return product.discountedPrice ? Number(product.discountedPrice) : Number(product.price)
}

const collectTotals = async (cartId: string, cart: ICart | any): Promise<ICart> => {
    const { shippingMethod, items } = cart;
    let shippingPrice = 0;
    let subTotal = 0;
    let totalQty = 0;
    let totalPrice = 0;
    if (shippingMethod) {
        shippingPrice = Number(shippingMethod.price.toFixed(2))
    };
    for (let index = 0; index < items.length; index++) {
        const item:ICartItem = items[index];
        const { quantity, product: productId } = item;
        const productDB = await ProductDB.getProductById(String(productId));
        if (productDB) {
            const product = await prepareProductData(productDB, { withAttributeData: false });
            const price = Number(gerProductPrice(product).toFixed(2)) * Number(quantity);
            subTotal += price;
            totalQty += Number(quantity)
        }  
    }
    totalPrice = subTotal + shippingPrice;
    const newCart = {
        ...cart,
        subTotal,
        totalPrice,
        totalQty
    }
    const result = await CartDb.updateCart(cartId, prepareCartDataForDb(newCart));
    const updatedCart = await prepareCartData(result, { joinProductData: true });
    return updatedCart
}

class CartController {
    defaulMethod() {
        return {
            text:`You'ave reached the ${this.constructor.name} default method`
        };
    };

    public async createCart(req: Request, res: Response, next: NextFunction):Promise<void> {
        try {
            const cart: Document = await CartDb.creatCart(null);
            const cartId: String = cart._id;
            res.status(200).json({ cartId });
        } catch (error) {
            next(error);
        }
    }
    
    public async addItemToCart(req: Request, res: Response, next: NextFunction):Promise<void> {
        const errors: Result<ValidationError> = validationResult(req);
        try {
            const { cartId, productId, quantity, customerId } = req.body;
            if (!errors.isEmpty()) {
                throw new ErrorHandler(203, "Validation error", errors.array())
            }
            const productDb: Document = await ProductDB.getProductById(ObjectID(productId));
            const product: IProduct = await prepareProductData(productDb, { withAttributeData: true });
            if (!productDb) {
                throw new ErrorHandler(203, "Product that you tried to add is not exists")
            } else {
                let cartObj;
                if (customerId) {
                    cartObj = await CartDb.getCartByCustomer(replaceQuotes(customerId));
                } else {
                    cartObj = await CartDb.getCartById(cartId);
                }
                if (product.quantity < 1) {
                    throw new ErrorHandler(203, "Product that you tried to add is Out of stock")
                }
                
                if (!cartObj) {
                    const cartItem: ICartItemInput = {
                        quantity,
                        product: productId
                    };
                    const totalPrice: number = getTotalPriceOfProduct(product, quantity);
                    const cart: ICartInput =  {
                        ...createEmptycart(),
                        items: [cartItem],
                        subTotal: Number((quantity * gerProductPrice(product)).toFixed(2)),
                        totalQty: quantity,
                        totalPrice: Number(totalPrice.toFixed(2)),
                        customerId: customerId ? replaceQuotes(customerId) : null
                    }
                    const cartDb: Document = await CartDb.creatCart(cart);
                    const newCart:ICart = await prepareCartData(cartDb, { joinProductData: true });
                    res.status(200).json({ cart: newCart });
                } else {
                    const cart = await prepareCartData(cartObj, { joinProductData: false });
                    const { items } = cart;
                    let exist = false;
                    for (let index = 0; index < items.length; index++) {
                        const item = items[index];
                        if (item.product == productId) {
                            exist = true;
                            const incError = item.quantity + Number(quantity) > product.quantity
                            const decError = item.quantity + Number(quantity) < 0;
                            if (incError || decError) {
                                throw new ErrorHandler(203, "Change Quantity Error")
                            }
                            item.quantity += Number(quantity);
                            break;
                        }
                    }
                    if (!exist) {
                        cart.items.push({
                            product: productId,
                            quantity
                        })
                    }
                    const cartBeforeUpdate = await prepareCartData(cart, { joinProductData: false });
                    const fixedCart = await collectTotals(String(cart._id), cartBeforeUpdate);
                    res.status(200).json({ cart: fixedCart });
                }
            }
        } catch (error) {
            console.log(error)
            next(error);
        }
    }
    public async deleteCartItem(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { cartId, itemId } = req.body;
        try {
            const result:Document = await CartDb.getCartById(cartId);
            if (!result) {
                throw new ErrorHandler(203, "Cart not found");
            }
            const cart:ICart = await prepareCartData(result, { joinProductData: false });
            const findedItem = cart.items.find(e => e._id == itemId);
            if (findedItem) {
                cart.items = cart.items.filter(e => e._id != itemId);
                const cartBeforeUpdate = await prepareCartData(cart, { joinProductData: true });
                const fixedCart = await collectTotals(cartId, cartBeforeUpdate);
                res.status(200).json({ cart: fixedCart });
            } else {
                res.status(200).json({ cart });
            }
        } catch (error) {
            next(error)
        }
    }
    public async getCartById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { cartId } = req.params;
        try {
            const result:Document = await CartDb.getCartById(cartId);
            if (result) {
                const cart: ICart = await prepareCartData(result, { joinProductData: true });
                res.status(200).json({ cart });
            } else {
                res.status(200).json({ cart: null });
            }
        } catch (error) {
            console.log(error)
            throw new ErrorHandler(error.statusCode, error.message);
        }
    }
    public async changeCartItemQuantity(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { cartId, itemId, quantity } = req.body;
        try {
            const cartDb = await CartDb.getCartById(cartId);
            if (!cartDb) {
                throw new ErrorHandler(203, "Cart not found")
            }
            const cart: ICart = await prepareCartData(cartDb, { joinProductData: false });
            const { items } = cart;
            for (let index = 0; index < items.length; index++) {
                const item = items[index];
                if (item._id == itemId) {
                    
                    item.quantity += Number(quantity);
                    break;
                }
            }
            const fixedCart = await collectTotals(cartId, cart);
            res.status(200).json({ cart: fixedCart });
        } catch (error) {
            console.log("EROROORORORO", error)
            next(error);
        }
    }
    public async addShippingAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { cartId, address } = req.body;
        try {
            const shippingAddress: IAddress = convertInputAddressToNormal(address);
            const result = await CartDb.getCartById(cartId);
            if(!result) {
                throw new ErrorHandler(203, "Cart not found");
            }
            const newCart = await CartDb.updateCart(cartId, {...prepareCartDataForDb(result), shippingAddress});
            const cart:ICart = await prepareCartData(newCart, { joinProductData: true });
            res.status(200).json({ cart })
        } catch (error) {
            next(error);
        }
    }
    public async addBillingAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { cartId, address } = req.body;
        try {
            const billingAddress: IAddress = convertInputAddressToNormal(address);
            const result = await CartDb.getCartById(cartId);
            if(!result) {
                throw new ErrorHandler(203, "Cart not found");
            }
            const newCart = await CartDb.updateCart(cartId, {...prepareCartDataForDb(result), billingAddress});
            const cart:ICart = await prepareCartData(newCart, { joinProductData: true });
            res.status(200).json({ cart })
        } catch (error) {
            next(error);
        }
    }
    public async addPaymentMethod(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { cartId, method } = req.body;
        try {
            const result = await CartDb.getCartById(cartId);
            if(!result) {
                throw new ErrorHandler(203, "Cart not found");
            }
            const newCart = await CartDb.updateCart(cartId, {...prepareCartDataForDb(result), paymentMethod: method});
            const cart:ICart = await prepareCartData(newCart, { joinProductData: true });
            res.status(200).json({ cart });
        } catch (error) {
            next(error);
        }
    }
    public async addShippingMethod(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { cartId, method } = req.body;
        try {
            const result = await CartDb.getCartById(cartId);
            if (!result) {
                throw new ErrorHandler(203, "Cart not found");
            }
            result.shippingMethod = method;
            const cartBeforeUpdate = await prepareCartData(result, { joinProductData: false });
            const fixedCart = await collectTotals(cartId, cartBeforeUpdate);
            res.status(200).json({ cart: fixedCart });
        } catch (error) {
            next(error);
        }
    }
    public async addStripePaymentMethodId(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { stripePaymentMethodId, cartId } = req.body;
        try {
            const result = await CartDb.getCartById(cartId);
            if (!result) {
                throw new ErrorHandler(203, "Cart not found");
            }
            const cart:ICart = await prepareCartData(result, { joinProductData: true });
            await CartDb.updateCart(cartId, {...prepareCartDataForDb(cart), stripePaymentMethodId});
            res.status(200).json({ cart: { ...cart, stripePaymentMethodId } });
        } catch (error) {
            next(error);
        }
    }
    public async removeCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { cartId } = req.body;
        try {
           await CartDb.removeCart(cartId);
           res.status(200).json({ status: "DELETED" })
        } catch (error) {
            next(error)
        }
    }
}

export = new CartController();