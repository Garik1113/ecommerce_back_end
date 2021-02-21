import { Document } from "mongoose";
import ErrorHandler from "../models/errorHandler";
import CartDb from '../collections/cart';
import { Result, ValidationError, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { TCart, TCartItem } from "../types/cart";
import { convertDbCartToNormal } from "../common/cart";
import ProductDB from "../collections/product";
import { Attribute, TProduct } from "../types/product";
import { convertDbProductToNormal, getMatchingVariantsOfAttribute } from "../common/product";
import { validateObjectId } from "../common/db";
import { isArraysEqual } from "../helpers/isArraysEqual";

class CartController {
    defaulMethod() {
        return {
            text:`You'ave reached the ${this.constructor.name} default method`
        };
    };

    public async createCart(req: Request, res: Response, next: NextFunction):Promise<void> {
        try {
            const cart: Document = await CartDb.creatCart({});
            const cartId: String = cart._id;
            res.status(200).json({ cartId });
        } catch (error) {
            next(error);
        }
    }
    public async addItemToCart(req: Request, res: Response, next: NextFunction):Promise<void> {
        const errors: Result<ValidationError> = validationResult(req);
        try {
            const { cartId, itemId, quantity, attributes } = req.body;
            if (!errors.isEmpty()) {
                throw new ErrorHandler(403, "Validation error", errors.array())
            }
            validateObjectId(itemId);
            const product: Document = await ProductDB.getProductById(itemId);
            if (!product) {
                throw new ErrorHandler(403, "Product that you tried to add is not exists")
            } else {
                const item: TProduct = convertDbProductToNormal(product);
                const attributesWithSelectedVariants: Attribute[] = getMatchingVariantsOfAttribute(attributes, item);
                const cartItem: TCartItem = {

                    quantity,
                    item: { ...item, attributes: attributesWithSelectedVariants }
                }
                const cartObj: any = await CartDb.getCart(cartId);
                if (!cartObj) {
                    const cart: TCart = {
                        items: [cartItem],
                    }
                    const cartDb: Document = await CartDb.creatCart(cart);
                    res.status(200).json({ cartId: cartDb._id });
                } else {
                    const existingItem = convertDbCartToNormal(cartObj).items?.filter((cartItem: any) => cartItem.item._id == itemId).pop();
                    if (existingItem) {
                        const existing = cartObj.items?.filter((cartItem: any) => cartItem.item._id == itemId).pop();
                        const isEqaulAttributes:boolean = isArraysEqual(existingItem.item.attributes, attributesWithSelectedVariants);
                        if (isEqaulAttributes) {
                            await CartDb.addItemQuantityToCart(cartId, existing._id);
                        } else {
                            await CartDb.addItemToCart(cartId, cartItem);
                        }
                        res.status(200).json({ cartId });
                    } else {
                        await CartDb.addItemToCart(cartId, cartItem);
                        res.status(200).json({ cartId });
                    }
                }
            }
        } catch (error) {
            next(error);
        }
    }
    
    // public async deleteOne(_id: string):Promise<void> {
    //     try {
    //         await deleteOne(this._DbCollection, _id);
    //     } catch (error) {
    //         console.log(error)
    //         throw new ErrorHandler(error.statusCode, error.message);
    //     }
    // }
    // public async updateOne(_id: string,  body: any):Promise<void> {
    //     try {
    //         await updateOne(this._DbCollection, _id, body);
    //     } catch (error) {
    //         console.log(error);
    //         throw new ErrorHandler(error.statusCode, error.message); 
    //     }
    // }
    // public async getOne(queryObj:any):Promise<Document> {
    //     try {
    //         const user:Document = await getItemById(this._DbCollection, queryObj);
    //         return user;
    //     } catch (error) {
    //         console.log(error)
    //         throw new ErrorHandler(error.statusCode, error.message);
    //     }
    // }

}

export = new CartController();