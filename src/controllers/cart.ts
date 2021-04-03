import { Document } from "mongoose";
import ErrorHandler from "../models/errorHandler";
import CartDb from '../collections/cart';
import { Result, ValidationError, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { ICartInput, ICartItemInput, ICartItem, ICart, TCartItemAttribute } from "../interfaces/cart";
import { convertCartAttributesToNormal, convertDbCartToNormal, convertInputAddressToNormal, createEmptycart } from "../common/cart";
import ProductDB from "../collections/product";
import { IProduct } from "../interfaces/product";
import { convertDbProductToNormal,  getTotalPriceOfProduct } from "../common/product";
import { isArraysEqual } from "../helpers/isArraysEqual";
import { IAddress } from "../interfaces/address";
import { replaceQuotes } from '../helpers/objectId';

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
            const { cartId, productId, quantity, cartItemAttributes, customerId } = req.body;
            if (!errors.isEmpty()) {
                throw new ErrorHandler(403, "Validation error", errors.array())
            }
            const productDb: Document = await ProductDB.getProductById(productId);
            if (!productDb) {
                throw new ErrorHandler(403, "Product that you tried to add is not exists")
            } else {
                const cartObj: any = await CartDb.getCartById(cartId);
                const product: IProduct = convertDbProductToNormal(productDb);
                if(product.quantity < 1) {
                    throw new ErrorHandler(203, "Product that you tried to add is not Out of stock")
                }
                const cartItem: ICartItemInput = {
                    quantity,
                    product: productId,
                    cartItemAttributes
                };
                if (!cartObj) {
                    const totalQty = quantity;
                    const totalPrice: number = getTotalPriceOfProduct(product, quantity);
                    const cart: ICartInput =  {
                        ...createEmptycart(),
                        items: [cartItem],
                        totalQty,
                        totalPrice,
                        customerId: customerId ? replaceQuotes(customerId) : null
                    }
                    const cartDb: Document = await CartDb.creatCart(cart);
                    res.status(200).json({ cartId: cartDb._id });
                } else {
                    const cart = convertDbCartToNormal(cartObj);
                    const cartItems:ICartItem[] = cart.items;
                    const convertedCartItemAttributes: TCartItemAttribute[] = convertCartAttributesToNormal(cartItemAttributes);
                    //TO DO => add item to cart functionality for configurable items
                    if (false) {
                        let matched = false;
                        const newCartItems:ICartItemInput[] = cartItems.map((cartItem: ICartItemInput) => {
                            if (cartItem.product._id == productId) {
                                if (isArraysEqual(convertCartAttributesToNormal(cartItem.cartItemAttributes), convertedCartItemAttributes)) {
                                    cartItem.quantity += quantity;
                                    matched = true;
                                }
                            }
                            return cartItem;
                        });
                        if (!matched) {
                            // cart item has been finded but his attributes not matching with new item atrributes
                            // so we add a new item in cart as a another product
                            newCartItems.push(cartItem);
                        }
                        // await CartDb.updateCartItems(cartId, newCartItems);
                    } else {
                        // console.log("CARTT",cart)
                        let totalQty = 0;
                        let exist = false;
                        const newCartItems:ICartItem[] = cartItems.map((cartItem: ICartItem) => {
                            totalQty += cartItem.quantity;
                            if (cartItem.product._id == productId) {
                                exist = true;
                                const incrementError: boolean = cartItem.product.quantity <= cartItem.quantity + quantity;
                                const decrementError: boolean = cartItem.quantity + quantity <= 0;
                                if (incrementError || decrementError) {
                                    throw new ErrorHandler(203, "Change quantity error");
                                } else {
                                    cartItem.quantity += quantity;
                                }
                            }
                            return cartItem;
                        });
                        const totalPrice:number = product.price * quantity
                        const newCart: ICartInput = {
                            ...cart,
                            items: exist ? newCartItems : [...newCartItems, cartItem],
                            totalQty: cart.totalQty + quantity,
                            totalPrice
                        }
                        await CartDb.updateCart(cartId, newCart)
                        res.status(200).json({ cartId });
                    }
                    
                }
            }
        } catch (error) {
            next(error);
        }
    }
    public async deleteCartItem(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {cartId, itemId} = req.body;
        try {
            await CartDb.deleteCartItem(cartId, itemId);
            res.status(200).json({ cartId });
        } catch (error) {
            next(error)
        }
    }
    public async getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { cartId } = req.params;
        try {
            const result:Document = await CartDb.getCartById(cartId);
            if (result) {
                const cart: ICart = convertDbCartToNormal(result);
                res.status(200).json({ cart });
            } else {
                res.status(200).json({ cart: {} });
            }
        } catch (error) {
            console.log(error)
            throw new ErrorHandler(error.statusCode, error.message);
        }
    }
    public async changeCartItemQuantity(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { cartId, itemId, quantity } = req.body;
        try {
            await CartDb.addItemQuantityToCart(cartId, itemId, Number(quantity));
            res.status(200).json({ cartId });
        } catch (error) {
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
            const cart:ICart = convertDbCartToNormal(result);
            await CartDb.updateCart(cartId, {...cart, shippingAddress})
            res.status(200).json({ cartId });
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
            const cart:ICart = convertDbCartToNormal(result);
            await CartDb.updateCart(cartId, {...cart, billingAddress})
            res.status(200).json({ cartId });
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
            const cart:ICart = convertDbCartToNormal(result);
            await CartDb.updateCart(cartId, {...cart, paymentMethod: method})
            res.status(200).json({ cartId });
        } catch (error) {
            next(error);
        }
    }
    public async removeCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { cartId } = req.body;
        try {
           await CartDb.removeCart(cartId);
           res.status(200).json({ status: "OK" })
        } catch (error) {
            next(error)
        }
    }
}

export = new CartController();