import { Document } from "mongoose";
import OrderDb from '../collections/order';
import CartDb from '../collections/cart';
import { NextFunction, Request, Response } from "express";
import { ICart } from '../interfaces/cart';
import { convertDbCartToNormal, createEmptycart } from '../common/cart';
import { IOrder, IOrderInput } from '../interfaces/order';
import { convertCartToOrder, convertDbOrderToNormal } from '../common/order';
import ErrorHandler from '../models/errorHandler';
import Stripe from "stripe";
const stripe: Stripe = require('stripe')("sk_test_51HPTvgB9AM6FXiSYbUwoiPaWX2zDSwVc7dYCEv70AHU7y5hrowWbkO5pdUyFfmlf00PM1CxOw9azGLDXSD6z1qIu00IEozmq5c");

class OrderController {
    defaulMethod() {
        return {
            text:`You'ave reached the ${this.constructor.name} default method`
        };
    };
    public async placeOrder(req: Request, res: Response, next: NextFunction):Promise<void> {
        const { cartId } = req.body;
        try {
            const cartDb: Document = await CartDb.getCartForOrder(cartId);
            if (!cartDb) {
                throw new ErrorHandler(203, "Cart does not exist")
            }
            const cart: ICart = convertDbCartToNormal(cartDb);
            const { stripePaymentMethodId, totalPrice } = cart;
            if (stripePaymentMethodId) {
                await stripe.paymentIntents.create({
                    amount: totalPrice,
                    currency: "USD",
                    description: "Ecommerce payment",
                    payment_method: stripePaymentMethodId
                });
            };
            const orderInput: IOrderInput = convertCartToOrder(cart);
            const orderDb = await OrderDb.placeOrder(orderInput);
            const order: IOrder = convertDbOrderToNormal(orderDb);
            await CartDb.updateCart(cartId, {...createEmptycart(), customerId: cart.customerId, stripePaymentMethodId: ""});
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
    public async getOrders(req: Request, res: Response, next: NextFunction):Promise<void> {
        try {
            const result:Document[] = await OrderDb.getOrders();
            res.status(200).json({orders: result.map(convertDbOrderToNormal)});
        } catch (error) {
            console.log(error)
        }
    }
    public async deleteOrder(req: Request, res: Response, next: NextFunction):Promise<void> {
        const { orderId } = req.params
        try {
            await OrderDb.deleteOrder(orderId);
            res.status(200).json({status: "DELETED"})
        } catch (error) {
            console.log(error)
        }
    }
    public async getOrder(req: Request, res: Response, next: NextFunction):Promise<void> {
        const { orderId } = req.params
        try {
            const document: Document = await OrderDb.getOrder(orderId);
            const order = convertDbOrderToNormal(document)
            res.status(200).json({ order })
        } catch (error) {
            console.log(error)
        }
    }
}

export = new OrderController();