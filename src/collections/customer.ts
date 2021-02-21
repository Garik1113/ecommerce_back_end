import { Model, Document, Types } from "mongoose";
import ErrorHandler from "../models/errorHandler";
import Customer from "../models/customer";
import { TCustomer } from "../types/customer";

class CustomerDb {
    protected _db: Model<any> = Customer;

    async createCustomer (customer: TCustomer): Promise<Document> {
        const userDb: Document = await this._db.create(customer);
        return userDb;
    }
    async findByEmail (email: String): Promise<Document> {
        const customer: Document = await this._db.findOne({email: email});
        return customer;
    }
    async update (customerId: string, body: any): Promise<void> {
        try {
            const updateQuery:any = {};
            for (const key in body) {
                if (Object.prototype.hasOwnProperty.call(body, key)) {
                    const element = body[key];
                    updateQuery[key] = element;
                }
            };
            await this._db.findByIdAndUpdate({"_id": customerId}, updateQuery);
        } catch (error) {
            throw new ErrorHandler(401, error.message)
        }
    }
}

export default new CustomerDb();