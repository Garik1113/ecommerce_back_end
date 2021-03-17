import { Document } from "mongoose";
import OrderDb from '../collections/order';
import CartDb from '../collections/cart';
import { NextFunction, Request, Response } from "express";
import { ICart } from '../interfaces/cart';
import { convertDbCartToNormal, createEmptycart } from '../common/cart';
import { IOrder, IOrderInput } from '../interfaces/order';
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
            const cart: ICart = convertDbCartToNormal(cartDb);
            const orderInput: IOrderInput = convertCartToOrder(cart);
            const orderDb: Document = await OrderDb.placeOrder(orderInput);
            const order: IOrder = convertDbOrderToNormal(orderDb);
            await CartDb.updateCart(cartId, createEmptycart());
            res.status(200).json({ orderId: order._id });
        } catch (error) {
           next(error)
        }
    }
    public async getOrdersByCustomer(req: Request, res: Response, next: NextFunction):Promise<void> {
        const { customerId } = req.body;
        try {
            const result:Document[] = await OrderDb.getOrdersByCustomer(customerId);

            res.status(200).json({orders: result.map(order => convertDbOrderToNormal(order))});
        } catch (error) {
            console.log(error)
        }
    }
    
}

export = new OrderController();