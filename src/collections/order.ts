import { Model, Document } from "mongoose";
import Order from "../models/order";
import { IOrderInput } from '../interfaces/order';
import { ObjectID } from 'mongodb'

class OrderDb {
    protected _db: Model<any> = Order;
    get db () {
        return this._db;
    };

    async placeOrder(order: IOrderInput):Promise<Document> {
        const document: Document = await new this.db(order);
        await document.validate();
        await document.save();
        const newOrder: Document = await this.db.findById(document._id);

        return newOrder
    }
    async getOrdersByCustomer(customerId: string):Promise<Document[]> {
        const document: Document[] = await this._db.aggregate([
            {
                $match: { "customer._id": new ObjectID(customerId)},
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);
        return document;
    }
    async getOrders():Promise<Document[]> {
        const document: Document[] = await this._db.aggregate([
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])
        return document;
    }
    async getOrder(orderId: string):Promise<Document> {
        const document: Document = await this._db.findById(orderId)
        return document;
    }
    async deleteOrder(orderId: string):Promise<void> {
        await this.db.findByIdAndDelete(orderId)
    }
}

export default new OrderDb();