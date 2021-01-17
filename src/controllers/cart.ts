import { Document } from "mongoose";
import ErrorHandler from "../models/errorHandler";
import CartDb from '../collections/cart';
import { Result, ValidationError, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { TCart, TCartItem } from "../types/cart";
import { convertDbCartToNormal, getCartId } from "../common/cart";
import ProductDB from "../collections/product";
import { TProduct } from "../types/product";
import { convertDbProductToNormal } from "../common/product";
import { validateObjectId } from "../common/db";

class CartController {
    defaulMethod() {
        return {
            text:`You'ave reached the ${this.constructor.name} default method`
        };
    };

    public async createCart(req: Request, res: Response, next: NextFunction):Promise<void> {
        try {
            const cart: Document = await CartDb.creatCart();
            const cartId: String = getCartId(cart);
            res.status(200).json({ cartId });
        } catch (error) {
            next(error);
        }
    }
    public async addItemToCart(req: Request, res: Response, next: NextFunction):Promise<void> {
        const errors: Result<ValidationError> = validationResult(req);
        try {
            console.log(req.body)
            const { cartId, itemId, quantity } = req.body;
            if (!errors.isEmpty()) {
               
                throw new ErrorHandler(403, "Validation error", errors.array())
            }
            validateObjectId(itemId);
            const product: Document = await ProductDB.getProductById(itemId);
            if (!product){
                throw new ErrorHandler(403, "Product that you tried to add is not exists")
            } else {
                    const item: TProduct = convertDbProductToNormal(product);
                    const cartItem: TCartItem = {
                        quantity,
                        item
                    }
                    const cartObj: Document = await CartDb.getCart(cartId);
                    const cart: TCart = convertDbCartToNormal(cartObj);
                    const { items } = cart;
                    items?.map( async (cartItem: TCartItem) => {
                        if (cartItem.item._id == itemId) {
                            cartItem.quantity += 1;
                            await CartDb.addItemQuantityToCart(cartId, itemId)
                        }
                    });
                    // await CartDb.addItemToCart(cartId, cartItem);
                }
            // console.log(ObjectID(itemId))
            // const product: Document = await ProductDB.getProductById(itemId);
            
            // const cart: Document = CartDb.getCart(cartId);
            // await CartDb.getItemFromCart(cartId, itemId);
            // await CartDb.addItemToCart(cartId, cartItem);
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