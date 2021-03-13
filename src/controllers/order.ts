import { Document } from "mongoose";
import OrderDb from '../collections/order';
import CartDb from '../collections/cart';
import { NextFunction, Request, Response } from "express";
import { ICartDb } from '../types/cart';
import { convertDbCartToNormal } from '../common/cart';
import { IOrderDb, IOrderInput } from '../types/order';
import { convertCartToOrder, convertDbOrderToNormal } from '../common/order';
import ErrorHandler from '../models/errorHandler';

class OrderController {
    defaulMethod() {
        return {
            text:`You'ave reached the ${this.constructor.name} default method`
        };
    };
    public async placeOrder(req: Request, res: Response, next: NextFunction):Promise<void> {
        const { cartId } = req.body;
        try {
            const cartDb: Document = await CartDb.getCartById(cartId);
            if (!cartDb) {
                throw new ErrorHandler(203, "Cart does not exist")
            }
            const cart: ICartDb = convertDbCartToNormal(cartDb);
            const orderInput: IOrderInput = convertCartToOrder(cart);
            const orderDb: Document = await OrderDb.placeOrder(orderInput);
            const order: IOrderDb = convertDbOrderToNormal(orderDb);
            await CartDb.removeCart(cartId);
            res.status(200).json({orderId: order._id});
        } catch (error) {
           next(error)
        }
    }
    
}

export = new OrderController();