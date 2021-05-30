import { Document } from "mongoose";
import OrderDb from '../collections/order';
import CartDb from '../collections/cart';
import { NextFunction, Request, Response } from "express";
import { ICart } from '../interfaces/cart';
import { prepareCartData, createEmptycart } from '../common/cart';
import { IOrder, IOrderInput } from '../interfaces/order';
import { convertCartToOrder, convertDbOrderToNormal } from '../common/order';
import ErrorHandler from '../models/errorHandler';
const config = require('config');
import Stripe from "stripe";
import { asyncForEach } from '../helpers/asyncForEach';
const stripe: Stripe = require('stripe')(config.get("stripe"). key);

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
            const cart: ICart = await prepareCartData(cartDb, { joinProductData: true });
            const { stripePaymentMethodId, totalPrice } = cart;
            
            const usdValue = config.get('stripe').usd || 0;
            const total = (Number(totalPrice) / (Number(usdValue))) * 100;
            if (stripePaymentMethodId && cart.paymentMethod?.methodCode == "cart") {
                await stripe.paymentIntents.create({
                    amount: Math.ceil(total),
                    currency: "USD",
                    description: "Ecommerce payment",
                    payment_method: stripePaymentMethodId
                });
            };
            const orderInput: IOrderInput = convertCartToOrder(cart);
            const orderDb = await OrderDb.placeOrder(orderInput);
            const order: IOrder = await convertDbOrderToNormal(orderDb);
            await CartDb.updateCart(cartId, {...createEmptycart(), customerId: cart.customerId, stripePaymentMethodId: ""});
            res.status(200).json({ orderId: order._id });
        } catch (error) {
            console.log(error)
           next(error)
        }
    }
    public async getOrdersByCustomer(req: Request, res: Response, next: NextFunction):Promise<void> {
        const { customerId } = req.body;
        try {
            const results:Document[] = await OrderDb.getOrdersByCustomer(customerId);
            const orders:IOrder[] = []
            await asyncForEach(results, async(item:any) => {
                const order:IOrder = await convertDbOrderToNormal(item);
                orders.push(order)
            })
            res.status(200).json({ orders });
        } catch (error) {
            console.log(error)
        }
    }
    public async getOrders(req: Request, res: Response, next: NextFunction):Promise<void> {
        try {
            const results:Document[] = await OrderDb.getOrders();
            const orders:IOrder[] = []
            await asyncForEach(results, async(item:any) => {
                const order:IOrder = await convertDbOrderToNormal(item);
                orders.push(order)
            })
            res.status(200).json({ orders });
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
            const order = await convertDbOrderToNormal(document)
            res.status(200).json({ order })
        } catch (error) {
            console.log(error)
        }
    }
    public async updateOrderStatus(req: Request, res: Response, next: NextFunction):Promise<void> {
        const { status, orderId } = req.body;
        try {
            const document: Document = await OrderDb.updateOrder(orderId, { status });
            const order = await convertDbOrderToNormal(document);
            res.status(200).json({ order })
        } catch (error) {
            next(error)
        }
    }
}

export = new OrderController();