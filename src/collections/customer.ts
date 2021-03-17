import { Model, Document, Types, ToObjectOptions } from "mongoose";
import ErrorHandler from "../models/errorHandler";
import Customer from "../models/customer";
import { ICustomer, ICustomerInput } from "../interfaces/customer";
import { ObjectID, ObjectId, } from 'mongodb'

class CustomerDb {
    protected _db: Model<any> = Customer;

    async createCustomer (customer: ICustomerInput): Promise<Document> {
        const userDb: Document = await this._db.create(customer);
        return userDb;
    }
    async findByEmail (email: String): Promise<Document> {
        const customer: Document = await this._db.findOne({email: email});
        return customer;
    }
    async getCustomerById (customerId: string): Promise<any> {
        const customer: Document = await this._db.findById(customerId);
        return customer;  
    }
    async update (customerId: string, body: any): Promise<any> {
        try {
            const updateQuery:any = {};
            for (const key in body) {
                if (Object.prototype.hasOwnProperty.call(body, key)) {
                    const element = body[key];
                    updateQuery[key] = element;
                }
            };
            const result: Document = await this._db.findByIdAndUpdate({"_id": customerId}, updateQuery);
            return result;
        } catch (error) {
            throw new ErrorHandler(401, error.message)
        }
    }
}

export default new CustomerDb();