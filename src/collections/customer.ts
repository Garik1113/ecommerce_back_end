import { Model, Document, Types, ToObjectOptions } from "mongoose";
import ErrorHandler from "../models/errorHandler";
import Customer from "../models/customer";
import { ICustomer, ICustomerInput } from "../interfaces/customer";
import { ObjectID, ObjectId, } from 'mongodb'
import { IAddress } from "../interfaces/address";

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
    async getCustomers(): Promise<Document[]> {
        const customers: Document[] = await this._db.find({});
        return customers;
    }
    async deleteCustomerById(customerId:string): Promise<void> {
        await this._db.findByIdAndDelete(customerId);
    }
    async getCustomerById (customerId: string): Promise<any> {
        const customer: Document = await this._db.findById(customerId);
        return customer;  
    }
    async update (customerId: string, body: any): Promise<any> {
        try {
            const result: Document = await this._db.findByIdAndUpdate(customerId, {...body}, {new: true});
            return result;
        } catch (error) {
            throw new ErrorHandler(401, error.message)
        }
    }
    async addCustomerAddress (customerId: string, address: any): Promise<any> {
        try {
            const result: Document = await this._db.findByIdAndUpdate({"_id": customerId}, {$push: {
                addresses: address
            }});
            return result;
        } catch (error) {
            throw new ErrorHandler(401, error.message)
        }
    }
    async editCustomerAddress (customerId: string, address: any, addressId: string): Promise<any> {
        try {
            const customer = await this._db.findById(customerId);
            let { addresses } = customer;
            console.log(addresses, addressId)
            addresses = addresses.map((a:any) => {
                if (a._id == addressId) {
                    return address;
                } else {
                    return a;
                }
            });
            const result: Document = await this._db.findByIdAndUpdate({"_id": customerId}, {
                addresses
            });
            return result;
        } catch (error) {
            throw new ErrorHandler(401, error.message)
        }
    }
    async deleteCustomerAddress (customerId: string, addressId: string): Promise<any> {
        try {
            const customer = await this._db.findById(customerId);
            const { addresses } = customer;
            const filteredAddresses = addresses.filter((a:any) =>{ 
                console.log(a._id, addressId)
                if(a._id != addressId){
                    return true
                } 
                return false
                
            });
            const result: Document = await this._db.findByIdAndUpdate({"_id": customerId}, {
                addresses: filteredAddresses
            });
            return result;
        } catch (error) {
            throw new ErrorHandler(401, error.message)
        }
    }
}

export default new CustomerDb();