import { Model, Document } from "mongoose";
import Order from "../models/order";
import { IOrderInput } from '../interfaces/order';


class OrderDb {
    protected _db: Model<any> = Order;
    get db () {
        return this._db;
    };

    async placeOrder(order: IOrderInput):Promise<Document> {
        const document: Document = await this.db.create(order);
        return document;
    }
    async getOrdersByCustomer(customerId: string):Promise<Document[]> {
        const document: Document[] = await this._db.find({customerId})
        return document;
    }
}

export default new OrderDb();